import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

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
      // In a real implementation, this would submit to an API
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
        <p className="text-xl text-center max-w-3xl mx-auto mb-16">We believe in maintaining transparency and involving our community in masjid operations and decision-making.</p>
        
        <div className="grid md:grid-cols-12 gap-8 mb-16">
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
      </div>
    </div>
  );
};

export default CommunityPage;
