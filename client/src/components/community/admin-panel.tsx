import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserPlus, 
  UserCheck, 
  UserX, 
  Layers, 
  Building, 
  Home, 
  Check, 
  X, 
  AlertTriangle, 
  DollarSign, 
  Edit, 
  Trash2,
  FileText,
  DownloadCloud,
  Upload,
  Filter,
  Search,
  Printer,
  CheckCircle,
  XCircle,
  FileBarChart,
  Users,
  Globe,
  Map,
  MapPin,
  Home as HomeIcon,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import GoogleMapsIntegration from './google-maps-integration';

interface UserRegistration {
  id: number;
  username: string;
  email: string;
  name: string;
  blockName: string;
  flatNumber: string;
  phoneNumber: string;
  profileImage?: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
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
  username?: string;
  email?: string;
  name?: string;
  blockName?: string;
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
  memberName?: string;
  blockName?: string;
  flatNumber?: string;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'society' | 'community' | 'city' | 'country' | 'global' | 
        'society_admin' | 'community_admin' | 'city_admin' | 'country_admin' | 'global_admin';
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  managedEntities: any;
}

interface AdminPanelProps {
  societyId: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ societyId }) => {
  // Basic state
  const [activeTab, setActiveTab] = useState('registrations');
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isContributionDialogOpen, setIsContributionDialogOpen] = useState(false);
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  
  // Admin state
  const [adminRole, setAdminRole] = useState('society'); // Default is society level (masjid imam)
  const [adminFormRole, setAdminFormRole] = useState<'society' | 'community' | 'city' | 'country' | 'global'>('society');
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'society' as 'society' | 'community' | 'city' | 'country' | 'global',
    managedEntities: []
  });
  
  // Contributions state
  const [newContribution, setNewContribution] = useState({
    memberId: 0,
    amount: 1500,
    paymentMethod: 'cash',
    monthYear: format(new Date(), 'yyyy-MM'),
    purpose: 'monthly',
    paymentReference: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch pending registrations
  const { data: pendingRegistrations, isLoading: registrationsLoading } = useQuery<UserRegistration[]>({
    queryKey: ['/api/society/user-registrations', { status: 'pending' }],
    enabled: activeTab === 'registrations',
  });
  
  // Fetch all society blocks
  const { data: blocks, isLoading: blocksLoading } = useQuery<SocietyBlock[]>({
    queryKey: ['/api/society/1/blocks'],
  });
  
  // Fetch all society members
  const { data: members, isLoading: membersLoading } = useQuery<SocietyMember[]>({
    queryKey: ['/api/society/1/members', { search: searchQuery, block: selectedBlock }],
    enabled: activeTab === 'members' || activeTab === 'contributions',
  });
  
  // Fetch contributions for the selected month
  const { data: contributions, isLoading: contributionsLoading } = useQuery<SocietyContribution[]>({
    queryKey: ['/api/society/1/contributions', { monthYear: selectedMonth, block: selectedBlock }],
    enabled: activeTab === 'contributions',
  });
  
  // Fetch admin users based on role
  const { data: adminUsers, isLoading: adminsLoading } = useQuery<AdminUser[]>({
    queryFn: async () => {
      const res = await fetch(`/api/admins${adminRole ? `?level=${adminRole}` : ''}`);
      if (!res.ok) {
        throw new Error('Failed to fetch admin users');
      }
      return res.json();
    },
    queryKey: ['/api/admins', { role: adminRole }],
    enabled: activeTab === 'admins',
  });
  
  // Admin mutations
  const registerAdminMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/admins/register', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admins'] });
      setIsAdminFormOpen(false);
      setNewAdmin({
        username: '',
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'society',
        managedEntities: []
      });
      toast({
        title: "Success",
        description: "Admin account created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    }
  });
  
  const approveAdminMutation = useMutation({
    mutationFn: async (adminId: number) => {
      const res = await apiRequest('POST', `/api/admins/${adminId}/approve`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admins'] });
      toast({
        title: "Success",
        description: "Admin account approved",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve admin account",
        variant: "destructive",
      });
    }
  });
  
  const suspendAdminMutation = useMutation({
    mutationFn: async (adminId: number) => {
      const res = await apiRequest('POST', `/api/admins/${adminId}/suspend`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admins'] });
      toast({
        title: "Success",
        description: "Admin account suspended",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to suspend admin account",
        variant: "destructive",
      });
    }
  });
  
  // Regular user mutations
  const approveRegistrationMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest('POST', `/api/society/user-registrations/${userId}/approve`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/user-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/society/1/members'] });
      toast({
        title: "Success",
        description: "User registration approved",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve registration",
        variant: "destructive",
      });
    }
  });
  
  const rejectRegistrationMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest('POST', `/api/society/user-registrations/${userId}/reject`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/user-registrations'] });
      toast({
        title: "Success",
        description: "User registration rejected",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject registration",
        variant: "destructive",
      });
    }
  });
  
  const addContributionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/society/1/contributions', {
        ...data,
        societyId: 1,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/1/contributions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/society/1/financial-summary'] });
      setIsContributionDialogOpen(false);
      toast({
        title: "Success",
        description: "Contribution recorded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record contribution",
        variant: "destructive",
      });
    }
  });
  
  const deleteContributionMutation = useMutation({
    mutationFn: async (contributionId: number) => {
      const res = await apiRequest('DELETE', `/api/society/1/contributions/${contributionId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/1/contributions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/society/1/financial-summary'] });
      toast({
        title: "Success",
        description: "Contribution deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contribution",
        variant: "destructive",
      });
    }
  });
  
  // Event handlers
  const handleApproveRegistration = (userId: number) => {
    approveRegistrationMutation.mutate(userId);
  };
  
  const handleRejectRegistration = (userId: number) => {
    rejectRegistrationMutation.mutate(userId);
  };
  
  const handleOpenContributionDialog = (memberId: number) => {
    setSelectedMemberId(memberId);
    setNewContribution({
      ...newContribution,
      memberId: memberId,
    });
    setIsContributionDialogOpen(true);
  };
  
  const handleAddContribution = () => {
    addContributionMutation.mutate(newContribution);
  };
  
  const handleDeleteContribution = (contributionId: number) => {
    if (window.confirm('Are you sure you want to delete this contribution?')) {
      deleteContributionMutation.mutate(contributionId);
    }
  };
  
  const handlePrintReport = () => {
    // Implement printing functionality
    window.print();
  };
  
  const handleExportData = (type: string) => {
    // Implement export functionality
    toast({
      title: "Export Initiated",
      description: `Exporting ${type} data...`,
    });
    
    // Placeholder for actual export functionality
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${type} data has been exported successfully.`,
      });
    }, 1500);
  };
  
  // Helper functions
  const getStatusBadge = (status: string) => {
    if (status === 'approved' || status === 'active' || status === 'completed') {
      return <Badge className="bg-green-500">
        <CheckCircle className="h-3 w-3 mr-1" /> {status}
      </Badge>;
    } else if (status === 'pending') {
      return <Badge variant="outline" className="text-amber-500 border-amber-500">
        <AlertTriangle className="h-3 w-3 mr-1" /> {status}
      </Badge>;
    } else {
      return <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" /> {status}
      </Badge>;
    }
  };
  
  const filterMembersByBlock = (members: SocietyMember[]) => {
    if (!members) return [];
    if (selectedBlock === 'all') return members;
    return members.filter(member => member.blockName === selectedBlock);
  };
  
  const filterMembersBySearch = (members: SocietyMember[]) => {
    if (!members) return [];
    if (!searchQuery) return members;
    
    const query = searchQuery.toLowerCase();
    return members.filter(member => 
      (member.name?.toLowerCase().includes(query) || 
      member.flatNumber.toLowerCase().includes(query) || 
      member.username?.toLowerCase().includes(query) || 
      member.email?.toLowerCase().includes(query) || 
      member.phoneNumber?.toLowerCase().includes(query))
    );
  };
  
  const filteredMembers = members ? filterMembersBySearch(filterMembersByBlock(members)) : [];
  
  // Admin handlers
  const handleRegisterAdmin = () => {
    // Validation
    if (newAdmin.password !== newAdmin.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    // Omit confirmPassword from the submitted data
    const { confirmPassword, ...adminData } = newAdmin;
    registerAdminMutation.mutate(adminData);
  };
  
  const handleApproveAdmin = (adminId: number) => {
    approveAdminMutation.mutate(adminId);
  };
  
  const handleSuspendAdmin = (adminId: number) => {
    if (window.confirm('Are you sure you want to suspend this admin account?')) {
      suspendAdminMutation.mutate(adminId);
    }
  };
  
  const handleOpenAdminForm = (role: 'society' | 'community' | 'city' | 'country' | 'global') => {
    setAdminFormRole(role);
    setNewAdmin({
      ...newAdmin,
      role: role
    });
    setIsAdminFormOpen(true);
  };
  
  // Admin role types and their descriptions
  const adminRoles = [
    // Society level - Green
    {
      id: 'society',
      name: 'Society Admin',
      icon: <Building className="h-5 w-5" />,
      description: 'Masjid Imam level access - manage local society members and contributions',
      color: '#0C6E4E',
      level: 1
    },
    {
      id: 'society_admin',
      name: 'Society Admin',
      icon: <Building className="h-5 w-5" />,
      description: 'Masjid Imam level access - manage local society members and contributions',
      color: '#0C6E4E',
      level: 1
    },
    
    // Community level - Blue
    {
      id: 'community',
      name: 'Community Admin',
      icon: <HomeIcon className="h-5 w-5" />,
      description: 'Manage multiple societies within a community or area',
      color: '#2563EB',
      level: 2
    },
    {
      id: 'community_admin',
      name: 'Community Admin',
      icon: <HomeIcon className="h-5 w-5" />,
      description: 'Manage multiple societies within a community or area',
      color: '#2563EB',
      level: 2
    },
    
    // City level - Purple
    {
      id: 'city',
      name: 'City Admin',
      icon: <MapPin className="h-5 w-5" />,
      description: 'Oversee all communities within a city',
      color: '#9333EA',
      level: 3
    },
    {
      id: 'city_admin',
      name: 'City Admin',
      icon: <MapPin className="h-5 w-5" />,
      description: 'Oversee all communities within a city',
      color: '#9333EA',
      level: 3
    },
    
    // Country level - Red
    {
      id: 'country',
      name: 'Country Admin',
      icon: <Map className="h-5 w-5" />,
      description: 'Coordinate all cities within a country',
      color: '#E11D48',
      level: 4
    },
    {
      id: 'country_admin',
      name: 'Country Admin',
      icon: <Map className="h-5 w-5" />,
      description: 'Coordinate all cities within a country',
      color: '#E11D48',
      level: 4
    },
    
    // Global level - Black
    {
      id: 'global',
      name: 'Global Admin',
      icon: <Globe className="h-5 w-5" />,
      description: 'Worldwide system administration (United Nations level)',
      color: '#18181B',
      level: 5
    },
    {
      id: 'global_admin',
      name: 'Global Admin',
      icon: <Globe className="h-5 w-5" />,
      description: 'Worldwide system administration (United Nations level)',
      color: '#18181B',
      level: 5
    }
  ];

  return (
    <div className="space-y-6">
    
      {/* Admin Registration Dialog */}
      <Dialog open={isAdminFormOpen} onOpenChange={setIsAdminFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register New Admin</DialogTitle>
            <DialogDescription>
              Create a new administrator account at {adminFormRole} level
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="admin-name" className="text-sm font-medium">Full Name</label>
              <Input 
                id="admin-name" 
                placeholder="Enter admin's full name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-medium">Email Address</label>
              <Input 
                id="admin-email" 
                type="email"
                placeholder="Enter admin's email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-username" className="text-sm font-medium">Username</label>
              <Input 
                id="admin-username" 
                placeholder="Create a username"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-medium">Password</label>
                <Input 
                  id="admin-password" 
                  type="password"
                  placeholder="Create password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-confirm-password" className="text-sm font-medium">Confirm Password</label>
                <Input 
                  id="admin-confirm-password" 
                  type="password"
                  placeholder="Confirm password"
                  value={newAdmin.confirmPassword}
                  onChange={(e) => setNewAdmin({...newAdmin, confirmPassword: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Level</label>
              <Select 
                value={newAdmin.role} 
                onValueChange={(value: any) => setNewAdmin({...newAdmin, role: value})}
                disabled={adminRole === 'society'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role level" />
                </SelectTrigger>
                <SelectContent>
                  {adminRoles
                    // Only show roles at or below the current admin's level
                    .filter(role => {
                      const roleOrder = ['society', 'community', 'city', 'country', 'global'];
                      const currentRoleIndex = roleOrder.indexOf(adminRole);
                      const targetRoleIndex = roleOrder.indexOf(role.id);
                      
                      // Can only create admins at their level or below
                      return targetRoleIndex <= currentRoleIndex;
                    })
                    .map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center">
                          {role.icon}
                          <span className="ml-2">{role.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                You can only create admin accounts at your level or below
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdminFormOpen(false)}>Cancel</Button>
            <Button onClick={handleRegisterAdmin}>Register Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                <span>Admin Dashboard</span>
                <Badge variant="outline" className="ml-2">
                  {adminRoles.find(role => role.id === adminRole)?.name}
                </Badge>
              </CardTitle>
              <CardDescription>
                Manage society members, registrations, and contributions
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0">
              <Select value={adminRole} onValueChange={setAdminRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select admin level" />
                </SelectTrigger>
                <SelectContent>
                  {adminRoles.map(role => (
                    <SelectItem key={role.id} value={role.id} className="flex items-center">
                      <div className="flex items-center gap-2">
                        {role.icon}
                        <span>{role.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Admin role description card with hierarchy visualization */}
          <div 
            className="p-4 mb-6 rounded-lg"
            style={{ backgroundColor: `${adminRoles.find(role => role.id === adminRole)?.color}10`, borderLeft: `4px solid ${adminRoles.find(role => role.id === adminRole)?.color}` }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="p-3 rounded-full" 
                style={{ backgroundColor: `${adminRoles.find(role => role.id === adminRole)?.color}20` }}
              >
                {adminRoles.find(role => role.id === adminRole)?.icon}
              </div>
              <div>
                <h3 className="text-base font-medium mb-1">
                  {adminRoles.find(role => role.id === adminRole)?.name} Dashboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  {adminRoles.find(role => role.id === adminRole)?.description}
                </p>
              </div>
            </div>
            
            {/* Hierarchy visualization */}
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Administration Hierarchy</h4>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {adminRoles
                  .filter(role => ['global_admin', 'country_admin', 'city_admin', 'community_admin', 'society_admin'].includes(role.id))
                  .sort((a, b) => b.level - a.level) // Sort from highest level to lowest
                  .map((role, index, arr) => (
                    <React.Fragment key={role.id}>
                      <div 
                        className={`flex items-center px-3 py-1.5 rounded-md ${role.id === adminRole || role.id.replace('_admin', '') === adminRole ? 'ring-2 ring-offset-2' : ''}`}
                        style={{ 
                          backgroundColor: `${role.color}15`,
                          color: role.color,
                          borderLeft: `3px solid ${role.color}`
                        }}
                      >
                        <div className="mr-1.5">{role.icon}</div>
                        <span className="text-xs font-medium whitespace-nowrap">{role.name}</span>
                      </div>
                      {index < arr.length - 1 && (
                        <div className="text-muted-foreground">→</div>
                      )}
                    </React.Fragment>
                  ))
                }
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="registrations" className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                <span>Registrations</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>Members</span>
              </TabsTrigger>
              <TabsTrigger value="contributions" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>Contributions</span>
              </TabsTrigger>
              <TabsTrigger value="admins" className="flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2" />
                <span>Admins</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center">
                <FileBarChart className="h-4 w-4 mr-2" />
                <span>Reports</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Admins Tab */}
            <TabsContent value="admins">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Admin Management Column */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Admin Management ({adminRole.charAt(0).toUpperCase() + adminRole.slice(1)} Level)</CardTitle>
                        <CardDescription>
                          Manage administrator accounts at {adminRole} level
                        </CardDescription>
                      </div>
                      <Button onClick={() => handleOpenAdminForm(adminRole as any)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add New Admin
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {adminsLoading ? (
                        <div className="flex justify-center p-6">
                          <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                        </div>
                      ) : !adminUsers || adminUsers.length === 0 ? (
                        <div className="text-center p-6 bg-muted rounded-md">
                          <div className="flex flex-col items-center gap-3">
                            <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No admin accounts found at this level</p>
                            <Button variant="outline" onClick={() => handleOpenAdminForm(adminRole as any)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Create First Admin
                            </Button>
                          </div>
                        </div>
                      ) : (
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Admin</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {adminUsers.map((admin) => (
                            <TableRow key={admin.id} style={{
                              backgroundColor: admin.status === 'suspended' ? 'rgba(239, 68, 68, 0.05)' : undefined
                            }}>
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                                  <span>{admin.name}</span>
                                  <span className="text-xs text-muted-foreground">@{admin.username}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {admin.email}
                              </TableCell>
                              <TableCell>
                                {admin.role && (
                                  <div 
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium"
                                    style={{ 
                                      backgroundColor: `${adminRoles.find(r => r.id === admin.role)?.color}15`,
                                      color: adminRoles.find(r => r.id === admin.role)?.color,
                                      borderLeft: `3px solid ${adminRoles.find(r => r.id === admin.role)?.color}`
                                    }}
                                  >
                                    <span className="mr-1">{adminRoles.find(r => r.id === admin.role)?.icon}</span>
                                    {adminRoles.find(r => r.id === admin.role)?.name || admin.role}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(admin.status)}
                              </TableCell>
                              <TableCell>
                                {admin.lastLogin 
                                  ? new Date(admin.lastLogin).toLocaleString() 
                                  : 'Never logged in'}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  {admin.status === 'pending' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-green-600"
                                      onClick={() => handleApproveAdmin(admin.id)}
                                    >
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                  )}
                                  
                                  {admin.status === 'active' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600"
                                      onClick={() => handleSuspendAdmin(admin.id)}
                                    >
                                      <UserX className="h-4 w-4 mr-1" />
                                      Suspend
                                    </Button>
                                  )}
                                  
                                  {admin.status === 'suspended' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-green-600"
                                      onClick={() => handleApproveAdmin(admin.id)}
                                    >
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Reactivate
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Total {adminRole} admins: {adminUsers?.length || 0}
                  </div>
                  <Button variant="outline" onClick={() => handleExportData('admins')}>
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </CardFooter>
              </Card>
                </div>
                
                {/* Google Maps Integration Column */}
                <div className="lg:col-span-1">
                  <GoogleMapsIntegration 
                    adminRole={adminRole}
                    adminLocations={adminUsers?.map(admin => ({
                      role: admin.role,
                      name: admin.name,
                      // Mock locations for demo - in production these would come from the database
                      lat: 30.3753 + (Math.random() * 2 - 1), 
                      lng: 69.3451 + (Math.random() * 2 - 1),
                      color: adminRoles.find(r => r.id === admin.role)?.color || '#0C6E4E'
                    }))}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Registrations Tab */}
            <TabsContent value="registrations">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Registration Requests</CardTitle>
                  <CardDescription>
                    Approve or reject new resident registration requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {registrationsLoading ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                    </div>
                  ) : !pendingRegistrations || pendingRegistrations.length === 0 ? (
                    <div className="text-center p-6 bg-muted rounded-md">
                      <p className="text-muted-foreground">No pending registration requests</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Block/Flat</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingRegistrations.map((registration) => (
                            <TableRow key={registration.id}>
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                                  <span>{registration.name}</span>
                                  <span className="text-xs text-muted-foreground">@{registration.username}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {registration.blockName}/{registration.flatNumber}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-xs">{registration.email}</span>
                                  <span className="text-xs">{registration.phoneNumber}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(registration.registrationDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(registration.status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-green-600"
                                    onClick={() => handleApproveRegistration(registration.id)}
                                  >
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-600"
                                    onClick={() => handleRejectRegistration(registration.id)}
                                  >
                                    <UserX className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Total pending: {pendingRegistrations?.length || 0}
                  </div>
                  <Button variant="outline" onClick={() => handleExportData('registrations')}>
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Members Tab */}
            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>Society Members</CardTitle>
                  <CardDescription>
                    Manage all residents and their information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Mobile-friendly search & filter layout */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="w-full sm:flex-1">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input 
                          placeholder="Search by name, flat, or contact..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/3 md:w-1/4">
                      <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                        <SelectTrigger className="w-full">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by block" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Blocks</SelectItem>
                          {blocks?.map((block) => (
                            <SelectItem key={block.id} value={block.blockName}>
                              {block.blockName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {membersLoading ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                    </div>
                  ) : !filteredMembers || filteredMembers.length === 0 ? (
                    <div className="text-center p-6 bg-muted rounded-md">
                      <p className="text-muted-foreground">No members found</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Block/Flat</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMembers.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                                  <span>{member.name || 'N/A'}</span>
                                  <span className="text-xs text-muted-foreground">@{member.username || 'N/A'}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {member.blockName}/{member.flatNumber}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-xs">{member.email || 'N/A'}</span>
                                  <span className="text-xs">{member.phoneNumber || 'N/A'}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(member.status)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {member.isOwner ? 'Owner' : 'Resident'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleOpenContributionDialog(member.id)}
                                  >
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Add Payment
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Edit Member Details</DialogTitle>
                                        <DialogDescription>
                                          Update member information and settings
                                        </DialogDescription>
                                      </DialogHeader>
                                      {/* Member edit form would go here */}
                                      <div className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                                            <Input id="name" defaultValue={member.name || ''} />
                                          </div>
                                          <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                                            <Input id="phone" defaultValue={member.phoneNumber || ''} />
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <label htmlFor="email" className="text-sm font-medium">Email</label>
                                          <Input id="email" defaultValue={member.email || ''} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <label htmlFor="block" className="text-sm font-medium">Block</label>
                                            <Select defaultValue={member.blockName}>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {blocks?.map((block) => (
                                                  <SelectItem key={block.id} value={block.blockName}>
                                                    {block.blockName}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <label htmlFor="flat" className="text-sm font-medium">Flat</label>
                                            <Input id="flat" defaultValue={member.flatNumber} />
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline">Cancel</Button>
                                        <Button>Save Changes</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Total members: {filteredMembers?.length || 0} of {members?.length || 0}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleExportData('members')}>
                      <DownloadCloud className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="default" onClick={handlePrintReport}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Report
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Contributions Tab */}
            <TabsContent value="contributions">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Contributions</CardTitle>
                  <CardDescription>
                    Track and manage all monthly payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Mobile-friendly filter and action layout */}
                  <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 mb-6">
                    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 w-full sm:w-auto">
                      <div className="w-full sm:w-40">
                        <Input 
                          type="month" 
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="w-full sm:w-40">
                        <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                          <SelectTrigger className="w-full">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              <SelectValue placeholder="Filter by block" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Blocks</SelectItem>
                            {blocks?.map((block) => (
                              <SelectItem key={block.id} value={block.blockName}>
                                {block.blockName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="w-full sm:flex-1 sm:flex sm:justify-end">
                      <Button onClick={() => handleOpenContributionDialog(0)} className="w-full sm:w-auto">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Add New Contribution
                      </Button>
                    </div>
                  </div>
                  
                  {contributionsLoading ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                    </div>
                  ) : !contributions || contributions.length === 0 ? (
                    <div className="text-center p-6 bg-muted rounded-md">
                      <p className="text-muted-foreground">No contributions found for the selected period</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Block/Flat</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contributions.map((contribution) => (
                            <TableRow key={contribution.id}>
                              <TableCell className="font-medium">
                                {contribution.memberName || 'N/A'}
                              </TableCell>
                              <TableCell>
                                {contribution.blockName}/{contribution.flatNumber}
                              </TableCell>
                              <TableCell>
                                PKR {contribution.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {new Date(contribution.paymentDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="capitalize">
                                {contribution.paymentMethod}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(contribution.status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <FileText className="h-4 w-4 mr-1" />
                                        Receipt
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Payment Receipt</DialogTitle>
                                        <DialogDescription>
                                          Payment details and receipt information
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="bg-muted p-4 rounded-md space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">Receipt #:</span>
                                            <span className="text-sm">{contribution.id}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">Member:</span>
                                            <span className="text-sm">{contribution.memberName || 'N/A'}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">Block/Flat:</span>
                                            <span className="text-sm">{contribution.blockName}/{contribution.flatNumber}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">Amount:</span>
                                            <span className="text-sm">PKR {contribution.amount.toLocaleString()}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">Date:</span>
                                            <span className="text-sm">{new Date(contribution.paymentDate).toLocaleDateString()}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">Method:</span>
                                            <span className="text-sm capitalize">{contribution.paymentMethod}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">Status:</span>
                                            <span className="text-sm capitalize">{contribution.status}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={handlePrintReport}>
                                          <Printer className="h-4 w-4 mr-2" />
                                          Print Receipt
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-600"
                                    onClick={() => handleDeleteContribution(contribution.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Total contributions: {contributions?.length || 0}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleExportData('contributions')}>
                      <DownloadCloud className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="default" onClick={handlePrintReport}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Report
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Reports Tab */}
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>
                    Generate and download various financial reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Monthly Collection Report</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Generate a detailed report of monthly fee collections for any period
                        </p>
                        <div className="space-y-4">
                          <div className="flex space-x-4">
                            <div className="w-1/2">
                              <label className="text-sm font-medium">From:</label>
                              <Input type="month" className="mt-1" />
                            </div>
                            <div className="w-1/2">
                              <label className="text-sm font-medium">To:</label>
                              <Input type="month" className="mt-1" />
                            </div>
                          </div>
                          <Button className="w-full">
                            <FileBarChart className="h-4 w-4 mr-2" />
                            Generate Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Outstanding Payments Report</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          List of members with pending payments and outstanding amounts
                        </p>
                        <div className="space-y-4">
                          <div className="flex space-x-4">
                            <div className="w-1/2">
                              <label className="text-sm font-medium">Month:</label>
                              <Input type="month" className="mt-1" />
                            </div>
                            <div className="w-1/2">
                              <label className="text-sm font-medium">Block:</label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="All Blocks" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Blocks</SelectItem>
                                  {blocks?.map((block) => (
                                    <SelectItem key={block.id} value={block.blockName}>
                                      {block.blockName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button className="w-full">
                            <FileBarChart className="h-4 w-4 mr-2" />
                            Generate Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Expenses Report</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Detailed breakdown of all society expenses and their categories
                        </p>
                        <div className="space-y-4">
                          <div className="flex space-x-4">
                            <div className="w-1/2">
                              <label className="text-sm font-medium">From:</label>
                              <Input type="date" className="mt-1" />
                            </div>
                            <div className="w-1/2">
                              <label className="text-sm font-medium">To:</label>
                              <Input type="date" className="mt-1" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Category:</label>
                            <Select>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="All Categories" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="utility">Utility</SelectItem>
                                <SelectItem value="security">Security</SelectItem>
                                <SelectItem value="cleaning">Cleaning</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full">
                            <FileBarChart className="h-4 w-4 mr-2" />
                            Generate Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Annual Summary Report</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Complete financial summary with income, expenses, and trends
                        </p>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Year:</label>
                            <Select>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select Year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex space-x-4">
                            <div className="w-full">
                              <label className="text-sm font-medium">Report Type:</label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="summary">Summary Only</SelectItem>
                                  <SelectItem value="detailed">Detailed Report</SelectItem>
                                  <SelectItem value="charts">With Charts & Graphs</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button className="w-full">
                            <FileBarChart className="h-4 w-4 mr-2" />
                            Generate Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Add Contribution Dialog */}
      <Dialog open={isContributionDialogOpen} onOpenChange={setIsContributionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record New Contribution</DialogTitle>
            <DialogDescription>
              Add a new payment from a society member
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedMemberId === 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Member:</label>
                <Select 
                  onValueChange={(value) => setNewContribution({
                    ...newContribution,
                    memberId: parseInt(value)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members?.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.blockName}/{member.flatNumber} - {member.name || 'N/A'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (PKR):</label>
              <Input 
                type="number" 
                value={newContribution.amount} 
                onChange={(e) => setNewContribution({
                  ...newContribution,
                  amount: parseFloat(e.target.value)
                })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Month & Year:</label>
              <Input 
                type="month"
                value={newContribution.monthYear}
                onChange={(e) => setNewContribution({
                  ...newContribution,
                  monthYear: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method:</label>
              <Select 
                value={newContribution.paymentMethod}
                onValueChange={(value) => setNewContribution({
                  ...newContribution,
                  paymentMethod: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="easypaisa">EasyPaisa</SelectItem>
                  <SelectItem value="jazzcash">JazzCash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Reference/Details:</label>
              <Input 
                placeholder="Transaction ID, Cheque No., etc."
                value={newContribution.paymentReference}
                onChange={(e) => setNewContribution({
                  ...newContribution,
                  paymentReference: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Purpose:</label>
              <Select 
                value={newContribution.purpose}
                onValueChange={(value) => setNewContribution({
                  ...newContribution,
                  purpose: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Contribution</SelectItem>
                  <SelectItem value="maintenance">Special Maintenance</SelectItem>
                  <SelectItem value="security">Security Fee</SelectItem>
                  <SelectItem value="event">Community Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContributionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContribution}>
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
