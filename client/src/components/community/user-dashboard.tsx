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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Home,
  FileText,
  DollarSign,
  MessageSquare,
  Vote,
  ClipboardList,
  BarChart4,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileBarChart,
  Download,
  Printer,
  Link,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  History,
  Bell,
  User,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';

interface SocietyMember {
  id: number;
  userId: number;
  blockName: string;
  flatNumber: string;
  isOwner: boolean;
  status: string;
  phoneNumber: string;
  name?: string;
  email?: string;
}

interface SocietyContribution {
  id: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  monthYear: string;
  purpose: string;
  status: string;
  reference?: string;
}

interface Discussion {
  id: number;
  title: string;
  description: string;
  creatorName: string;
  createdAt: string;
  status: 'open' | 'closed' | 'resolved';
  commentCount: number;
}

interface DiscussionComment {
  id: number;
  content: string;
  userName: string;
  createdAt: string;
  isAdmin: boolean;
}

interface Proposal {
  id: number;
  title: string;
  description: string;
  creatorName: string;
  createdAt: string;
  status: 'draft' | 'voting' | 'approved' | 'rejected' | 'implemented';
  votingEndDate?: string;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  totalVotes: number;
  hasVoted: boolean;
  userVote?: 'yes' | 'no' | 'abstain';
}

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
  status: string;
}

interface Notification {
  id: number;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: 'announcement' | 'payment' | 'discussion' | 'proposal' | 'event';
}

interface UserDashboardProps {
  userId: number;
  societyId: number;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userId, societyId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', description: '' });
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [voteSelection, setVoteSelection] = useState<'yes' | 'no' | 'abstain' | null>(null);
  const [voteComment, setVoteComment] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Queries
  const { data: memberInfo, isLoading: memberLoading } = useQuery<SocietyMember>({
    queryKey: ['/api/society/member', userId],
  });
  
  const { data: contributions, isLoading: contributionsLoading } = useQuery<SocietyContribution[]>({
    queryKey: ['/api/society/member/contributions', userId],
    enabled: activeTab === 'overview' || activeTab === 'payments',
  });
  
  const { data: discussions, isLoading: discussionsLoading } = useQuery<Discussion[]>({
    queryKey: ['/api/society/discussions'],
    enabled: activeTab === 'discussions',
  });
  
  const { data: discussionComments, isLoading: commentsLoading } = useQuery<DiscussionComment[]>({
    queryKey: ['/api/society/discussions', selectedDiscussionId, 'comments'],
    enabled: !!selectedDiscussionId,
  });
  
  const { data: selectedDiscussion } = useQuery<Discussion>({
    queryKey: ['/api/society/discussions', selectedDiscussionId],
    enabled: !!selectedDiscussionId,
  });
  
  const { data: proposals, isLoading: proposalsLoading } = useQuery<Proposal[]>({
    queryKey: ['/api/society/proposals'],
    enabled: activeTab === 'proposals',
  });
  
  const { data: selectedProposal } = useQuery<Proposal>({
    queryKey: ['/api/society/proposals', selectedProposalId],
    enabled: !!selectedProposalId,
  });
  
  const { data: expenses, isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ['/api/society/expenses'],
    enabled: activeTab === 'finances',
  });
  
  const { data: notifications, isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ['/api/society/member/notifications', userId],
    enabled: activeTab === 'overview' || activeTab === 'notifications',
  });
  
  // Mutations
  const createDiscussionMutation = useMutation({
    mutationFn: async (discussionData: { title: string; description: string }) => {
      const res = await apiRequest('POST', `/api/society/${societyId}/discussions`, {
        ...discussionData,
        creatorId: userId,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/discussions'] });
      setIsNewDiscussionOpen(false);
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
  
  const addCommentMutation = useMutation({
    mutationFn: async (data: { discussionId: number; content: string }) => {
      const res = await apiRequest('POST', `/api/society/discussions/${data.discussionId}/comments`, {
        userId,
        content: data.content,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/discussions', selectedDiscussionId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/society/discussions'] });
      setNewComment('');
      toast({
        title: "Success",
        description: "Your comment has been added",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    }
  });
  
  const voteOnProposalMutation = useMutation({
    mutationFn: async (data: { proposalId: number; voteType: string; comment: string }) => {
      const res = await apiRequest('POST', `/api/society/proposals/${data.proposalId}/vote`, {
        userId,
        voteType: data.voteType,
        comment: data.comment,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/society/proposals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/society/proposals', selectedProposalId] });
      setVoteSelection(null);
      setVoteComment('');
      setSelectedProposalId(null);
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
  
  // Event handlers
  const handleCreateDiscussion = () => {
    if (!newDiscussion.title || !newDiscussion.description) {
      toast({
        title: "Validation Error",
        description: "Please provide both title and description",
        variant: "destructive",
      });
      return;
    }
    
    createDiscussionMutation.mutate(newDiscussion);
  };
  
  const handleAddComment = () => {
    if (!newComment || !selectedDiscussionId) return;
    
    addCommentMutation.mutate({
      discussionId: selectedDiscussionId,
      content: newComment,
    });
  };
  
  const handleSubmitVote = () => {
    if (!voteSelection || !selectedProposalId) return;
    
    voteOnProposalMutation.mutate({
      proposalId: selectedProposalId,
      voteType: voteSelection,
      comment: voteComment,
    });
  };
  
  const calculatePaymentStatus = () => {
    if (!contributions || contributions.length === 0) return 0;
    
    const currentMonth = format(new Date(), 'yyyy-MM');
    const paidCurrentMonth = contributions.some(c => c.monthYear === currentMonth && c.status === 'completed');
    
    // Get the last 6 months
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 5);
    
    let paidCount = 0;
    let totalMonths = 0;
    
    // Start from 6 months ago and go forward
    for (let d = new Date(sixMonthsAgo); d <= today; d.setMonth(d.getMonth() + 1)) {
      const monthYear = format(d, 'yyyy-MM');
      const isPaid = contributions.some(c => c.monthYear === monthYear && c.status === 'completed');
      
      if (isPaid) paidCount++;
      totalMonths++;
    }
    
    return (paidCount / totalMonths) * 100;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };
  
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(dateString);
  };
  
  const getVotePercentage = (vote: number, total: number) => {
    if (total === 0) return 0;
    return (vote / total) * 100;
  };
  
  const getStatusBadge = (status: string) => {
    if (status === 'approved' || status === 'resolved' || status === 'implemented' || status === 'completed') {
      return <Badge variant="success">
        <CheckCircle className="h-3 w-3 mr-1" /> {status}
      </Badge>;
    } else if (status === 'pending' || status === 'draft' || status === 'open' || status === 'voting') {
      return <Badge variant="outline" className="text-amber-500 border-amber-500">
        <AlertTriangle className="h-3 w-3 mr-1" /> {status}
      </Badge>;
    } else {
      return <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" /> {status}
      </Badge>;
    }
  };
  
  // Calculate overview information
  const paymentStatus = calculatePaymentStatus();
  const upcomingVotings = proposals?.filter(p => p.status === 'voting' && !p.hasVoted) || [];
  const unreadNotifications = notifications?.filter(n => !n.isRead) || [];
  const recentDiscussions = discussions?.slice(0, 3) || [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>آپ کا ڈیش بورڈ</span>
            <span>Your Dashboard</span>
          </CardTitle>
          <CardDescription>
            Manage your society information, payments, and participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1">
              <TabsTrigger value="overview" className="flex items-center justify-center text-xs md:text-sm px-1 py-1 md:py-2">
                <Home className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="truncate">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center justify-center text-xs md:text-sm px-1 py-1 md:py-2">
                <DollarSign className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="truncate">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="discussions" className="flex items-center justify-center text-xs md:text-sm px-1 py-1 md:py-2">
                <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="truncate">Discussions</span>
              </TabsTrigger>
              <TabsTrigger value="proposals" className="flex items-center justify-center text-xs md:text-sm px-1 py-1 md:py-2">
                <Vote className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="truncate">Voting</span>
              </TabsTrigger>
              <TabsTrigger value="finances" className="flex items-center justify-center text-xs md:text-sm px-1 py-1 md:py-2">
                <BarChart4 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="truncate">Finances</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center justify-center text-xs md:text-sm px-1 py-1 md:py-2 relative">
                <Bell className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="truncate">Alerts</span>
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 md:right-2 bg-red-500 text-white text-[9px] md:text-xs rounded-full h-3 w-3 md:h-4 md:w-4 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Profile Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Your Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {memberLoading ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin w-6 h-6 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                      </div>
                    ) : memberInfo ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-[#0C6E4E] text-white flex items-center justify-center">
                            <User className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-medium">{memberInfo.name || 'Resident'}</h3>
                            <p className="text-sm text-muted-foreground">{memberInfo.email}</p>
                          </div>
                        </div>
                        
                        <div className="pt-2 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Block/Flat:</span>
                            <span className="font-medium">{memberInfo.blockName}/{memberInfo.flatNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Resident Type:</span>
                            <span className="font-medium">{memberInfo.isOwner ? 'Owner' : 'Tenant'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium capitalize">{memberInfo.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contact:</span>
                            <span className="font-medium">{memberInfo.phoneNumber}</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Update Profile
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-muted-foreground">Profile information not available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Payment Status Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Payment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Monthly Contribution</span>
                          <span className="font-medium">PKR 1,500</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Current Month:</span>
                            <span className="font-medium">
                              {contributions && contributions.some(c => 
                                c.monthYear === format(new Date(), 'yyyy-MM') && 
                                c.status === 'completed'
                              ) ? (
                                <span className="text-green-600">Paid</span>
                              ) : (
                                <span className="text-red-600">Due</span>
                              )}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-xs">
                            <span>Last Payment:</span>
                            <span className="font-medium">
                              {contributions && contributions.length > 0 ? (
                                formatDate(contributions[0].paymentDate)
                              ) : (
                                'No payments yet'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>6-Month Payment History:</span>
                          <span className="font-medium">{Math.round(paymentStatus)}%</span>
                        </div>
                        <Progress value={paymentStatus} className="h-2" />
                      </div>
                      
                      <Button className="w-full">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Make Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Upcoming Votes Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Proposals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {proposalsLoading ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin w-6 h-6 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                      </div>
                    ) : !upcomingVotings || upcomingVotings.length === 0 ? (
                      <div className="text-center p-4 bg-muted rounded-md">
                        <p className="text-muted-foreground">No active proposals requiring your vote</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingVotings.map((proposal) => (
                          <div key={proposal.id} className="border rounded-md p-3 space-y-2">
                            <h4 className="font-medium text-sm">{proposal.title}</h4>
                            <div className="text-xs text-muted-foreground flex justify-between">
                              <span>Ends: {proposal.votingEndDate ? formatDate(proposal.votingEndDate) : 'N/A'}</span>
                              <span>{getStatusBadge(proposal.status)}</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedProposalId(proposal.id)}>
                              <Vote className="h-3 w-3 mr-1" />
                              Cast Your Vote
                            </Button>
                          </div>
                        ))}
                        
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab('proposals')}>
                          See All Proposals
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Recent Discussions Card */}
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Discussions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {discussionsLoading ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin w-6 h-6 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                      </div>
                    ) : !recentDiscussions || recentDiscussions.length === 0 ? (
                      <div className="text-center p-4 bg-muted rounded-md">
                        <p className="text-muted-foreground">No recent discussions</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentDiscussions.map((discussion) => (
                          <div key={discussion.id} className="border rounded-md p-3 space-y-2">
                            <h4 className="font-medium">{discussion.title}</h4>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>By: {discussion.creatorName}</span>
                              <span>{formatRelativeTime(discussion.createdAt)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                <MessageCircle className="h-3 w-3 inline mr-1" />
                                {discussion.commentCount} comments
                              </span>
                              <span>{getStatusBadge(discussion.status)}</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full" onClick={() => {
                              setSelectedDiscussionId(discussion.id);
                              setActiveTab('discussions');
                            }}>
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Join Discussion
                            </Button>
                          </div>
                        ))}
                        
                        <div className="flex space-x-4">
                          <Button variant="outline" className="flex-1" onClick={() => setActiveTab('discussions')}>
                            See All Discussions
                          </Button>
                          <Button className="flex-1" onClick={() => {
                            setIsNewDiscussionOpen(true);
                            setActiveTab('discussions');
                          }}>
                            Start New Topic
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Notifications Preview Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {notificationsLoading ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin w-6 h-6 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                      </div>
                    ) : !notifications || notifications.length === 0 ? (
                      <div className="text-center p-4 bg-muted rounded-md">
                        <p className="text-muted-foreground">No notifications</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications.slice(0, 4).map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-2 border-l-4 ${
                              notification.isRead ? 'border-muted' : 'border-[#0C6E4E]'
                            } ${notification.isRead ? 'bg-muted/30' : 'bg-muted'} rounded-sm`}
                          >
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{notification.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(notification.date)}
                              </span>
                            </div>
                            <p className="text-xs mt-1 text-muted-foreground">{notification.content}</p>
                          </div>
                        ))}
                        
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab('notifications')}>
                          See All Notifications
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View and manage your contribution payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-6">
                    <Button>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Make New Payment
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Statement
                    </Button>
                  </div>
                  
                  {contributionsLoading ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                    </div>
                  ) : !contributions || contributions.length === 0 ? (
                    <div className="text-center p-6 bg-muted rounded-md">
                      <p className="text-muted-foreground">No payment history available</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Month/Year</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Receipt</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contributions.map((contribution) => (
                            <TableRow key={contribution.id}>
                              <TableCell>
                                {formatDate(contribution.paymentDate)}
                              </TableCell>
                              <TableCell>
                                {contribution.monthYear}
                              </TableCell>
                              <TableCell>
                                PKR {contribution.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="capitalize">
                                {contribution.paymentMethod}
                              </TableCell>
                              <TableCell className="capitalize">
                                {contribution.purpose}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(contribution.status)}
                              </TableCell>
                              <TableCell>
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
                                        Details for your payment on {formatDate(contribution.paymentDate)}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="bg-muted p-4 rounded-md space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm font-medium">Receipt No:</span>
                                          <span className="text-sm">{contribution.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm font-medium">Date:</span>
                                          <span className="text-sm">{formatDate(contribution.paymentDate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm font-medium">Amount:</span>
                                          <span className="text-sm">PKR {contribution.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm font-medium">For Period:</span>
                                          <span className="text-sm">{contribution.monthYear}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm font-medium">Payment Method:</span>
                                          <span className="text-sm capitalize">{contribution.paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm font-medium">Reference:</span>
                                          <span className="text-sm">{contribution.reference || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm font-medium">Status:</span>
                                          <span className="text-sm capitalize">{contribution.status}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline">
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print Receipt
                                      </Button>
                                      <Button variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download PDF
                                      </Button>
                                      <Button variant="outline">
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
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
                    Total payments: {contributions?.length || 0}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <History className="h-4 w-4 mr-2" />
                      View Payment Schedule
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Discussions Tab */}
            <TabsContent value="discussions">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-semibold">Community Discussions</h2>
                  <Button onClick={() => setIsNewDiscussionOpen(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New Discussion
                  </Button>
                </div>
                
                {selectedDiscussionId ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{selectedDiscussion?.title}</CardTitle>
                          <CardDescription>
                            Started by {selectedDiscussion?.creatorName} • {selectedDiscussion?.createdAt ? formatDate(selectedDiscussion.createdAt) : ''}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDiscussionId(null)}>
                          Back to List
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="bg-muted p-4 rounded-md">
                          <p className="text-sm">{selectedDiscussion?.description}</p>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h3 className="text-lg font-medium mb-4">Comments ({discussionComments?.length || 0})</h3>
                          
                          {commentsLoading ? (
                            <div className="flex justify-center p-6">
                              <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                            </div>
                          ) : !discussionComments || discussionComments.length === 0 ? (
                            <div className="text-center p-6 bg-muted rounded-md">
                              <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {discussionComments.map((comment) => (
                                <div key={comment.id} className={`border rounded-md p-4 ${comment.isAdmin ? 'bg-amber-50' : ''}`}>
                                  <div className="flex justify-between mb-2">
                                    <div className="flex items-center">
                                      <span className="font-medium">{comment.userName}</span>
                                      {comment.isAdmin && (
                                        <Badge className="ml-2 bg-amber-500">Admin</Badge>
                                      )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {formatRelativeTime(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="mt-6">
                            <h4 className="text-sm font-medium mb-2">Add Your Comment</h4>
                            <div className="flex space-x-2">
                              <Textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Type your comment here..."
                                className="flex-1"
                              />
                              <Button onClick={handleAddComment} disabled={!newComment}>
                                <Send className="h-4 w-4 mr-2" />
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Discussion Topics</CardTitle>
                      <CardDescription>
                        Participate in community discussions and raise issues
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {discussionsLoading ? (
                        <div className="flex justify-center p-6">
                          <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                        </div>
                      ) : !discussions || discussions.length === 0 ? (
                        <div className="text-center p-6 bg-muted rounded-md">
                          <p className="text-muted-foreground">No discussions found</p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-4">
                            {discussions.map((discussion) => (
                              <div 
                                key={discussion.id} 
                                className="border rounded-md p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                                onClick={() => setSelectedDiscussionId(discussion.id)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-medium">{discussion.title}</h3>
                                  <div>{getStatusBadge(discussion.status)}</div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {discussion.description}
                                </p>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <div className="flex space-x-4">
                                    <span>By: {discussion.creatorName}</span>
                                    <span>
                                      <MessageCircle className="h-3 w-3 inline mr-1" />
                                      {discussion.commentCount} comments
                                    </span>
                                  </div>
                                  <span>{formatRelativeTime(discussion.createdAt)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* New Discussion Dialog */}
              <Dialog open={isNewDiscussionOpen} onOpenChange={setIsNewDiscussionOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start a New Discussion</DialogTitle>
                    <DialogDescription>
                      Create a new topic to discuss with the community
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Topic Title:</label>
                      <Input 
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                        placeholder="Enter a clear and descriptive title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description:</label>
                      <Textarea 
                        value={newDiscussion.description}
                        onChange={(e) => setNewDiscussion({...newDiscussion, description: e.target.value})}
                        placeholder="Describe your topic in detail"
                        rows={5}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewDiscussionOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateDiscussion}>
                      Create Discussion
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            {/* Proposals Tab */}
            <TabsContent value="proposals">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-semibold">Community Voting</h2>
                </div>
                
                {selectedProposalId ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{selectedProposal?.title}</CardTitle>
                          <CardDescription>
                            Proposed by {selectedProposal?.creatorName} • {selectedProposal?.createdAt ? formatDate(selectedProposal.createdAt) : ''}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedProposalId(null)}>
                          Back to List
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="bg-muted p-4 rounded-md">
                          <p className="text-sm">{selectedProposal?.description}</p>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h3 className="text-lg font-medium mb-2">Current Voting Status</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="border rounded-md p-4 text-center">
                              <div className="text-3xl font-bold text-green-600 mb-1">
                                {selectedProposal?.yesVotes || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Yes Votes ({selectedProposal ? getVotePercentage(selectedProposal.yesVotes, selectedProposal.totalVotes) : 0}%)
                              </div>
                              <Progress 
                                value={selectedProposal ? getVotePercentage(selectedProposal.yesVotes, selectedProposal.totalVotes) : 0} 
                                className="h-2 mt-2 bg-slate-200" 
                              />
                            </div>
                            
                            <div className="border rounded-md p-4 text-center">
                              <div className="text-3xl font-bold text-red-600 mb-1">
                                {selectedProposal?.noVotes || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                No Votes ({selectedProposal ? getVotePercentage(selectedProposal.noVotes, selectedProposal.totalVotes) : 0}%)
                              </div>
                              <Progress 
                                value={selectedProposal ? getVotePercentage(selectedProposal.noVotes, selectedProposal.totalVotes) : 0} 
                                className="h-2 mt-2 bg-slate-200" 
                              />
                            </div>
                            
                            <div className="border rounded-md p-4 text-center">
                              <div className="text-3xl font-bold text-amber-600 mb-1">
                                {selectedProposal?.abstainVotes || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Abstain ({selectedProposal ? getVotePercentage(selectedProposal.abstainVotes, selectedProposal.totalVotes) : 0}%)
                              </div>
                              <Progress 
                                value={selectedProposal ? getVotePercentage(selectedProposal.abstainVotes, selectedProposal.totalVotes) : 0} 
                                className="h-2 mt-2 bg-slate-200" 
                              />
                            </div>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-md mb-6">
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-medium">Vote Status:</div>
                              <div>
                                {selectedProposal?.hasVoted ? (
                                  <Badge>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    You've voted: <span className="ml-1 capitalize">{selectedProposal.userVote}</span>
                                  </Badge>
                                ) : (
                                  selectedProposal?.status === 'voting' ? (
                                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Awaiting your vote
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Voting {selectedProposal?.status}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <div>
                                <span className="text-muted-foreground">Total votes cast:</span>
                                <span className="ml-1 font-medium">{selectedProposal?.totalVotes || 0}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">End date:</span>
                                <span className="ml-1 font-medium">
                                  {selectedProposal?.votingEndDate ? formatDate(selectedProposal.votingEndDate) : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {selectedProposal?.status === 'voting' && !selectedProposal.hasVoted && (
                            <div>
                              <h4 className="text-lg font-medium mb-3">Cast Your Vote</h4>
                              <div className="space-y-4">
                                <div className="flex space-x-4">
                                  <Button 
                                    variant={voteSelection === 'yes' ? 'default' : 'outline'} 
                                    className={voteSelection === 'yes' ? 'bg-green-600' : ''}
                                    onClick={() => setVoteSelection('yes')}
                                  >
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                    Yes
                                  </Button>
                                  <Button 
                                    variant={voteSelection === 'no' ? 'default' : 'outline'} 
                                    className={voteSelection === 'no' ? 'bg-red-600' : ''}
                                    onClick={() => setVoteSelection('no')}
                                  >
                                    <ThumbsDown className="h-4 w-4 mr-2" />
                                    No
                                  </Button>
                                  <Button 
                                    variant={voteSelection === 'abstain' ? 'default' : 'outline'}
                                    className={voteSelection === 'abstain' ? 'bg-amber-600' : ''}
                                    onClick={() => setVoteSelection('abstain')}
                                  >
                                    Abstain
                                  </Button>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Comment (Optional):</label>
                                  <Textarea 
                                    value={voteComment}
                                    onChange={(e) => setVoteComment(e.target.value)}
                                    placeholder="Add a comment explaining your vote"
                                  />
                                </div>
                                
                                <Button 
                                  onClick={handleSubmitVote} 
                                  disabled={!voteSelection}
                                  className="w-full"
                                >
                                  Submit Vote
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Proposals & Voting</CardTitle>
                      <CardDescription>
                        Vote on important community decisions and proposals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {proposalsLoading ? (
                        <div className="flex justify-center p-6">
                          <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                        </div>
                      ) : !proposals || proposals.length === 0 ? (
                        <div className="text-center p-6 bg-muted rounded-md">
                          <p className="text-muted-foreground">No proposals found</p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-4">
                            {proposals.map((proposal) => (
                              <div 
                                key={proposal.id} 
                                className="border rounded-md p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                                onClick={() => setSelectedProposalId(proposal.id)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-medium">{proposal.title}</h3>
                                  <div>{getStatusBadge(proposal.status)}</div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                  {proposal.description}
                                </p>
                                
                                {proposal.status === 'voting' && (
                                  <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
                                    <div className="flex h-1.5 rounded-full">
                                      <div 
                                        className="bg-green-600 h-1.5 rounded-l-full"
                                        style={{ width: `${getVotePercentage(proposal.yesVotes, proposal.totalVotes)}%` }}
                                      ></div>
                                      <div 
                                        className="bg-red-600 h-1.5"
                                        style={{ width: `${getVotePercentage(proposal.noVotes, proposal.totalVotes)}%` }}
                                      ></div>
                                      <div 
                                        className="bg-amber-600 h-1.5 rounded-r-full"
                                        style={{ width: `${getVotePercentage(proposal.abstainVotes, proposal.totalVotes)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <div className="flex space-x-4">
                                    <span>By: {proposal.creatorName}</span>
                                    {proposal.hasVoted && (
                                      <span className="text-green-600">
                                        <CheckCircle className="h-3 w-3 inline mr-1" />
                                        Voted
                                      </span>
                                    )}
                                  </div>
                                  {proposal.votingEndDate ? (
                                    <span>
                                      {proposal.status === 'voting' ? 'Ends: ' : 'Ended: '}
                                      {formatDate(proposal.votingEndDate)}
                                    </span>
                                  ) : (
                                    <span>{formatRelativeTime(proposal.createdAt)}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            {/* Finances Tab */}
            <TabsContent value="finances">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Transparency</CardTitle>
                  <CardDescription>
                    View society expenses and financial reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Monthly Collection</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">PKR 264,000</div>
                          <p className="text-sm text-muted-foreground">Based on PKR 1,500 × 176 flats</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Current Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">PKR 189,500</div>
                          <p className="text-sm text-muted-foreground">This month's operational costs</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Reserve Fund</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">PKR 845,300</div>
                          <p className="text-sm text-muted-foreground">Emergency and maintenance reserves</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Recent Expenses</h3>
                      
                      {expensesLoading ? (
                        <div className="flex justify-center p-6">
                          <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                        </div>
                      ) : !expenses || expenses.length === 0 ? (
                        <div className="text-center p-6 bg-muted rounded-md">
                          <p className="text-muted-foreground">No expense records found</p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[300px]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                  <TableCell>
                                    {formatDate(expense.expenseDate)}
                                  </TableCell>
                                  <TableCell>
                                    {expense.title}
                                  </TableCell>
                                  <TableCell className="capitalize">
                                    {expense.category}
                                  </TableCell>
                                  <TableCell>
                                    PKR {expense.amount.toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(expense.status)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <Button variant="outline">
                        <FileBarChart className="h-4 w-4 mr-2" />
                        View Full Financial Report
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Summary
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Stay updated with important society announcements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notificationsLoading ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                    </div>
                  ) : !notifications || notifications.length === 0 ? (
                    <div className="text-center p-6 bg-muted rounded-md">
                      <p className="text-muted-foreground">No notifications</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-4 border-l-4 ${
                              notification.isRead ? 'border-muted' : 'border-[#0C6E4E]'
                            } ${notification.isRead ? 'bg-muted/30' : 'bg-muted'} rounded-sm`}
                          >
                            <div className="flex justify-between mb-1">
                              <h3 className="font-medium">{notification.title}</h3>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(notification.date)}
                              </span>
                            </div>
                            <p className="text-sm mb-3">{notification.content}</p>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="capitalize">
                                {notification.type}
                              </Badge>
                              {!notification.isRead && (
                                <Button variant="outline" size="sm">
                                  Mark as Read
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Unread: {unreadNotifications.length} of {notifications?.length || 0}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark All Read
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;