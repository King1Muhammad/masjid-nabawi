import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useRouter, useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentVerification from '@/components/community/payment-verification';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ShieldCheck,
  Users,
  CreditCard,
  Building,
  LogOut,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserPlus,
  Settings,
  FileText,
  Vote,
  PieChart,
  DollarSign,
  AlertCircle,
  Globe,
  MapPin,
  Map,
  LibraryBig,
  ArrowUpCircle,
  ArrowDownCircle,
  PlusCircle
} from 'lucide-react';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'society' | 'community' | 'city' | 'country' | 'global';
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  managedEntities: string[];
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [adminRole, setAdminRole] = useState<string>('society');
  
  // Fetch current admin info
  const { data: currentAdmin, isLoading, error } = useQuery<AdminUser>({
    queryKey: ['/api/admin/current'],
    queryFn: async () => {
      const res = await fetch('/api/admin/current');
      if (!res.ok) {
        if (res.status === 401) {
          // If unauthorized, redirect to auth page
          setLocation('/admin/auth');
          throw new Error('Please log in to access admin dashboard');
        }
        throw new Error('Failed to fetch admin data');
      }
      return res.json();
    }
  });
  
  // Fetch admins under current admin
  const { data: managedAdmins, isLoading: isLoadingManagedAdmins } = useQuery<AdminUser[]>({
    queryKey: ['/api/admins/managed'],
    queryFn: async () => {
      const res = await fetch('/api/admins/managed');
      if (!res.ok) {
        throw new Error('Failed to fetch managed admins');
      }
      return res.json();
    },
    enabled: !!currentAdmin
  });
  
  // Society data
  const { data: societyStats, isLoading: isLoadingSocietyStats } = useQuery({
    queryKey: ['/api/society/stats'],
    queryFn: async () => {
      const res = await fetch('/api/society/stats');
      if (!res.ok) {
        throw new Error('Failed to fetch society statistics');
      }
      return res.json();
    },
    enabled: !!currentAdmin && currentAdmin.role === 'society'
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/admin/logout');
      if (!res.ok) {
        throw new Error('Failed to logout');
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/current'] });
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of the admin panel.'
      });
      // Redirect to auth page
      setLocation('/admin/auth');
    },
    onError: (error: any) => {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logoutMutation.mutate();
    }
  };
  
  // Admin roles array with colors and icons
  const adminRoles = [
    {
      id: 'society',
      name: 'Society Admin',
      icon: <Building className="h-5 w-5" />,
      description: 'Masjid Imam level access',
      color: '#0C6E4E'
    },
    {
      id: 'community',
      name: 'Community Admin',
      icon: <LibraryBig className="h-5 w-5" />,
      description: 'Manage multiple societies',
      color: '#2563EB'
    },
    {
      id: 'city',
      name: 'City Admin',
      icon: <MapPin className="h-5 w-5" />,
      description: 'Oversee communities in a city',
      color: '#9333EA'
    },
    {
      id: 'country',
      name: 'Country Admin',
      icon: <Map className="h-5 w-5" />,
      description: 'Coordinate all cities',
      color: '#E11D48'
    },
    {
      id: 'global',
      name: 'Global Admin',
      icon: <Globe className="h-5 w-5" />,
      description: 'Worldwide administration',
      color: '#18181B'
    }
  ];
  
  // Find current admin role info
  const currentRoleInfo = adminRoles.find(role => role.id === currentAdmin?.role);
  
  // If loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  // If error or no admin data, show error message
  if (error || !currentAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              {error instanceof Error ? error.message : 'You need to be authenticated to access the admin panel.'}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/admin/auth')}
            >
              Go to Login
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6 pb-16" 
      style={{ 
        backgroundColor: currentRoleInfo ? `${currentRoleInfo.color}05` : undefined,
        borderColor: currentRoleInfo ? currentRoleInfo.color : undefined 
      }}
    >
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full" 
            style={{ 
              backgroundColor: currentRoleInfo ? `${currentRoleInfo.color}15` : undefined,
              color: currentRoleInfo?.color 
            }}
          >
            {currentRoleInfo?.icon || <ShieldCheck className="h-6 w-6" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              <span style={{ color: currentRoleInfo?.color }}>{currentRoleInfo?.name}</span>
              {' - '}{currentAdmin.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-200 border-0">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Active
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
      
      {/* Main Tabs */}
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="py-2 gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="py-2 gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Members</span>
          </TabsTrigger>
          <TabsTrigger value="finances" className="py-2 gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden md:inline">Finances</span>
          </TabsTrigger>
          <TabsTrigger value="admins" className="py-2 gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden md:inline">Admins</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="py-2 gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingSocietyStats ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    societyStats?.totalMembers || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active members in your society
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingSocietyStats ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    `PKR ${(societyStats?.monthlyCollections || 0).toLocaleString()}`
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isLoadingSocietyStats ? '...' : 
                    `${societyStats?.collectionRate || 0}% collection rate this month`
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingSocietyStats ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    societyStats?.pendingRegistrations || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Member registrations awaiting approval
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingSocietyStats ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    `PKR ${(societyStats?.availableBalance || 0).toLocaleString()}`
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current society funds after expenses
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest admin activities</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSocietyStats ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : societyStats?.recentActivities?.length > 0 ? (
                  <div className="space-y-4">
                    {societyStats.recentActivities.map((activity: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 pb-3 border-b">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'approval' ? 'bg-green-100 text-green-600' :
                          activity.type === 'rejection' ? 'bg-red-100 text-red-600' :
                          activity.type === 'financial' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.type === 'approval' && <CheckCircle className="h-4 w-4" />}
                          {activity.type === 'rejection' && <XCircle className="h-4 w-4" />}
                          {activity.type === 'financial' && <DollarSign className="h-4 w-4" />}
                          {activity.type === 'other' && <AlertCircle className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent activities to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Admin Status</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Account Type</p>
                  <p className="text-sm text-muted-foreground">{currentRoleInfo?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-sm text-muted-foreground">{currentAdmin.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{currentAdmin.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Login</p>
                  <p className="text-sm text-muted-foreground">
                    {currentAdmin.lastLogin ? new Date(currentAdmin.lastLogin).toLocaleString() : 'First login'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Admin Since</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentAdmin.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" /> Account Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Member Management</CardTitle>
                <CardDescription>Manage society members and registrations</CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" /> Add Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Search members..." />
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by block" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Blocks</SelectItem>
                        <SelectItem value="D-1">D-1</SelectItem>
                        <SelectItem value="D-2">D-2</SelectItem>
                        {/* Add all blocks D-1 through D-22 */}
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" /> Export
                    </Button>
                  </div>
                </div>
                
                {/* Members table would go here */}
                <div className="border rounded-md">
                  <div className="py-12 text-center text-muted-foreground">
                    <p>Member list will be displayed here</p>
                    <p className="text-sm">Total members: {societyStats?.totalMembers || 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pending Registrations</CardTitle>
              <CardDescription>
                New member registrations awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSocietyStats ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : societyStats?.pendingRegistrations > 0 ? (
                <div className="border rounded-md">
                  {/* Registration approval interface would go here */}
                  <div className="py-12 text-center text-muted-foreground">
                    <p>Registration approval interface will be displayed here</p>
                    <p className="text-sm">Pending registrations: {societyStats?.pendingRegistrations || 0}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No pending registrations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Finances Tab */}
        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Management</CardTitle>
              <CardDescription>Track payments, expenses and financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="payment-verification" className="w-full">
                <TabsList className="w-full justify-start mb-4">
                  <TabsTrigger value="payment-verification">
                    Payment Verification
                  </TabsTrigger>
                  <TabsTrigger value="expenses">
                    Expenses
                  </TabsTrigger>
                  <TabsTrigger value="reports">
                    Financial Reports
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="payment-verification">
                  <PaymentVerification />
                </TabsContent>
                <TabsContent value="expenses">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Collections</CardTitle>
                <CardDescription>Current month contribution status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Total Expected</p>
                    <p className="text-2xl font-bold">
                      PKR {(societyStats?.expectedCollections || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Collected</p>
                    <p className="text-2xl font-bold text-green-600">
                      PKR {(societyStats?.monthlyCollections || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {societyStats?.collectionRate || 0}% collection rate
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Remaining</p>
                    <p className="text-2xl font-bold text-amber-600">
                      PKR {((societyStats?.expectedCollections || 0) - (societyStats?.monthlyCollections || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>Monthly society expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">
                      PKR {(societyStats?.monthlyExpenses || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Main Categories</p>
                    <ul className="space-y-2 mt-2">
                      <li className="flex justify-between">
                        <span className="text-sm">Maintenance</span>
                        <span className="text-sm font-medium">PKR {(societyStats?.expensesByCategory?.maintenance || 0).toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Utilities</span>
                        <span className="text-sm font-medium">PKR {(societyStats?.expensesByCategory?.utilities || 0).toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Security</span>
                        <span className="text-sm font-medium">PKR {(societyStats?.expensesByCategory?.security || 0).toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Other</span>
                        <span className="text-sm font-medium">PKR {(societyStats?.expensesByCategory?.other || 0).toLocaleString()}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Balance Summary</CardTitle>
                <CardDescription>Current financial status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Available Balance</p>
                    <p className="text-2xl font-bold">
                      PKR {(societyStats?.availableBalance || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">YTD Collections</p>
                    <p className="text-lg font-medium text-green-600">
                      PKR {(societyStats?.ytdCollections || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">YTD Expenses</p>
                    <p className="text-lg font-medium text-red-600">
                      PKR {(societyStats?.ytdExpenses || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full gap-2">
                      <FileText className="h-4 w-4" /> Generate Financial Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Record Transactions</CardTitle>
                <CardDescription>Add new contributions or expenses</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Add Expense</Button>
                <Button size="sm">Record Contribution</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="py-12 text-center text-muted-foreground">
                  <p>Transaction recording interface will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Admins Tab */}
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Management</CardTitle>
                <CardDescription>
                  Manage {currentRoleInfo?.name.toLowerCase()} administrators
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" /> Register New Admin
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Search admins..." />
                    <Select defaultValue={currentAdmin.role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        {adminRoles.map(role => (
                          <SelectItem 
                            key={role.id} 
                            value={role.id}
                            disabled={
                              // Can only see admins at your level or below
                              adminRoles.findIndex(r => r.id === role.id) > 
                              adminRoles.findIndex(r => r.id === currentAdmin.role)
                            }
                          >
                            <div className="flex items-center gap-2">
                              <div style={{ color: role.color }}>
                                {role.icon}
                              </div>
                              <span>{role.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Admins table */}
                <div className="border rounded-md">
                  {isLoadingManagedAdmins ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : managedAdmins && managedAdmins.length > 0 ? (
                    <div className="divide-y">
                      {managedAdmins.map(admin => (
                        <div key={admin.id} className="p-4 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full" 
                              style={{ 
                                backgroundColor: adminRoles.find(r => r.id === admin.role)?.color + '15',
                                color: adminRoles.find(r => r.id === admin.role)?.color 
                              }}
                            >
                              {adminRoles.find(r => r.id === admin.role)?.icon || <ShieldCheck className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium">{admin.name}</p>
                              <p className="text-sm text-muted-foreground">{admin.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant={admin.status === 'active' ? 'default' : 
                                          admin.status === 'pending' ? 'outline' : 'destructive'}
                                  className="text-xs"
                                >
                                  {admin.status === 'active' ? 'Active' : 
                                   admin.status === 'pending' ? 'Pending Approval' : 'Suspended'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {adminRoles.find(r => r.id === admin.role)?.name}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {admin.status === 'pending' && (
                              <Button size="sm" variant="outline" className="gap-1">
                                <CheckCircle className="h-3 w-3" /> Approve
                              </Button>
                            )}
                            {admin.status === 'active' && (
                              <Button size="sm" variant="destructive" className="gap-1">
                                <XCircle className="h-3 w-3" /> Suspend
                              </Button>
                            )}
                            {admin.status === 'suspended' && (
                              <Button size="sm" variant="outline" className="gap-1">
                                <CheckCircle className="h-3 w-3" /> Reinstate
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No administrators found at this level.</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setActiveTab('overview')}
                      >
                        Return to dashboard
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> As a {currentRoleInfo?.name.toLowerCase()}, you can manage administrators at your level or below.
              </p>
              <Alert variant="outline" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Admin Hierarchy System</AlertTitle>
                <AlertDescription>
                  <p className="text-sm">
                    The admin hierarchy follows a structure where each level can manage administrators below them:
                  </p>
                  <div className="flex items-center gap-1 text-sm mt-2">
                    <span className="font-medium">Global</span> → 
                    <span className="font-medium">Country</span> → 
                    <span className="font-medium">City</span> → 
                    <span className="font-medium">Community</span> → 
                    <span className="font-medium">Society</span>
                  </div>
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Account Settings</CardTitle>
              <CardDescription>Manage your administrator account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input defaultValue={currentAdmin.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input defaultValue={currentAdmin.email} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <Input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive email alerts for important events
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive text messages for urgent notifications
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          
          {currentAdmin.role === 'society' && (
            <Card>
              <CardHeader>
                <CardTitle>Society Settings</CardTitle>
                <CardDescription>Manage society configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Society Name</label>
                      <Input defaultValue="FGEHF D Blocks" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Monthly Contribution Amount</label>
                      <Input type="number" defaultValue="1500" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Block Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure blocks and flats in your society
                  </p>
                  <Button variant="outline" size="sm">
                    Manage Blocks
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Payment Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure payment methods, reminders, and notifications
                  </p>
                  <Button variant="outline" size="sm">
                    Payment Settings
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Society Settings</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}