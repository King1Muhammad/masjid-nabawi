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
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C6E4E]/90 to-[#0C6E4E]/80 z-10"></div>
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="/images/masjid_bg.jpg"
              alt="Masjid Background" 
              className="w-full h-full object-cover opacity-70 brightness-75"
            />
          </div>
          <div className="relative z-20 py-20 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-heading text-white mb-4 drop-shadow-md">Your Contribution, Our Future</h1>
            <h2 className="text-2xl md:text-3xl font-heading text-white/95 mb-4 drop-shadow-md">Building a Path to a Stronger Community and a Better Tomorrow</h2>
            <p className="text-xl text-white/95 max-w-3xl mx-auto mb-8 drop-shadow-sm">
              Join us in creating a masjid that not only serves as a space for worship but also empowers communities through education, transparency, and technology. By donating, you're contributing to the construction of a masjid based on the noble model of Masjid e Nabawi, as well as a visionary global platform for decentralized governance and transparent democracy that connects societies worldwide.
            </p>
            <a 
              href="#donation-form" 
              className="inline-block bg-[#D4AF37] hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-md shadow-lg transition-all transform hover:scale-105"
            >
              Donate Now
            </a>
          </div>
        </div>
        
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
              <h2 className="text-2xl font-heading text-[#0C6E4E] mb-6">Active Fundraising Campaigns</h2>
              
              {campaignsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin w-10 h-10 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                </div>
              ) : campaigns && campaigns.length > 0 ? (
                <div className="space-y-8">
                  {campaigns.map(campaign => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-medium text-[#0C6E4E] mb-2">{campaign.name}</h3>
                      <p className="mb-4">{campaign.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                        <div 
                          className="bg-[#D4AF37] h-4 rounded-full transition-all duration-1000 ease-in-out" 
                          style={{ width: `${Math.min(100, (Number(campaign.raised) / Number(campaign.goal)) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm mb-4">
                        <span className="font-medium">PKR {Number(campaign.raised).toLocaleString()} raised</span>
                        <span>Goal: PKR {Number(campaign.goal).toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => {
                          const donateSection = document.getElementById('donation-form');
                          if (donateSection) {
                            donateSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="text-sm bg-[#0C6E4E] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                      >
                        Contribute to this Campaign
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Masjid Construction Campaign */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-medium text-[#0C6E4E]">Masjid Construction Campaign</h3>
                      <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Active</span>
                    </div>
                    <p className="mb-4">Only 20% foundation and basic structure complete. The remaining major work is paused due to lack of funds. Your support will help us complete the House of Allah.</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                      <div 
                        className="bg-[#D4AF37] h-4 rounded-full transition-all duration-1000 ease-in-out" 
                        style={{ width: '20%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="font-medium">PKR 2,000,000 raised</span>
                      <span>Goal: PKR 100,000,000</span>
                    </div>
                    <button 
                      onClick={() => {
                        const donateSection = document.getElementById('donation-form');
                        if (donateSection) {
                          donateSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-sm bg-[#0C6E4E] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                    >
                      Help Complete the House of Allah
                    </button>
                  </div>
                  
                  {/* Global Platform Campaign */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-medium text-[#0C6E4E]">Visionary Global Platform Campaign</h3>
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">New</span>
                    </div>
                    <p className="mb-4">Funding needed to launch an AI-powered decentralized governance and Islamic learning platform. Your contribution will support development, design, server costs, AI tools, and teamwork.</p>
                    <div className="mb-4 flex items-center justify-center">
                      <img src="/images/global_platform.jpg" alt="Global Islamic Platform" className="h-40 object-contain rounded" />
                    </div>
                    <button 
                      onClick={() => {
                        const donateSection = document.getElementById('donation-form');
                        if (donateSection) {
                          donateSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-sm bg-[#0C6E4E] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                    >
                      Support a Global Islamic Transformation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div id="donation-form" className="bg-white rounded-lg shadow-lg p-8">
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
                        PKR {amount}
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
                    <option value="Masjid Construction">Masjid Construction</option>
                    <option value="Global Platform">Global Platform</option>
                    <option value="Madrasa">Madrasa / Islamic Education</option>
                    <option value="Mission Expansion">Mission Expansion</option>
                    <option value="zakat">Zakat</option>
                    <option value="sadaqah">Sadaqah</option>
                    {/* Dynamic campaigns from backend */}
                    {campaigns?.map(campaign => (
                      campaign.name !== "Masjid Construction" && 
                      campaign.name !== "Global Platform" && 
                      campaign.name !== "Madrasa" && 
                      campaign.name !== "Mission Expansion" && (
                        <option key={campaign.id} value={campaign.name}>{campaign.name}</option>
                      )
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
                  <label className="block text-sm font-medium mb-2">Available Payment Methods</label>
                  <p className="text-sm text-gray-500 mb-3">
                    Select a payment option for further instructions on the next page.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-[#0C6E4E] text-[#0C6E4E] rounded-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                      <span className="font-medium">Bank Transfer</span>
                    </div>
                    <div className="p-3 border border-[#0C6E4E] text-[#0C6E4E] rounded-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M22 8a.76.76 0 0 0 0-.21v-.08a.77.77 0 0 0-.07-.16.35.35 0 0 0-.05-.08l-.1-.13-.08-.06-.12-.09-9-5a1 1 0 0 0-1 0l-9 5-.09.07-.11.08a.41.41 0 0 0-.09.11.39.39 0 0 0-.06.09.59.59 0 0 0-.06.14.3.3 0 0 0 0 .1A.76.76 0 0 0 2 8v8a1 1 0 0 0 .52.87l9 5a.75.75 0 0 0 .13.06h.1a1.06 1.06 0 0 0 .5 0h.1l.14-.06 9-5A1 1 0 0 0 22 16V8z"/>
                        <path d="M12 22V12"/>
                        <path d="M12 12 2 6.46"/>
                        <path d="m22 6.5-10 5.5"/>
                      </svg>
                      <span className="font-medium">EasyPaisa</span>
                    </div>
                    <div className="p-3 border border-[#0C6E4E] text-[#0C6E4E] rounded-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/>
                        <path d="M2 13h10"/>
                        <path d="m9 16 3-3-3-3"/>
                      </svg>
                      <span className="font-medium">JazzCash</span>
                    </div>
                    <div className="p-3 border border-[#0C6E4E] text-[#0C6E4E] rounded-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <rect width="19" height="14" x="2.5" y="5" rx="2"/>
                        <circle cx="7" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="17" cy="12" r="1.5" fill="currentColor"/>
                      </svg>
                      <span className="font-medium">NayaPay</span>
                    </div>
                    <div className="p-3 border border-[#0C6E4E] text-[#0C6E4E] rounded-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                        <line x1="16" x2="2" y1="8" y2="22"/>
                        <line x1="17.5" x2="9" y1="15" y2="15"/>
                      </svg>
                      <span className="font-medium">Crypto (TRC20)</span>
                    </div>
                    <div className="p-3 border border-[#0C6E4E] text-[#0C6E4E] rounded-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v12"/>
                        <path d="M8 10h8"/>
                      </svg>
                      <span className="font-medium">Crypto (BNB)</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 p-4 bg-[#F7F3E9] rounded-md">
                  <h3 className="font-medium mb-2 text-gray-800">Thank You</h3>
                  <p className="text-sm text-gray-700">Thank you for your generous contribution! A confirmation receipt will be sent to your email address. JazakAllah Khair for your generosity!</p>
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
              <p className="mb-4 text-lg">Your donations are instrumental in helping us build more than just a masjid – they are creating a global platform that connects communities through transparent governance, education, and support for those in need.</p>
              <p className="mb-6 text-lg">Every penny donated goes directly into the construction, education, charity, and innovative global platform designed to uplift societies worldwide.</p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium">Masjid Construction & Maintenance</h3>
                    <p className="text-sm opacity-80">Completing our masjid construction and ensuring prayer halls, ablution areas, and classrooms remain well-maintained</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium">Global Platform Development</h3>
                    <p className="text-sm opacity-80">Building an AI-powered decentralized governance platform that connects Muslims worldwide through transparent systems</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium">Islamic Education Programs</h3>
                    <p className="text-sm opacity-80">Supporting our madrasa, Quran classes, and scholarship programs for local and international students</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium">Charity & Community Support</h3>
                    <p className="text-sm opacity-80">Distributing aid to the needy, supporting widows and orphans, and providing emergency assistance to those in need</p>
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
          
          {/* Testimonials and Hadiths */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
            <h2 className="text-2xl font-heading text-[#0C6E4E] mb-6 text-center">Testimonials & Inspiration</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#F7F3E9] p-6 rounded-lg">
                <p className="italic mb-4 text-gray-700">"Your support not only builds a masjid but strengthens the community for generations to come. Together, we create spaces of worship, education, and unity."</p>
                <p className="font-medium text-gray-800">- Ahmed Khan, Regular Donor</p>
              </div>
              <div className="bg-[#F7F3E9] p-6 rounded-lg">
                <p className="italic mb-4 text-gray-700">"Every donation is a stepping stone toward a more compassionate world, reflecting the teachings of the Prophet Muhammad ﷺ."</p>
                <p className="font-medium text-gray-800">- Fatima Ahmed, Monthly Donor</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-heading text-xl text-[#0C6E4E] mb-4 text-center">Words of Wisdom</h3>
              <div className="space-y-4">
                <div className="bg-[#F7F3E9] p-4 rounded-lg">
                  <p className="text-center italic text-gray-700">"Build a mosque for Allah, and Allah will build a house for you in Paradise."</p>
                  <p className="text-center font-medium mt-2 text-gray-800">- Sahih Bukhari</p>
                </div>
                <div className="bg-[#F7F3E9] p-4 rounded-lg">
                  <p className="text-center italic text-gray-700">"The best charity is that which is given while you are in need."</p>
                  <p className="text-center font-medium mt-2 text-gray-800">- Prophet Muhammad ﷺ</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact and Get Involved */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
            <h2 className="text-2xl font-heading text-[#0C6E4E] mb-6 text-center">Contact Us / Get Involved</h2>
            
            <div className="mb-6 text-center">
              <p className="text-lg mb-4 text-gray-700">We are here to answer your questions and help you get involved. Reach out to us to learn how you can support the masjid, contribute to the platform, or simply learn more about our mission.</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-[#0C6E4E] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <h3 className="font-medium mb-2 text-gray-800">Call Us</h3>
                <p className="text-sm text-gray-700">+92 334-9214600</p>
                <p className="text-sm text-gray-700">+92 346-8053268</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0C6E4E] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <h3 className="font-medium mb-2 text-gray-800">Email Us</h3>
                <p className="text-sm text-gray-700">admin@masjidenabawismodel.com</p>
                <p className="text-sm text-gray-700">muhammadqureshi@masjidenabawismodel.com</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0C6E4E] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3 className="font-medium mb-2 text-gray-800">Visit Us</h3>
                <p className="text-sm text-gray-700">Opposite D-13 Block FGEHF</p>
                <p className="text-sm text-gray-700">G-11/4 Islamabad, Pakistan</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0C6E4E] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  </svg>
                </div>
                <h3 className="font-medium mb-2 text-gray-800">WhatsApp</h3>
                <a href="https://wa.me/923339214600" target="_blank" rel="noopener noreferrer" className="text-sm text-[#0C6E4E] hover:underline">+92 333-9214600</a>
              </div>
            </div>
            
            <div className="mt-8">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.3350328127934!2d73.03202027636844!3d33.69957933749264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbe5be3f46739%3A0xd7530c73e0295e1c!2sJamia%20Masjid%20Nabavi%20Qureshi%20Hashmi!5e0!3m2!1sen!2s!4v1617458769111!5m2!1sen!2s" 
                width="100%" 
                height="300" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                className="rounded-lg"
                title="Masjid Location"
              ></iframe>
            </div>
          </div>
          
          {/* Footer CTA */}
          <div className="mt-12 bg-[#0C6E4E] text-white rounded-lg shadow-lg p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-heading mb-4">Your contribution can build a Masjid, educate generations, and bring global change.</h2>
            <p className="text-lg opacity-90 mb-8">Donate today and earn continuous reward (Sadaqah Jariyah).</p>
            <a 
              href="#donation-form" 
              className="inline-block bg-[#D4AF37] hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-md shadow-lg transition-all transform hover:scale-105"
            >
              Donate Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
