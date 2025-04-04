import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SOCIETY_DETAILS } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, UserPlus, Building, Home, ChevronRight, FileText, CheckCircle, XCircle, AlertCircle, Send } from 'lucide-react';

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
  userId: number;
  blockName: string;
  flatNumber: string;
  fullAddress: string;
  expectedAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending';
  pendingAmount: number;
  phoneNumber: string;
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
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-[#0C6E4E] text-center mb-4">Community & Transparency</h1>
        <p className="text-xl text-center max-w-3xl mx-auto mb-8">We believe in maintaining transparency and involving our community in masjid operations and decision-making.</p>
        
        <Tabs defaultValue="society" className="mb-16" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mx-auto max-w-4xl">
            <TabsTrigger value="society">Society Overview</TabsTrigger>
            <TabsTrigger value="residents">Residents</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="proposals">Proposals & Voting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="society" className="mt-6">
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
              <div className="bg-[#0C6E4E] text-white p-4">
                <h2 className="text-2xl font-heading">Financial Transparency</h2>
              </div>
              <div className="p-6">
                <div className="prose max-w-none mb-6">
                  <p>At Jamia Masjid Nabvi Qureshi Hashmi, we are committed to complete financial transparency. We believe that our community has the right to know how funds are collected and utilized. Regular financial reports are published and discussed in community meetings, and our accounts are audited annually by independent auditors.</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-medium text-[#0C6E4E] mb-4">Monthly Income & Expenses</h3>
                  
                  {campaignsLoading ? (
                    <div className="flex justify-center items-center h-64 bg-gray-100 rounded">
                      <div className="animate-spin w-10 h-10 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                    </div>
                  ) : campaigns ? (
                    <div className="bg-gray-100 rounded p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Ongoing Campaigns</h4>
                          {campaigns.map(campaign => (
                            <div key={campaign.id} className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>{campaign.name}</span>
                                <span>${Number(campaign.raised).toLocaleString()} of ${Number(campaign.goal).toLocaleString()}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-[#0C6E4E] h-2 rounded-full" 
                                  style={{ width: `${Math.min(100, (Number(campaign.raised) / Number(campaign.goal)) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Monthly Operating Budget</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Utilities & Maintenance</span>
                                <span>$12,500</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-[#0C6E4E] h-2 rounded-full" style={{ width: '25%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Staff Salaries</span>
                                <span>$18,000</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-[#0C6E4E] h-2 rounded-full" style={{ width: '36%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Educational Programs</span>
                                <span>$10,000</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-[#0C6E4E] h-2 rounded-full" style={{ width: '20%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Community Services</span>
                                <span>$8,000</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-[#0C6E4E] h-2 rounded-full" style={{ width: '16%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Miscellaneous</span>
                                <span>$1,500</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-[#0C6E4E] h-2 rounded-full" style={{ width: '3%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded p-6 text-center">
                      <p>Financial data could not be loaded. Please try again later.</p>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-[#0C6E4E] mb-4">Income Breakdown</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Donations</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#0C6E4E] h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Madrasa Tuition</span>
                          <span>20%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#0C6E4E] h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Zakat Contributions</span>
                          <span>10%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#0C6E4E] h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Other Sources</span>
                          <span>5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#0C6E4E] h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <div className="bg-[#F7F3E9] p-4 rounded-lg">
                        <h4 className="font-medium text-[#0C6E4E] mb-2">Financial Accountability</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#D4AF37] mt-0.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Quarterly financial reports
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#D4AF37] mt-0.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Annual independent audit
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#D4AF37] mt-0.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Supervised by finance committee
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#D4AF37] mt-0.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Community review of expenditures
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <a href="#" className="inline-block text-[#D4AF37] hover:underline">View Detailed Financial Reports</a>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
              <div className="bg-[#0C6E4E] text-white p-4">
                <h2 className="text-2xl font-heading">Community Involvement</h2>
              </div>
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="font-medium text-[#0C6E4E] mb-3">Current Community Poll</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-3">Which additional program would you like to see at our masjid?</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="option1" 
                          name="poll" 
                          className="mr-2" 
                          checked={selectedOption === "Youth Sports Program"}
                          onChange={() => setSelectedOption("Youth Sports Program")}
                        />
                        <label htmlFor="option1">Youth sports program</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="option2" 
                          name="poll" 
                          className="mr-2" 
                          checked={selectedOption === "Women's Islamic Studies Circle"}
                          onChange={() => setSelectedOption("Women's Islamic Studies Circle")}
                        />
                        <label htmlFor="option2">Women's Islamic studies circle</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="option3" 
                          name="poll" 
                          className="mr-2" 
                          checked={selectedOption === "Community Garden Project"}
                          onChange={() => setSelectedOption("Community Garden Project")}
                        />
                        <label htmlFor="option3">Community garden project</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="option4" 
                          name="poll" 
                          className="mr-2" 
                          checked={selectedOption === "Senior Citizen Support Services"}
                          onChange={() => setSelectedOption("Senior Citizen Support Services")}
                        />
                        <label htmlFor="option4">Senior citizen support services</label>
                      </div>
                    </div>
                    <button 
                      className="mt-4 bg-[#0C6E4E] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center"
                      onClick={handleVote}
                      disabled={isVoting || !selectedOption}
                    >
                      {isVoting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Vote'
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-[#0C6E4E] mb-3">How to Get Involved</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Join a masjid committee</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Volunteer for community events</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Participate in feedback sessions</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Submit suggestions for improvement</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Support fundraising initiatives</span>
                    </li>
                  </ul>
                  <a href="#" className="inline-block text-[#D4AF37] hover:underline">Join Our Volunteer Team</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-heading text-[#0C6E4E] text-center mb-8">Upcoming Community Events</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {communityEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex">
                <div className="w-20 flex-shrink-0 flex flex-col text-center">
                  <div className="bg-[#0C6E4E] bg-opacity-10 text-[#0C6E4E] py-1 font-medium">{event.month}</div>
                  <div className="bg-gray-100 py-3 text-2xl font-bold flex-grow flex items-center justify-center">{event.day}</div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-medium text-[#0C6E4E] mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{event.time}</p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a href="#" className="inline-block bg-[#0C6E4E] hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors">
              View Full Calendar
            </a>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-heading text-[#0C6E4E] mb-6">Masjid Committees</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-[#0C6E4E] mb-2">Administrative Committee</h3>
                <p className="mb-2">Responsible for day-to-day operations, staff management, and overall administration of the masjid.</p>
                <div className="flex">
                  <div className="bg-[#0C6E4E] bg-opacity-10 text-[#0C6E4E] text-sm px-3 py-1 rounded-full">Meets Monthly</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-[#0C6E4E] mb-2">Education Committee</h3>
                <p className="mb-2">Oversees the madrasa, develops curriculum, and coordinates educational programs and activities.</p>
                <div className="flex">
                  <div className="bg-[#0C6E4E] bg-opacity-10 text-[#0C6E4E] text-sm px-3 py-1 rounded-full">Meets Bi-weekly</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-[#0C6E4E] mb-2">Finance Committee</h3>
                <p className="mb-2">Manages the masjid's finances, prepares budgets, oversees expenditures, and ensures financial transparency.</p>
                <div className="flex">
                  <div className="bg-[#0C6E4E] bg-opacity-10 text-[#0C6E4E] text-sm px-3 py-1 rounded-full">Meets Monthly</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-[#0C6E4E] mb-2">Youth Committee</h3>
                <p className="mb-2">Plans and coordinates activities and programs specifically for young Muslims in the community.</p>
                <div className="flex">
                  <div className="bg-[#0C6E4E] bg-opacity-10 text-[#0C6E4E] text-sm px-3 py-1 rounded-full">Meets Bi-weekly</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-[#0C6E4E] mb-2">Women's Committee</h3>
                <p className="mb-2">Organizes programs and initiatives to address the specific needs and interests of women in the community.</p>
                <div className="flex">
                  <div className="bg-[#0C6E4E] bg-opacity-10 text-[#0C6E4E] text-sm px-3 py-1 rounded-full">Meets Bi-weekly</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-heading text-[#0C6E4E] mb-6">Community Feedback</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-3">Recent Improvements Based on Your Feedback</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Enhanced Women's Prayer Area</h4>
                    <p className="text-sm text-gray-600">Renovated with improved facilities, better sound system, and dedicated childcare space</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Extended Library Hours</h4>
                    <p className="text-sm text-gray-600">Now open late on weekends and after Isha prayer on weekdays</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Online Class Registration</h4>
                    <p className="text-sm text-gray-600">Implemented digital enrollment system for madrasa classes</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Improved Parking Facilities</h4>
                    <p className="text-sm text-gray-600">Added 25 new parking spaces and installed better lighting</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-3">Submit Your Suggestions</h3>
              <p className="mb-4">We value your input! Please share your ideas for improving our masjid and its services.</p>
              
              <a href="#" className="inline-block bg-[#0C6E4E] hover:bg-opacity-90 text-white px-4 py-2 rounded-md transition-colors">
                Submit Feedback
              </a>
            </div>
          </div>
        </div>
          </TabsContent>
          
          <TabsContent value="residents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Society Residents</CardTitle>
                <CardDescription>
                  FGEHF D Blocks society consists of 22 blocks (D-1 to D-22) with 8 flats in each block. Total 176 flats/families.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a block" />
                    </SelectTrigger>
                    <SelectContent>
                      {society ? (
                        Array.from({ length: society.totalBlocks }, (_, i) => (
                          <SelectItem key={i} value={`D-${i+1}`}>
                            Block D-{i+1}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>Loading blocks...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {membersLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>List of society members and residents</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Block</TableHead>
                        <TableHead>Flat</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Phone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members && members
                        .filter(member => !selectedBlock || `D-${blocks?.find(b => b.id === member.blockId)?.blockName}` === selectedBlock)
                        .map(member => (
                          <TableRow key={member.id}>
                            <TableCell>Block D-{blocks?.find(b => b.id === member.blockId)?.blockName}</TableCell>
                            <TableCell>{member.flatNumber}</TableCell>
                            <TableCell>{member.isOwner ? 'Owner' : 'Tenant'}</TableCell>
                            <TableCell>{member.phoneNumber}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="finances" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                  Monthly contribution: PKR {SOCIETY_DETAILS.monthlyContribution} per flat
                </CardDescription>
              </CardHeader>
              <CardContent>
                {financialSummaryLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : financialSummary ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full p-3 bg-green-100">
                              <ArrowUpCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total Contributions</p>
                              <p className="text-2xl font-bold">PKR {financialSummary.totalContributions.toLocaleString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full p-3 bg-red-100">
                              <ArrowDownCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total Expenses</p>
                              <p className="text-2xl font-bold">PKR {financialSummary.totalExpenses.toLocaleString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full p-3 bg-blue-100">
                              <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Current Balance</p>
                              <p className="text-2xl font-bold">PKR {financialSummary.currentBalance.toLocaleString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Current Month Collection ({financialSummary.currentMonth.monthYear})</h3>
                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span>Expected Total: PKR {financialSummary.currentMonth.expectedTotal.toLocaleString()}</span>
                              <span>Actual Collection: PKR {financialSummary.currentMonth.actualCollection.toLocaleString()}</span>
                            </div>
                            <Progress value={financialSummary.currentMonth.collectionRate} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Collection Rate: {financialSummary.currentMonth.collectionRate}%</span>
                              <span className="text-red-500">Pending: PKR {financialSummary.currentMonth.pendingAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Recent Expenses</h3>
                        <Card>
                          <CardContent className="p-4">
                            <ScrollArea className="h-[300px]">
                              {expenses && expenses.length > 0 ? (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Title</TableHead>
                                      <TableHead>Category</TableHead>
                                      <TableHead>Amount</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {expenses.map(expense => (
                                      <TableRow key={expense.id}>
                                        <TableCell>{expense.title}</TableCell>
                                        <TableCell>{expense.category}</TableCell>
                                        <TableCell>PKR {expense.amount.toLocaleString()}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <p className="text-center p-4">No expense records found</p>
                              )}
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Pending Contributions</h3>
                        <Card>
                          <CardContent className="p-4">
                            <div className="mb-4">
                              <Input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <ScrollArea className="h-[250px]">
                              {pendingContributionsLoading ? (
                                <div className="flex justify-center p-8">
                                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                                </div>
                              ) : pendingContributions && pendingContributions.flats ? (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Flat</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Amount</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {pendingContributions.flats
                                      .filter(flat => flat.status === 'pending')
                                      .map(flat => (
                                        <TableRow key={flat.memberId}>
                                          <TableCell>{flat.fullAddress}</TableCell>
                                          <TableCell>
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                                              <XCircle className="mr-1 h-3 w-3" />
                                              Pending
                                            </span>
                                          </TableCell>
                                          <TableCell>PKR {flat.pendingAmount.toLocaleString()}</TableCell>
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <p className="text-center p-4">No pending contributions for the selected month</p>
                              )}
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center p-4">Failed to load financial data</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="discussions" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">Community Discussions</h2>
              <Dialog open={newDiscussionOpen} onOpenChange={setNewDiscussionOpen}>
                <DialogTrigger asChild>
                  <Button>
                    New Discussion Topic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Discussion Topic</DialogTitle>
                    <DialogDescription>
                      Start a new discussion for the community to participate in.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">Title</label>
                      <Input 
                        id="title" 
                        value={newDiscussion.title} 
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                        placeholder="Discussion title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <textarea 
                        id="description" 
                        value={newDiscussion.description}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, description: e.target.value })}
                        className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                        placeholder="Describe your discussion topic"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => createDiscussionMutation.mutate(newDiscussion)}
                      disabled={!newDiscussion.title || !newDiscussion.description || createDiscussionMutation.isPending}
                    >
                      {createDiscussionMutation.isPending ? "Creating..." : "Create Discussion"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {discussionsLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : discussions && discussions.length > 0 ? (
              <div className="space-y-4">
                {discussions.map(discussion => (
                  <Card key={discussion.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle>{discussion.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>Created: {format(new Date(discussion.createdAt), 'PP')}</span>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                          {discussion.status}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p>{discussion.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0 border-t bg-muted/50 flex justify-between">
                      <span className="text-sm text-muted-foreground">12 replies</span>
                      <Button variant="ghost" size="sm">View Discussion</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-10 text-center">
                  <div className="mb-4">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No discussions yet</h3>
                  <p className="text-muted-foreground mb-6">Be the first to start a community discussion!</p>
                  <Button onClick={() => setNewDiscussionOpen(true)}>Start New Discussion</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="proposals" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">Community Proposals & Voting</h2>
              <Dialog open={newProposalOpen} onOpenChange={setNewProposalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    New Proposal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Proposal</DialogTitle>
                    <DialogDescription>
                      Submit a new proposal for community consideration and voting.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="proposal-title" className="text-sm font-medium">Title</label>
                      <Input 
                        id="proposal-title" 
                        value={newProposal.title} 
                        onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                        placeholder="Proposal title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="proposal-description" className="text-sm font-medium">Description</label>
                      <textarea 
                        id="proposal-description" 
                        value={newProposal.description}
                        onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                        className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                        placeholder="Describe your proposal in detail"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="estimated-cost" className="text-sm font-medium">Estimated Cost (PKR)</label>
                      <Input 
                        id="estimated-cost" 
                        type="number"
                        min="0"
                        value={newProposal.estimatedCost} 
                        onChange={(e) => setNewProposal({ ...newProposal, estimatedCost: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => createProposalMutation.mutate(newProposal)}
                      disabled={!newProposal.title || !newProposal.description || createProposalMutation.isPending}
                    >
                      {createProposalMutation.isPending ? "Submitting..." : "Submit Proposal"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {proposalsLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : proposals && proposals.length > 0 ? (
              <div className="space-y-4">
                {proposals.map(proposal => (
                  <Card key={proposal.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{proposal.title}</CardTitle>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${proposal.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            proposal.status === 'voting' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`
                        }>
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </span>
                      </div>
                      <CardDescription>
                        Estimated cost: PKR {proposal.estimatedCost.toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{proposal.description}</p>
                      
                      {proposal.status === 'voting' && (
                        <div className="mt-4 space-y-4 border-t pt-4">
                          <h4 className="font-medium">Cast Your Vote</h4>
                          <div className="flex gap-3">
                            <Button 
                              variant="outline" 
                              className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border-green-200"
                              onClick={() => voteOnProposalMutation.mutate({ 
                                proposalId: proposal.id, 
                                voteType: 'yes',
                                comment: ''
                              })}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Yes, Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border-red-200"
                              onClick={() => voteOnProposalMutation.mutate({ 
                                proposalId: proposal.id, 
                                voteType: 'no',
                                comment: ''
                              })}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              No, Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => voteOnProposalMutation.mutate({ 
                                proposalId: proposal.id, 
                                voteType: 'abstain',
                                comment: ''
                              })}
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Abstain
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-10 text-center">
                  <div className="mb-4">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No proposals yet</h3>
                  <p className="text-muted-foreground mb-6">Create a proposal for community improvements or changes.</p>
                  <Button onClick={() => setNewProposalOpen(true)}>Create New Proposal</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityPage;
