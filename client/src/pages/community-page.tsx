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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, UserPlus, Building, Home, ChevronRight, FileText, CheckCircle, XCircle, AlertCircle, Send, User, Users, ShieldCheck, MessageSquare } from 'lucide-react';
import FlatDisplay from '@/components/community/flat-display';
import AdminPanel from '@/components/community/admin-panel';
import UserDashboard from '@/components/community/user-dashboard';

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
  const [selectedBlock, setSelectedBlock] = useState<string>('');
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

  return (
    <div className="py-16 bg-[#F7F3E9]">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl md:text-5xl font-heading text-[#0C6E4E] text-center mb-4">Community & Transparency</h1>
        <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-8">We believe in maintaining transparency and involving our community in masjid operations and decision-making.</p>
        
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
            <UserDashboard userId={1} societyId={1} />
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
                              <SelectItem value="">All Blocks</SelectItem>
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
                            .filter(member => !selectedBlock || member.blockId === parseInt(selectedBlock))
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