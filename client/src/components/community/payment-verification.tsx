import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  CalendarDays,
  Building,
  User,
  Clock,
  ReceiptText,
  ArrowUpRight,
  AlertCircle,
  PlusCircle,
  Search,
  Filter,
  Loader2
} from 'lucide-react';

// Types for Payment Data
interface SocietyMember {
  id: number;
  name: string;
  blockId: number;
  blockName: string;
  flatNumber: string;
  status: 'active' | 'pending' | 'inactive';
  balanceAmount: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
}

interface PaymentRecord {
  id: number;
  memberId: number;
  memberName: string;
  blockName: string;
  flatNumber: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'easypaisa' | 'jazzcash' | 'other';
  receiptNumber: string;
  description: string;
  status: 'verified' | 'pending' | 'rejected';
  verificationDate?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

// Schema for Payment Verification Form
const paymentVerificationSchema = z.object({
  memberId: z.number(),
  memberName: z.string(),
  blockName: z.string(),
  flatNumber: z.string(),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'easypaisa', 'jazzcash', 'other']),
  receiptNumber: z.string().min(1, 'Receipt number is required'),
  description: z.string().optional(),
  status: z.enum(['verified', 'pending', 'rejected']).default('verified'),
  rejectionReason: z.string().optional(),
});

type PaymentVerificationFormValues = z.infer<typeof paymentVerificationSchema>;

export default function PaymentVerification() {
  const [filterMonth, setFilterMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Fetch members data
  const { data: members, isLoading: membersLoading } = useQuery<SocietyMember[]>({
    queryKey: ['/api/society/1/members'],
  });
  
  // Fetch payment records
  const { data: paymentRecords, isLoading: paymentsLoading } = useQuery<PaymentRecord[]>({
    queryKey: ['/api/society/1/payments', filterMonth],
  });
  
  // Filter and search payment records
  const filteredPayments = paymentRecords?.filter(payment => {
    // First filter by month
    const paymentMonth = payment.paymentDate.substring(0, 7); // Extract YYYY-MM
    const matchesMonth = paymentMonth === filterMonth;
    
    // Then search by member name, block, flat number, or receipt number if search query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return matchesMonth && (
        payment.memberName.toLowerCase().includes(query) ||
        payment.blockName.toLowerCase().includes(query) ||
        payment.flatNumber.toLowerCase().includes(query) ||
        payment.receiptNumber.toLowerCase().includes(query)
      );
    }
    
    return matchesMonth;
  });
  
  // Record a new payment
  const recordPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentVerificationFormValues) => {
      const res = await apiRequest('POST', '/api/society/1/payments', paymentData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to record payment');
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/1/payments'] });
      toast({
        title: 'Payment Recorded',
        description: 'The payment has been successfully recorded.',
      });
      setPaymentDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Verify a payment
  const verifyPaymentMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { id: number, status: 'verified' | 'rejected', rejectionReason?: string }) => {
      const res = await apiRequest('PATCH', `/api/society/1/payments/${id}/verify`, { 
        status, 
        rejectionReason,
        verificationDate: new Date().toISOString(),
        verifiedBy: 'Admin' // Would be the actual admin name in production
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to verify payment');
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/1/payments'] });
      toast({
        title: 'Payment Updated',
        description: 'The payment status has been updated successfully.',
      });
      setVerificationDialogOpen(false);
      setSelectedPayment(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Payment form setup
  const paymentForm = useForm<PaymentVerificationFormValues>({
    resolver: zodResolver(paymentVerificationSchema),
    defaultValues: {
      amount: 1500, // Default contribution amount
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: 'cash',
      receiptNumber: '',
      description: 'Monthly contribution',
      status: 'verified',
    },
  });
  
  // Verification form setup
  const verificationForm = useForm<{ status: 'verified' | 'rejected', rejectionReason?: string }>({
    defaultValues: {
      status: 'verified',
      rejectionReason: '',
    },
  });
  
  // Handle payment form submission
  const onPaymentSubmit = (values: PaymentVerificationFormValues) => {
    recordPaymentMutation.mutate(values);
  };
  
  // Handle verification form submission
  const onVerificationSubmit = (values: { status: 'verified' | 'rejected', rejectionReason?: string }) => {
    if (selectedPayment) {
      verifyPaymentMutation.mutate({
        id: selectedPayment.id,
        status: values.status,
        rejectionReason: values.status === 'rejected' ? values.rejectionReason : undefined,
      });
    }
  };
  
  // Handle member selection in payment dialog
  const handleMemberSelection = (memberId: number) => {
    const member = members?.find(m => m.id === memberId);
    
    if (member) {
      paymentForm.setValue('memberId', member.id);
      paymentForm.setValue('memberName', member.name);
      paymentForm.setValue('blockName', member.blockName);
      paymentForm.setValue('flatNumber', member.flatNumber);
      
      // Generate a receipt number
      const receiptNumber = `SOC-${format(new Date(), 'yyMM')}-${member.id}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      paymentForm.setValue('receiptNumber', receiptNumber);
    }
  };
  
  // Handle opening the verification dialog
  const handleOpenVerificationDialog = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    verificationForm.setValue('status', payment.status === 'pending' ? 'verified' : payment.status);
    verificationForm.setValue('rejectionReason', payment.rejectionReason || '');
    setVerificationDialogOpen(true);
  };
  
  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Function to get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'bank_transfer':
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      case 'easypaisa':
      case 'jazzcash':
        return <ReceiptText className="h-4 w-4 text-purple-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // Calculate payment statistics
  const paymentStats = {
    total: filteredPayments?.length || 0,
    verified: filteredPayments?.filter(p => p.status === 'verified').length || 0,
    pending: filteredPayments?.filter(p => p.status === 'pending').length || 0,
    rejected: filteredPayments?.filter(p => p.status === 'rejected').length || 0,
    totalAmount: filteredPayments?.reduce((sum, p) => sum + p.amount, 0) || 0,
    verifiedAmount: filteredPayments?.filter(p => p.status === 'verified').reduce((sum, p) => sum + p.amount, 0) || 0,
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Payment Verification</h2>
          <p className="text-muted-foreground">Verify and manage community payments</p>
        </div>
        
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Record New Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>
                Enter the details of the payment to record it in the system.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                <div className="space-y-4 py-2">
                  <FormField
                    control={paymentForm.control}
                    name="memberId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Member</FormLabel>
                        <Select
                          onValueChange={(value) => handleMemberSelection(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {members?.map((member) => (
                              <SelectItem
                                key={member.id}
                                value={member.id.toString()}
                              >
                                {member.name} ({member.blockName}-{member.flatNumber})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={paymentForm.control}
                      name="blockName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Block</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentForm.control}
                      name="flatNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Flat Number</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={paymentForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (PKR)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentForm.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={paymentForm.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                              <SelectItem value="easypaisa">EasyPaisa</SelectItem>
                              <SelectItem value="jazzcash">JazzCash</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentForm.control}
                      name="receiptNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Receipt Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={paymentForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Optional description for this payment
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={recordPaymentMutation.isPending}
                  >
                    {recordPaymentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Record Payment"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentStats.total}</div>
            <p className="text-xs text-muted-foreground">
              For {format(new Date(filterMonth), 'MMMM yyyy')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {paymentStats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {paymentStats.verified} verified payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              PKR {paymentStats.verifiedAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((paymentStats.verifiedAmount / paymentStats.totalAmount) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{paymentStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Payments awaiting verification
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search payments..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={filterMonth}
            onValueChange={setFilterMonth}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const value = format(date, 'yyyy-MM');
                return (
                  <SelectItem key={value} value={value}>
                    {format(date, 'MMMM yyyy')}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline" className="gap-1">
            <ReceiptText className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {membersLoading || paymentsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPayments && filteredPayments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Block/Flat</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                    <TableCell>{payment.memberName}</TableCell>
                    <TableCell>{payment.blockName}-{payment.flatNumber}</TableCell>
                    <TableCell>{format(new Date(payment.paymentDate), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="capitalize">
                          {payment.paymentMethod.replace('_', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>PKR {payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenVerificationDialog(payment)}
                            >
                              {payment.status === 'pending' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {payment.status === 'pending' ? 'Verify Payment' : 'Review Payment'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <ReceiptText className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-muted-foreground">No payment records found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search or filters' : 'Record your first payment using the button above'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Verification Dialog */}
      <Dialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPayment?.status === 'pending' ? 'Verify Payment' : 'Review Payment'}
            </DialogTitle>
            <DialogDescription>
              {selectedPayment?.status === 'pending'
                ? 'Confirm that this payment has been received and is valid.'
                : 'Review the payment details and update status if needed.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Member</p>
                  <p className="text-sm">{selectedPayment.memberName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Block/Flat</p>
                  <p className="text-sm">{selectedPayment.blockName}-{selectedPayment.flatNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-sm">PKR {selectedPayment.amount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Payment Date</p>
                  <p className="text-sm">{format(new Date(selectedPayment.paymentDate), 'dd MMMM yyyy')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Method</p>
                  <p className="text-sm capitalize">{selectedPayment.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Receipt Number</p>
                  <p className="text-sm">{selectedPayment.receiptNumber}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm">{selectedPayment.description || 'No description provided'}</p>
                </div>
                {selectedPayment.verificationDate && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Verified On</p>
                      <p className="text-sm">{format(new Date(selectedPayment.verificationDate), 'dd MMM yyyy')}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Verified By</p>
                      <p className="text-sm">{selectedPayment.verifiedBy || 'System'}</p>
                    </div>
                  </>
                )}
                {selectedPayment.rejectionReason && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm font-medium">Rejection Reason</p>
                    <p className="text-sm">{selectedPayment.rejectionReason}</p>
                  </div>
                )}
              </div>
              
              <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Update Status</p>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="verify"
                          checked={verificationForm.watch('status') === 'verified'}
                          onCheckedChange={() => verificationForm.setValue('status', 'verified')}
                        />
                        <label
                          htmlFor="verify"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Verify
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="reject"
                          checked={verificationForm.watch('status') === 'rejected'}
                          onCheckedChange={() => verificationForm.setValue('status', 'rejected')}
                        />
                        <label
                          htmlFor="reject"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Reject
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {verificationForm.watch('status') === 'rejected' && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Rejection Reason</p>
                      <Input
                        placeholder="Explain why this payment is being rejected"
                        value={verificationForm.watch('rejectionReason') || ''}
                        onChange={(e) => verificationForm.setValue('rejectionReason', e.target.value)}
                      />
                    </div>
                  )}
                </div>
                
                <DialogFooter className="mt-4">
                  <Button
                    type="submit"
                    disabled={verifyPaymentMutation.isPending}
                    variant={verificationForm.watch('status') === 'rejected' ? 'destructive' : 'default'}
                  >
                    {verifyPaymentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : verificationForm.watch('status') === 'rejected' ? (
                      "Reject Payment"
                    ) : (
                      "Verify Payment"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}