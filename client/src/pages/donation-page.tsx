import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertDonationSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Extend schema for donation form
const extendedSchema = insertDonationSchema.extend({
  amount: z.preprocess(
    (val) => Number(val),
    z.number().positive('Amount must be greater than 0')
  ),
});

type DonationFormData = z.infer<typeof extendedSchema>;

interface Campaign {
  id: number;
  name: string;
  description: string;
  goal: number;
  raised: number;
  active: boolean;
}

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const { toast } = useToast();
  
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<DonationFormData>({
    resolver: zodResolver(extendedSchema),
    defaultValues: {
      donationType: 'one-time',
      campaign: 'general',
      amount: 0,
      anonymous: false
    }
  });
  
  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
    setValue('amount', amount);
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAmount(null);
    setCustomAmount(e.target.value);
    setValue('amount', parseFloat(e.target.value) || 0);
  };
  
  const onSubmit = async (data: DonationFormData) => {
    try {
      if (!data.amount || data.amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid donation amount.",
          variant: "destructive",
        });
        return;
      }
      
      // Create query string with donation data
      const params = new URLSearchParams({
        amount: data.amount.toString(),
        campaign: data.campaign || 'general',
        type: data.donationType || 'one-time',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        message: data.message || '',
        anonymous: data.anonymous ? 'true' : 'false'
      });
      
      // Redirect to checkout page with donation data
      window.location.href = `/donate/checkout?${params.toString()}`;
    } catch (error) {
      toast({
        title: "Process Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-16 bg-[#F7F3E9]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-[#0C6E4E] text-center mb-4">Support Our Masjid</h1>
        <p className="text-xl text-center max-w-3xl mx-auto mb-16">Your generous contributions help maintain our masjid, support educational programs, and provide community services.</p>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-heading text-[#0C6E4E] mb-6">Why Donate?</h2>
              <div className="prose max-w-none">
                <p>By contributing to Jamia Masjid Nabvi Qureshi Hashmi, you become a vital part of our mission to provide a space for worship, education, and community engagement. Your generosity directly supports:</p>
                
                <ul>
                  <li><strong>Masjid Operations and Maintenance</strong> - Ensuring our facilities remain well-maintained and operational for daily prayers and activities</li>
                  <li><strong>Educational Programs</strong> - Supporting our madrasa, Quran classes, and Islamic studies programs</li>
                  <li><strong>Community Services</strong> - Funding charitable activities, community events, and assistance for those in need</li>
                  <li><strong>Expansion Projects</strong> - Contributing to our growth to better serve our increasing community</li>
                </ul>
                
                <p>The Prophet Muhammad ﷺ said: "Whoever builds a mosque for Allah, Allah will build for him a similar house in Paradise." (Bukhari)</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-heading text-[#0C6E4E] mb-6">Current Fundraising Campaigns</h2>
              
              {campaignsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin w-10 h-10 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                </div>
              ) : campaigns && campaigns.length > 0 ? (
                <div className="space-y-6">
                  {campaigns.map(campaign => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-xl font-medium text-[#0C6E4E] mb-2">{campaign.name}</h3>
                      <p className="mb-4">{campaign.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-[#D4AF37] h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (Number(campaign.raised) / Number(campaign.goal)) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>${Number(campaign.raised).toLocaleString()} raised</span>
                        <span>Goal: ${Number(campaign.goal).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No active campaigns at the moment. Your general donation is always appreciated.</p>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-heading text-[#0C6E4E] mb-6 text-center">Make a Donation</h2>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" htmlFor="donationType">Donation Type</label>
                  <select 
                    id="donationType" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                    {...register('donationType')}
                  >
                    <option value="one-time">One-time Donation</option>
                    <option value="monthly">Monthly Donation</option>
                    <option value="zakat">Zakat</option>
                    <option value="sadaqah">Sadaqah</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Select Amount</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[50, 100, 200, 500, 1000].map(amount => (
                      <button 
                        key={amount}
                        type="button" 
                        className={`py-2 border ${selectedAmount === amount ? 'bg-[#0C6E4E] text-white' : 'border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E] hover:text-white'} rounded-md transition-colors`}
                        onClick={() => handleAmountClick(amount)}
                      >
                        ${amount}
                      </button>
                    ))}
                    <button 
                      type="button" 
                      className={`py-2 border ${selectedAmount === null && customAmount ? 'bg-[#0C6E4E] text-white' : 'border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E] hover:text-white'} rounded-md transition-colors`}
                      onClick={() => setSelectedAmount(null)}
                    >
                      Other
                    </button>
                  </div>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]" 
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" htmlFor="campaign">Donation For</label>
                  <select 
                    id="campaign" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                    {...register('campaign')}
                  >
                    <option value="general">General Masjid Fund</option>
                    {campaigns?.map(campaign => (
                      <option key={campaign.id} value={campaign.name}>{campaign.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" htmlFor="message">Message (Optional)</label>
                  <textarea 
                    id="message" 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                    {...register('message')}
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="anonymous" 
                      className="mr-2"
                      {...register('anonymous')}
                    />
                    <label htmlFor="anonymous">Make my donation anonymous</label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button" 
                      className="py-3 border border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E] hover:text-white rounded-md transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                      Credit Card
                    </button>
                    <button 
                      type="button" 
                      className="py-3 border border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E] hover:text-white rounded-md transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 7H7v6h6V7z" />
                        <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                      </svg>
                      PayPal
                    </button>
                  </div>
                </div>
                
                <div className="mb-6 p-4 bg-[#F7F3E9] rounded-md">
                  <h3 className="font-medium mb-2">Donation Receipt</h3>
                  <p className="text-sm">Upon successful donation, a receipt will be sent to your email address for tax deduction purposes. Our masjid is a registered non-profit organization.</p>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-[#D4AF37] hover:bg-opacity-90 text-white py-3 rounded-md transition-colors font-medium disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Donate Now'
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Your donations are secure and encrypted. By donating, you agree to our terms and conditions.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-[#0C6E4E] text-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-heading mb-6">How Your Donations Help</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium">Maintain and improve masjid facilities</h3>
                    <p className="text-sm opacity-80">Ensuring our prayer halls, ablution areas, and classrooms remain clean, comfortable and well-maintained</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium">Support educational programs and scholarships</h3>
                    <p className="text-sm opacity-80">Providing quality Islamic education to children and adults regardless of financial circumstances</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium">Fund community services and charity work</h3>
                    <p className="text-sm opacity-80">Distributing food to the needy, supporting widows and orphans, and providing emergency assistance</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium">Sponsor events and programs throughout the year</h3>
                    <p className="text-sm opacity-80">Organizing Ramadan iftars, Eid celebrations, educational seminars, and youth activities</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-heading mb-6">Ways to Donate</h2>
              <div className="space-y-4">
                <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <h3 className="font-medium text-[#D4AF37]">One-Time Donation</h3>
                  <p className="text-sm mt-1">Make a single contribution of any amount to support our masjid and its activities.</p>
                </div>
                
                <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <h3 className="font-medium text-[#D4AF37]">Monthly Donation</h3>
                  <p className="text-sm mt-1">Set up a recurring monthly donation to provide sustainable support for our ongoing programs.</p>
                </div>
                
                <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <h3 className="font-medium text-[#D4AF37]">Zakat</h3>
                  <p className="text-sm mt-1">Fulfill your obligatory zakat through our masjid. We ensure proper distribution to eligible recipients.</p>
                </div>
                
                <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <h3 className="font-medium text-[#D4AF37]">Sadaqah</h3>
                  <p className="text-sm mt-1">Give voluntary charity for specific causes or general masjid operations.</p>
                </div>
                
                <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <h3 className="font-medium text-[#D4AF37]">Waqf (Endowment)</h3>
                  <p className="text-sm mt-1">Make a lasting contribution by donating property or funds as a permanent endowment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
