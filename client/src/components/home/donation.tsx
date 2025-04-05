import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiRequest } from '@/lib/queryClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertDonationSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: number;
  name: string;
  description: string;
  goal: number;
  raised: number;
}

const extendedSchema = insertDonationSchema.extend({
  amount: z.preprocess(
    (val) => Number(val),
    z.number().positive('Amount must be greater than 0')
  ),
});

type DonationFormData = z.infer<typeof extendedSchema>;

const DonationSection = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const { toast } = useToast();
  
  const { data: campaigns } = useQuery<Campaign[]>({
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
    <section id="donate" className="py-16 bg-[#0C6E4E] text-white relative overflow-hidden">
      {/* Decorative pattern in the background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M0 0h10v10H0zm20 0h10v10H20zM0 20h10v10H0zm20 20h10v10H20z" fill="#D4AF37" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading mb-4">Support Our Masjid</h2>
          <p className="text-xl max-w-3xl mx-auto">Your generous contributions build the path to a stronger community and a better tomorrow.</p>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-4"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm p-6">
            <h3 className="text-2xl font-heading mb-6 border-b border-white/20 pb-3">Why Donate?</h3>
            
            <p className="mb-6 text-lg">By contributing to Jamia Masjid Nabvi Qureshi Hashmi, you become a vital part of our mission to provide a space for worship, education, and community engagement based on Masjid-e-Nabawi's model.</p>
            
            <h4 className="text-xl text-[#D4AF37] font-bold mb-4">Your Donations Support:</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm transition-transform hover:scale-105">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-[#D4AF37] mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L10 13.197l-4.419 2.617A1 1 0 014 15V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h5 className="font-bold">Masjid Construction</h5>
                </div>
                <p className="text-sm pl-11">Help complete our masjid building in Islamabad, currently stalled due to lack of funds</p>
              </div>
              
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm transition-transform hover:scale-105">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-[#D4AF37] mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h5 className="font-bold">Islamic Education</h5>
                </div>
                <p className="text-sm pl-11">Fund our madrasa programs, scholarships, and teacher salaries</p>
              </div>
              
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm transition-transform hover:scale-105">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-[#D4AF37] mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <h5 className="font-bold">Community Services</h5>
                </div>
                <p className="text-sm pl-11">Support charity works, community events, and services for those in need</p>
              </div>
              
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm transition-transform hover:scale-105">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-[#D4AF37] mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h5 className="font-bold">Global Platform</h5>
                </div>
                <p className="text-sm pl-11">Help develop our visionary AI-powered platform for decentralized Islamic governance</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-heading mb-4 border-b border-white/20 pb-2">Active Campaigns</h3>
              
              {campaigns && campaigns.length > 0 ? (
                campaigns.map(campaign => (
                  <div key={campaign.id} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 mb-4 hover:bg-opacity-20 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[#D4AF37] font-bold">{campaign.name}</h4>
                      <span className="text-xs bg-[#D4AF37] text-white px-2 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-sm mb-3">{campaign.description}</p>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-[#D4AF37] h-2.5 rounded-full transition-transform duration-1000" 
                        style={{ width: `${Math.min(100, (Number(campaign.raised) / Number(campaign.goal)) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>PKR {Number(campaign.raised).toLocaleString()} raised</span>
                      <span>Goal: PKR {Number(campaign.goal).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 mb-4 hover:bg-opacity-20 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[#D4AF37] font-bold">Masjid Construction Campaign</h4>
                      <span className="text-xs bg-[#D4AF37] text-white px-2 py-1 rounded-full">Urgent</span>
                    </div>
                    <p className="text-sm mb-3">Only 20% foundation and basic structure complete. The remaining major work is paused due to lack of funds.</p>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-[#D4AF37] h-2.5 rounded-full" 
                        style={{ width: '20%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>PKR 2,000,000 raised</span>
                      <span>Goal: PKR 100,000,000</span>
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 mb-4 hover:bg-opacity-20 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[#D4AF37] font-bold">Global Platform Initiative</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">New</span>
                    </div>
                    <p className="text-sm mb-3">Development of AI-powered decentralized governance platform based on Islamic principles.</p>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-[#D4AF37] h-2.5 rounded-full" 
                        style={{ width: '5%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>PKR 500,000 raised</span>
                      <span>Goal: PKR 10,000,000</span>
                    </div>
                  </div>
                </div>
              )}
              
              <blockquote className="italic text-sm mt-6 border-l-4 border-[#D4AF37] pl-4">
                The Prophet Muhammad ﷺ said: "Whoever builds a mosque for Allah, Allah will build for him a similar house in Paradise." <span className="font-semibold">(Bukhari)</span>
              </blockquote>
            </div>
            
            <Link href="/donate">
              <div className="inline-block bg-[#D4AF37] hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors font-medium shadow-lg">
                View All Donation Options
              </div>
            </Link>
          </div>
          
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-[#0C6E4E] p-5 text-white">
                <h3 className="text-2xl font-heading text-center">Make a Donation</h3>
                <p className="text-sm text-center opacity-90 mt-1">Every contribution helps build our community</p>
              </div>
              
              <div className="p-6 text-[#333333]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 mb-4">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-medium text-yellow-800">Complete Your Donation</h4>
                    </div>
                    <p className="text-sm text-yellow-700">For quick donations, only amount and donation type are required. For receipt, please provide your email.</p>
                  </div>
                
                  <div>
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
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (PKR)</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {[100, 500, 1000, 5000, 10000, 50000].map(amount => (
                        <button 
                          key={amount}
                          type="button" 
                          className={`py-2 border ${selectedAmount === amount ? 'bg-[#0C6E4E] text-white' : 'border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E] hover:text-white'} rounded-md transition-colors`}
                          onClick={() => handleAmountClick(amount)}
                        >
                          {amount < 1000 ? amount : `${amount/1000}K`}
                        </button>
                      ))}
                    </div>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">PKR</span>
                      </div>
                      <input 
                        type="text" 
                        className="w-full pl-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]" 
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        name="amount"
                        ref={register('amount').ref}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="campaign">Donation For</label>
                    <select 
                      id="campaign" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                      {...register('campaign')}
                    >
                      <option value="general">General Masjid Fund</option>
                      <option value="Masjid Construction">Masjid Construction</option>
                      <option value="Global Platform">Global Platform</option>
                      <option value="Madrasa">Madrasa / Islamic Education</option>
                      <option value="Mission Expansion">Mission Expansion</option>
                      <option value="zakat">Zakat</option>
                      <option value="sadaqah">Sadaqah</option>
                      {campaigns?.map(campaign => (
                        campaign.name !== "Masjid Construction" && campaign.name !== "Global Platform" && (
                          <option key={campaign.id} value={campaign.name}>{campaign.name}</option>
                        )
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
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
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="email">Email <span className="text-xs text-gray-500">(for receipt)</span></label>
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
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="message">Message/Prayer Request (Optional)</label>
                    <textarea 
                      id="message" 
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                      placeholder="Your message or prayer request"
                      {...register('message')}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="anonymous" 
                        className="w-4 h-4 text-[#0C6E4E] rounded mr-2 focus:ring-[#0C6E4E]"
                        {...register('anonymous')}
                      />
                      <label htmlFor="anonymous" className="text-sm">Make my donation anonymous</label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        type="button" 
                        className="py-2 border border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E] hover:text-white rounded-md transition-colors flex items-center justify-center"
                      >
                        <span className="text-sm">Bank Transfer</span>
                      </button>
                      <button 
                        type="button" 
                        className="py-2 border border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E] hover:text-white rounded-md transition-colors flex items-center justify-center"
                      >
                        <span className="text-sm">EasyPaisa</span>
                      </button>
                      <button 
                        type="button" 
                        className="py-2 border border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E] hover:text-white rounded-md transition-colors flex items-center justify-center"
                      >
                        <span className="text-sm">JazzCash</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Payment details will be shown on the next screen</p>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-[#D4AF37] hover:bg-opacity-90 text-white py-3 rounded-md transition-colors font-medium disabled:opacity-50 mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Proceed to Donation'
                    )}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <Link href="/donate">
                    <div className="text-[#0C6E4E] hover:underline text-sm inline-block">
                      View all donation options including cryptocurrency
                    </div>
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-xs text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Transparent
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Receipts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
