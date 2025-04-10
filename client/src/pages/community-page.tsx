import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SOCIETY_DETAILS } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from 'date-fns';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  DollarSign, 
  UserPlus, 
  Building, 
  Home, 
  ChevronRight, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Send, 
  User, 
  Users, 
  ShieldCheck, 
  MessageSquare, 
  LogIn,
  Globe,
  Map as MapIcon,
  MapPin as MapPinIcon,
  Library as LibraryIcon
} from 'lucide-react';
import FlatDisplay from '@/components/community/flat-display';
import AdminPanel from '@/components/community/admin-panel-simplified';
import UserDashboard from '@/components/community/user-dashboard';
import SocietyBlocksDashboard from '@/components/community/society-blocks-dashboard';

// Society interfaces
interface Society {
  id: number;
  name: string;
  description: string;
  monthlyContribution: number;
  totalBlocks: number;
  totalFlats: number;
}

interface SocietyBlock {
  id: number;
  societyId: number;
  blockName: string;
  flatsCount: number;
}

interface SocietyMember {
  id: number;
  userId: number;
  blockId: number;
  flatNumber: string;
  isOwner: boolean;
  status: string;
  phoneNumber: string;
}

interface SocietyContribution {
  id: number;
  societyId: number;
  memberId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  monthYear: string;
  purpose: string;
  status: string;
}

interface SocietyExpense {
  id: number;
  societyId: number;
  title: string;
  description: string;
  amount: number;
  expenseDate: string;
  category: string;
  status: string;
}

interface Discussion {
  id: number;
  societyId: number;
  creatorId: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

interface DiscussionComment {
  id: number;
  discussionId: number;
  userId: number;
  content: string;
  createdAt: string;
}

interface Proposal {
  id: number;
  societyId: number;
  title: string;
  description: string;
  estimatedCost: number;
  status: string;
}

interface Vote {
  id: number;
  proposalId: number;
  userId: number;
  voteType: string;
  comment: string;
}

interface FinancialSummary {
  societyId: number;
  totalContributions: number;
  totalExpenses: number;
  currentBalance: number;
  contributionsByMonth: Record<string, number>;
  expensesByCategory: Record<string, number>;
  currentMonth: {
    monthYear: string;
    expectedTotal: number;
    actualCollection: number;
    collectionRate: number;
    pendingAmount: number;
  };
}

interface PendingContributionsData {
  societyId: number;
  societyName: string;
  monthYear: string;
  monthlyContribution: number;
  flats: FlatContributionStatus[];
}

interface FlatContributionStatus {
  memberId: number;
  userId: number | null;
  blockName: string;
  flatNumber: string;
  fullAddress: string;
  expectedAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'vacant';
  pendingAmount: number;
  phoneNumber: string | null;
  isVacant: boolean;
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
}

// Original interfaces for existing code
interface Campaign {
  id: number;
  name: string;
  description: string;
  goal: number;
  raised: number;
  active: boolean;
}

const CommunityPage = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('society');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [newDiscussionOpen, setNewDiscussionOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', description: '' });
  const [newProposalOpen, setNewProposalOpen] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', description: '', estimatedCost: 0 });
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Original queries
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });
  
  // Society-related queries
  const { data: society, isLoading: societyLoading } = useQuery<Society>({
    queryKey: ['/api/society/1'],
    enabled: activeTab === 'society',
  });
  
  const { data: blocks, isLoading: blocksLoading } = useQuery<SocietyBlock[]>({
    queryKey: ['/api/society/1/blocks'],
    enabled: activeTab === 'society' || activeTab === 'residents',
  });
  
  const { data: financialSummary, isLoading: financialSummaryLoading } = useQuery<FinancialSummary>({
    queryKey: ['/api/society/1/financial-summary'],
    enabled: activeTab === 'society' || activeTab === 'finances',
  });
  
  const { data: members, isLoading: membersLoading } = useQuery<SocietyMember[]>({
    queryKey: ['/api/society/1/members'],
    enabled: activeTab === 'residents',
  });
  
  const { data: pendingContributions, isLoading: pendingContributionsLoading } = useQuery<PendingContributionsData>({
    queryKey: ['/api/society/1/pending-contributions', selectedMonth],
    enabled: activeTab === 'finances',
  });
  
  const { data: expenses, isLoading: expensesLoading } = useQuery<SocietyExpense[]>({
    queryKey: ['/api/society/1/expenses'],
    enabled: activeTab === 'finances',
  });
  
  const { data: discussions, isLoading: discussionsLoading } = useQuery<Discussion[]>({
    queryKey: ['/api/society/1/discussions'],
    enabled: activeTab === 'discussions',
  });
  
  const { data: proposals, isLoading: proposalsLoading } = useQuery<Proposal[]>({
    queryKey: ['/api/society/1/proposals'],
    enabled: activeTab === 'proposals',
  });

  // Mutations
  const createDiscussionMutation = useMutation({
    mutationFn: async (discussionData: { title: string; description: string }) => {
      const res = await apiRequest('POST', '/api/society/1/discussions', {
        ...discussionData,
        societyId: 1,
        creatorId: 1, // Replace with actual user ID when auth is implemented
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/1/discussions'] });
      setNewDiscussionOpen(false);
      setNewDiscussion({ title: '', description: '' });
      toast({
        title: "Success",
        description: "Your discussion topic has been created",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create discussion",
        variant: "destructive",
      });
    }
  });
  
  const createProposalMutation = useMutation({
    mutationFn: async (proposalData: { title: string; description: string; estimatedCost: number }) => {
      const res = await apiRequest('POST', '/api/society/1/proposals', {
        ...proposalData,
        societyId: 1,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/1/proposals'] });
      setNewProposalOpen(false);
      setNewProposal({ title: '', description: '', estimatedCost: 0 });
      toast({
        title: "Success",
        description: "Your proposal has been submitted for community voting",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create proposal",
        variant: "destructive",
      });
    }
  });
  
  const voteOnProposalMutation = useMutation({
    mutationFn: async ({ proposalId, voteType, comment }: { proposalId: number; voteType: string; comment: string }) => {
      const res = await apiRequest('POST', `/api/society/1/proposals/${proposalId}/vote`, {
        proposalId,
        userId: 1, // Replace with actual user ID when auth is implemented
        voteType,
        comment,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/1/proposals'] });
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully submitted",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit your vote",
        variant: "destructive",
      });
    }
  });

  // Original handleVote for backward compatibility
  const handleVote = async () => {
    if (!selectedOption) {
      toast({
        title: "Error",
        description: "Please select an option to vote",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsVoting(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Vote Submitted",
        description: "Your vote has been successfully recorded",
      });
      
      setSelectedOption('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  // Sample community events
  const communityEvents = [
    {
      id: 1,
      month: 'JUN',
      day: '05',
      title: 'Community Feedback Session',
      time: '8:00 PM - After Isha Prayer',
      location: 'Main Prayer Hall'
    },
    {
      id: 2,
      month: 'JUN',
      day: '12',
      title: 'Youth Career Workshop',
      time: '6:00 PM - 8:00 PM',
      location: 'Community Hall'
    },
    {
      id: 3,
      month: 'JUN',
      day: '18',
      title: 'Masjid Committee Meeting',
      time: '7:00 PM - 9:00 PM',
      location: 'Conference Room'
    },
    {
      id: 4,
      month: 'JUN',
      day: '25',
      title: 'Islamic Book Club Discussion',
      time: '5:00 PM - 6:30 PM',
      location: 'Library'
    },
    {
      id: 5,
      month: 'JUL',
      day: '02',
      title: 'Monthly Community Dinner',
      time: '7:30 PM - After Isha Prayer',
      location: 'Dining Hall'
    },
    {
      id: 6,
      month: 'JUL',
      day: '09',
      title: 'Volunteer Coordination Meeting',
      time: '6:30 PM - 8:00 PM',
      location: 'Meeting Room'
    }
  ];

  // Form validation schemas
  const loginSchema = z.object({
    username: z.string().min(1, "Email is required"),
    password: z.string().min(1, "CNIC is required"),
  });

  const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    cnic: z.string().min(13, "CNIC must be valid (13 characters without dashes)").max(15, "CNIC cannot exceed 15 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z.string().min(11, "Phone number must be at least 11 digits"),
    blockName: z.string().min(1, "Block name is required"),
    flatNumber: z.string().min(1, "Flat number is required"),
    isOwner: z.boolean().default(true),
    password: z.string().min(6, "Password must be at least 6 characters")
  });

  // User authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Login form setup
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Registration form setup
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      cnic: "",
      name: "",
      phoneNumber: "",
      blockName: "",
      flatNumber: "",
      isOwner: true,
      password: ""
    }
  });

  // Login form submission
  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    setIsLoggingIn(true);
    
    // This would be an actual API call in production
    setTimeout(() => {
      setIsLoggingIn(false);
      setLoginOpen(false);
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome back to the community dashboard!",
      });
    }, 1000);
  };

  // Registration form submission
  const handleRegister = (values: z.infer<typeof registerSchema>) => {
    setIsRegistering(true);
    
    // This would be an actual API call in production
    setTimeout(() => {
      setIsRegistering(false);
      setRegisterOpen(false);
      toast({
        title: "Registration Successful",
        description: "Your account is pending approval from the community administrator.",
      });
      // Not setting authenticated here since registration requires approval
    }, 1500);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out of your account.",
    });
  };

  return (
    <div className="py-16 bg-[#F7F3E9]">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl md:text-5xl font-heading text-[#0C6E4E] text-center mb-4">Community & Governance Platform</h1>
        <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-8">Building a better world through transparent governance, community participation, and decentralized decision-making.</p>
        
        {/* Philosophical Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-[#0C6E4E] to-[#0C6E4E]/80 text-white p-6">
            <h2 className="text-2xl md:text-3xl font-heading mb-2">The Vision of Masjid-e-Nabawi's Global System</h2>
            <p className="text-lg opacity-90">How our platform transforms society and governance</p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl text-[#0C6E4E] font-medium">
                Our community platform is more than just a digital interface - it's a comprehensive system designed to revolutionize how communities govern themselves, inspired by the principles established at Masjid-e-Nabawi.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#D4AF37] mb-3">The Problem We're Solving</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Current governance systems lack transparency and accountability</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Citizens have limited participation in decision-making processes</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Financial systems are opaque and controlled by centralized authorities</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Communities lack tools for collective management and problem-solving</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-[#0C6E4E] mb-3">Our Solution</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>A hierarchical, transparent governance system from local to global level</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Democratic voting on proposals with live-tracking of implementation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Complete financial transparency with real-time monitoring of resources</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>AI-powered platform that connects communities worldwide</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-[#D4AF37] mb-3">The Hierarchical Structure</h3>
                <p>Our system implements a pyramid structure of governance:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                  <div className="bg-black text-white p-4 rounded-lg text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-medium">Global Level</h4>
                    <p className="text-sm opacity-80">United Nations Admin</p>
                  </div>
                  <div className="bg-red-700 text-white p-4 rounded-lg text-center">
                    <MapIcon className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-medium">Country Level</h4>
                    <p className="text-sm opacity-80">Country Admins</p>
                  </div>
                  <div className="bg-purple-700 text-white p-4 rounded-lg text-center">
                    <MapPinIcon className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-medium">City Level</h4>
                    <p className="text-sm opacity-80">City Admins</p>
                  </div>
                  <div className="bg-blue-700 text-white p-4 rounded-lg text-center">
                    <LibraryIcon className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-medium">Community Level</h4>
                    <p className="text-sm opacity-80">Community Admins</p>
                  </div>
                  <div className="bg-[#0C6E4E] text-white p-4 rounded-lg text-center">
                    <Building className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-medium">Society/Masjid</h4>
                    <p className="text-sm opacity-80">Society Admins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Role Selection Tabs - Improved Mobile Interface */}
        <Tabs defaultValue="user" className="mb-10">
          <TabsList className="grid w-full grid-cols-3 mx-auto max-w-full sm:max-w-sm md:max-w-md gap-1">
            <TabsTrigger value="user" className="flex items-center justify-center text-xs sm:text-sm px-0.5 sm:px-2 py-1 sm:py-2">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-2" />
              <span className="truncate">User Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center justify-center text-xs sm:text-sm px-0.5 sm:px-2 py-1 sm:py-2">
              <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-2" />
              <span className="truncate">Admin Panel</span>
            </TabsTrigger>
            <TabsTrigger value="society" className="flex items-center justify-center text-xs sm:text-sm px-0.5 sm:px-2 py-1 sm:py-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-2" />
              <span className="truncate">Society View</span>
            </TabsTrigger>
          </TabsList>
          
          {/* User Dashboard Content */}
          <TabsContent value="user">
            {isAuthenticated ? (
              <>
                <div className="flex justify-end mb-4">
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
                <UserDashboard userId={1} societyId={1} />
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-[#0C6E4E] text-white p-4">
                    <h2 className="text-2xl font-heading text-center">Community Member Portal</h2>
                  </div>
                  <div className="p-6 text-center">
                    <p className="mb-6">Join our community management system to access member features, track payments, participate in discussions, and vote on community proposals.</p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button onClick={() => setLoginOpen(true)} className="flex-1 max-w-xs mx-auto">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                      <Button onClick={() => setRegisterOpen(true)} variant="outline" className="flex-1 max-w-xs mx-auto">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Featured Community Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-3xl">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Community Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Track monthly contributions and payment history</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Participate in community discussions and decision making</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Vote on society improvement proposals</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Access society expense reports and financial summaries</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Registration Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#0C6E4E] mr-2 mt-0.5 flex-shrink-0" />
                          <span>Valid CNIC number</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#0C6E4E] mr-2 mt-0.5 flex-shrink-0" />
                          <span>Email address for account activation</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#0C6E4E] mr-2 mt-0.5 flex-shrink-0" />
                          <span>Residence details (Block/Flat number)</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-[#0C6E4E] mr-2 mt-0.5 flex-shrink-0" />
                          <span>Contact phone number</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Login Dialog */}
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Login to Community Portal</DialogTitle>
                      <DialogDescription>
                        Enter your email and CNIC to access your community dashboard.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 pt-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CNIC</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your CNIC" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-4 flex justify-between">
                          <Button variant="outline" type="button" onClick={() => {
                            setLoginOpen(false);
                            setRegisterOpen(true);
                          }}>
                            Create Account
                          </Button>
                          <Button type="submit" disabled={isLoggingIn}>
                            {isLoggingIn && (
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            )}
                            Login
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                
                {/* Registration Dialog */}
                <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Register for Community Portal</DialogTitle>
                      <DialogDescription>
                        Fill out the form below to register. Your application will be reviewed by society administrators.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Muhammad Ahmed" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="cnic"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CNIC Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Without dashes" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+92xxxxxxxxxx" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="blockName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Block</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select block" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[...Array(22)].map((_, i) => (
                                      <SelectItem key={i + 1} value={`D-${i + 1}`}>
                                        D-{i + 1}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="flatNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Flat Number</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select flat" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[...Array(8)].map((_, i) => (
                                      <SelectItem key={i + 1} value={`${i + 1}`}>
                                        {i + 1}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormDescription>
                                You'll use this password along with your email to login to your account.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="isOwner"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value}
                                  onCheckedChange={field.onChange} 
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I am the owner of this flat
                                </FormLabel>
                                <FormDescription>
                                  If you're a tenant, please uncheck this box
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter className="pt-4">
                          <Button variant="outline" type="button" onClick={() => {
                            setRegisterOpen(false);
                            setLoginOpen(true);
                          }}>
                            I already have an account
                          </Button>
                          <Button type="submit" disabled={isRegistering}>
                            {isRegistering && (
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            )}
                            Register
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>
          
          {/* Admin Panel Content */}
          <TabsContent value="admin">
            <AdminPanel societyId={1} />
          </TabsContent>
          
          {/* Society View Content - Improved Mobile Interface */}
          <TabsContent value="society">
            <Tabs defaultValue="society" className="mb-10" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-1 mx-auto">
                <TabsTrigger value="society" className="text-xs sm:text-sm py-1.5 px-1">
                  <span className="truncate">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="residents" className="text-xs sm:text-sm py-1.5 px-1">
                  <span className="truncate">Residents</span>
                </TabsTrigger>
                <TabsTrigger value="finances" className="text-xs sm:text-sm py-1.5 px-1">
                  <span className="truncate">Finances</span>
                </TabsTrigger>
                <TabsTrigger value="discussions" className="text-xs sm:text-sm py-1.5 px-1">
                  <span className="truncate">Discussions</span>
                </TabsTrigger>
                <TabsTrigger value="proposals" className="text-xs sm:text-sm py-1.5 px-1">
                  <span className="truncate">Voting</span>
                </TabsTrigger>
              </TabsList>

              {/* Original Society content */}
              <TabsContent value="society">
                <div className="grid md:grid-cols-12 gap-8 mt-6">
                  <div className="md:col-span-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                      <div className="bg-[#0C6E4E] text-white p-4">
                        <h2 className="text-2xl font-heading">Society Overview</h2>
                      </div>
                      <div className="p-6">
                        <div className="prose max-w-none mb-6">
                          <p>Our Federal Government Employees Housing Foundation D Blocks in G-11/4 Islamabad consists of 22 blocks with a total of 176 flats. A monthly contribution of PKR 1,500 per flat is collected to cover electricity, water, waste management, cleaning, and security expenses.</p>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-xl font-medium text-[#0C6E4E] mb-4">Society Structure</h3>
                          
                          {societyLoading || blocksLoading ? (
                            <div className="flex justify-center items-center h-64 bg-gray-100 rounded">
                              <div className="animate-spin w-10 h-10 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                            </div>
                          ) : society && blocks ? (
                            <div className="bg-gray-100 rounded p-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3">Society Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>Name:</span>
                                      <span>{society.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Total Blocks:</span>
                                      <span>{society.totalBlocks}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Total Flats:</span>
                                      <span>{society.totalFlats}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Monthly Contribution:</span>
                                      <span>PKR {society.monthlyContribution}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-3">Monthly Collection</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>Expected Total:</span>
                                      <span>PKR {Number(society.monthlyContribution) * society.totalFlats}</span>
                                    </div>
                                    {financialSummary && (
                                      <>
                                        <div className="flex justify-between">
                                          <span>Current Collection:</span>
                                          <span>PKR {financialSummary.currentMonth.actualCollection}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Collection Rate:</span>
                                          <span>{financialSummary.currentMonth.collectionRate}%</span>
                                        </div>
                                        <div className="flex justify-between font-medium">
                                          <span>Pending Amount:</span>
                                          <span>PKR {financialSummary.currentMonth.pendingAmount}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-100 rounded p-6 text-center">
                              No society data available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Original Residents Content */}
              <TabsContent value="residents">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6">
                  <div className="bg-[#0C6E4E] text-white p-4">
                    <h2 className="text-2xl font-heading">Society Residents</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-medium text-[#0C6E4E]">Resident Directory</h3>
                        <div className="flex items-center">
                          <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by block" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Blocks</SelectItem>
                              {blocks?.map(block => (
                                <SelectItem key={block.id} value={block.blockName}>{block.blockName}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {membersLoading ? (
                        <div className="flex justify-center items-center h-64 bg-gray-100 rounded">
                          <div className="animate-spin w-10 h-10 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                        </div>
                      ) : members && members.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {members
                            .filter(member => selectedBlock === "all" || member.blockId === parseInt(selectedBlock))
                            .map(member => (
                              <div key={member.id} className="border rounded-lg p-4 bg-gray-50">
                                <h4 className="font-medium">Flat {member.flatNumber}</h4>
                                <div className="text-sm mt-2 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${member.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                      {member.status}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span>{member.isOwner ? 'Owner' : 'Tenant'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Contact:</span>
                                    <span>{member.phoneNumber}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="bg-gray-100 rounded p-6 text-center">
                          No resident data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Original Finances Content */}
              <TabsContent value="finances">
                <div className="mt-6">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="bg-[#0C6E4E] text-white p-4">
                      <h2 className="text-2xl font-heading">Financial Transparency</h2>
                    </div>
                    <div className="p-6">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-medium text-[#0C6E4E]">Monthly Contributions</h3>
                          <Input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-[180px]"
                          />
                        </div>
                        
                        {pendingContributionsLoading ? (
                          <div className="flex justify-center items-center h-64 bg-gray-100 rounded">
                            <div className="animate-spin w-10 h-10 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                          </div>
                        ) : pendingContributions ? (
                          <div>
                            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                              <div className="flex flex-wrap justify-between mb-4">
                                <div>
                                  <h4 className="font-medium">Month: {pendingContributions.monthYear}</h4>
                                  <p className="text-sm text-gray-600">Society: {pendingContributions.societyName}</p>
                                </div>
                                <div>
                                  <div className="text-sm">
                                    <span className="text-gray-600">Expected: </span>
                                    <span className="font-medium">PKR {pendingContributions.monthlyContribution * pendingContributions.flats.length}</span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-gray-600">Collected: </span>
                                    <span className="font-medium">PKR {pendingContributions.flats.reduce((sum, flat) => sum + flat.paidAmount, 0)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                <div 
                                  className="bg-[#0C6E4E] h-2.5 rounded-full" 
                                  style={{ 
                                    width: `${Math.min(100, (pendingContributions.flats.reduce((sum, flat) => sum + flat.paidAmount, 0) / 
                                    (pendingContributions.monthlyContribution * pendingContributions.flats.length)) * 100)}%` 
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>0%</span>
                                <span>
                                  {Math.round((pendingContributions.flats.reduce((sum, flat) => sum + flat.paidAmount, 0) / 
                                  (pendingContributions.monthlyContribution * pendingContributions.flats.length)) * 100)}%
                                </span>
                                <span>100%</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {pendingContributions.flats.map((flat) => (
                                <FlatDisplay
                                  key={flat.memberId}
                                  blockName={flat.blockName}
                                  flatNumber={parseInt(flat.flatNumber)}
                                  status={flat.status}
                                  amount={flat.expectedAmount}
                                  paymentDate={flat.paymentDate}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded p-6 text-center">
                            No financial data available for the selected month
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Original Discussions Content */}
              <TabsContent value="discussions">
                <div className="mt-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-medium text-[#0C6E4E]">Community Discussions</h2>
                    <Button onClick={() => setNewDiscussionOpen(true)}>
                      Start New Discussion
                    </Button>
                  </div>
                  
                  {discussionsLoading ? (
                    <div className="flex justify-center items-center h-64 bg-gray-100 rounded">
                      <div className="animate-spin w-10 h-10 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                    </div>
                  ) : discussions && discussions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {discussions.map((discussion) => (
                        <Card key={discussion.id}>
                          <CardHeader>
                            <CardTitle>{discussion.title}</CardTitle>
                            <CardDescription>
                              Created on {new Date(discussion.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-3">{discussion.description}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <div>
                              <Badge variant={discussion.status === 'open' ? 'default' : discussion.status === 'resolved' ? 'success' : 'secondary'}>
                                {discussion.status}
                              </Badge>
                            </div>
                            <Button variant="outline">
                              View Discussion
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-6">No discussions found</p>
                        <Button onClick={() => setNewDiscussionOpen(true)}>
                          Start the First Discussion
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Dialog open={newDiscussionOpen} onOpenChange={setNewDiscussionOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create a New Discussion</DialogTitle>
                        <DialogDescription>
                          Share a topic for community discussion
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Title</label>
                          <Input 
                            value={newDiscussion.title}
                            onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                            placeholder="Give your discussion a clear title"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <textarea 
                            value={newDiscussion.description}
                            onChange={(e) => setNewDiscussion({...newDiscussion, description: e.target.value})}
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            placeholder="Describe your topic in detail"
                          ></textarea>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <Button variant="outline" onClick={() => setNewDiscussionOpen(false)}>Cancel</Button>
                        <Button 
                          onClick={() => createDiscussionMutation.mutate(newDiscussion)}
                          disabled={!newDiscussion.title || !newDiscussion.description}
                        >
                          Create Discussion
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>

              {/* Original Proposals Content */}
              <TabsContent value="proposals">
                <div className="mt-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-medium text-[#0C6E4E]">Community Proposals & Voting</h2>
                    <Button onClick={() => setNewProposalOpen(true)}>Create New Proposal</Button>
                  </div>
                  
                  {proposalsLoading ? (
                    <div className="flex justify-center items-center h-64 bg-gray-100 rounded">
                      <div className="animate-spin w-10 h-10 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                    </div>
                  ) : proposals && proposals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {proposals.map((proposal) => (
                        <Card key={proposal.id}>
                          <CardHeader>
                            <CardTitle>{proposal.title}</CardTitle>
                            <CardDescription>
                              Estimated Cost: PKR {proposal.estimatedCost.toLocaleString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-3">{proposal.description}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <div>
                              <Badge variant={
                                proposal.status === 'approved' || proposal.status === 'implemented' ? 'success' : 
                                proposal.status === 'rejected' ? 'destructive' : 
                                proposal.status === 'voting' ? 'default' : 'secondary'
                              }>
                                {proposal.status}
                              </Badge>
                            </div>
                            <Button 
                              variant="outline"
                              disabled={proposal.status !== 'voting'}
                            >
                              {proposal.status === 'voting' ? 'Cast Vote' : 'View Details'}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-6">No proposals found</p>
                        <Button onClick={() => setNewProposalOpen(true)}>Create New Proposal</Button>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Dialog open={newProposalOpen} onOpenChange={setNewProposalOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create a New Proposal</DialogTitle>
                        <DialogDescription>
                          Submit a proposal for community voting
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Title</label>
                          <Input 
                            value={newProposal.title}
                            onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                            placeholder="Proposal title"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <textarea 
                            value={newProposal.description}
                            onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            placeholder="Describe your proposal in detail"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Estimated Cost (PKR)</label>
                          <Input 
                            type="number"
                            min="0"
                            value={newProposal.estimatedCost}
                            onChange={(e) => setNewProposal({...newProposal, estimatedCost: Number(e.target.value)})}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <Button variant="outline" onClick={() => setNewProposalOpen(false)}>Cancel</Button>
                        <Button 
                          onClick={() => createProposalMutation.mutate(newProposal)}
                          disabled={!newProposal.title || !newProposal.description}
                        >
                          Submit Proposal
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityPage;