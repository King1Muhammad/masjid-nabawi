import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const Community = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();
  
  const { data: campaigns } = useQuery({
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

  return (
    <section id="community" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading text-[#0C6E4E] mb-4">Community & Transparency</h2>
          <p className="max-w-3xl mx-auto">We believe in maintaining transparency and involving our community in masjid operations and decision-making.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Financial Transparency */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#0C6E4E] text-white p-4">
              <h3 className="text-xl font-heading">Financial Transparency</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-[#0C6E4E] mb-2">Monthly Income & Expenses</h4>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  {campaigns ? (
                    <div className="w-full p-4">
                      {campaigns.map((campaign: any) => (
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
                  ) : (
                    <p className="text-gray-500">Financial chart showing monthly income and expenses</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-[#0C6E4E] mb-2">Income Breakdown</h4>
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
              </div>
              
              <a href="#" className="inline-block text-[#D4AF37] hover:underline">View Detailed Financial Reports</a>
            </div>
          </div>
          
          {/* Community Involvement */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#0C6E4E] text-white p-4">
              <h3 className="text-xl font-heading">Community Involvement</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-[#0C6E4E] mb-2">Current Community Poll</h4>
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
              
              <div className="mb-6">
                <h4 className="font-medium text-[#0C6E4E] mb-2">Upcoming Community Meetings</h4>
                <ul className="space-y-2">
                  <li className="flex">
                    <div className="flex-shrink-0 w-12 text-center mr-3">
                      <div className="bg-[#0C6E4E] bg-opacity-10 text-[#0C6E4E] rounded-t px-2 py-1 text-xs">MAY</div>
                      <div className="bg-gray-100 rounded-b px-2 py-1 font-bold">15</div>
                    </div>
                    <div>
                      <h5 className="font-medium">Masjid Committee Meeting</h5>
                      <p className="text-sm text-gray-600">7:00 PM - Community Hall</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-12 text-center mr-3">
                      <div className="bg-[#0C6E4E] bg-opacity-10 text-[#0C6E4E] rounded-t px-2 py-1 text-xs">JUN</div>
                      <div className="bg-gray-100 rounded-b px-2 py-1 font-bold">05</div>
                    </div>
                    <div>
                      <h5 className="font-medium">Community Feedback Session</h5>
                      <p className="text-sm text-gray-600">8:00 PM - After Isha Prayer</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <a href="#" className="inline-block text-[#D4AF37] hover:underline">View Community Calendar</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
