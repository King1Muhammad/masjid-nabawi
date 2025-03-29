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
      await apiRequest('POST', '/api/donations', data);
      
      toast({
        title: "Donation Successful",
        description: "Thank you for your generous contribution!",
      });
      
      // Reset form
      setSelectedAmount(null);
      setCustomAmount('');
      setValue('amount', 0);
      setValue('firstName', '');
      setValue('lastName', '');
      setValue('email', '');
      setValue('message', '');
    } catch (error) {
      toast({
        title: "Donation Failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="donate" className="py-16 bg-[#0C6E4E] text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading mb-6">Support Our Masjid</h2>
            <p className="mb-4">Your generous contributions help maintain our masjid, support educational programs, and provide community services. All donations are tax-deductible.</p>
            
            <div className="mb-8">
              <h3 className="text-xl mb-4">Current Fundraising Campaigns</h3>
              
              {campaigns ? (
                campaigns.map(campaign => (
                  <div key={campaign.id} className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
                    <h4 className="text-[#D4AF37] font-bold">{campaign.name}</h4>
                    <p className="text-sm mb-2">{campaign.description}</p>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-[#D4AF37] h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (Number(campaign.raised) / Number(campaign.goal)) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>${Number(campaign.raised).toLocaleString()} raised</span>
                      <span>Goal: ${Number(campaign.goal).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                  <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-xl mb-4">How Your Donations Help</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Maintain and improve masjid facilities
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Support educational programs and scholarships
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fund community services and charity work
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sponsor events and programs throughout the year
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-[#333333]">
              <h3 className="text-2xl font-heading text-[#0C6E4E] mb-6 text-center">Make a Donation</h3>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
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
                
                <div className="mb-4">
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
                    {...register('amount')}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
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
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                
                <div className="mb-4">
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
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="message">Message (Optional)</label>
                  <textarea 
                    id="message" 
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
                  <div className="flex space-x-4 mb-2">
                    <button 
                      type="button" 
                      className="flex-1 py-2 border border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E] hover:text-white rounded-md transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                      Credit Card
                    </button>
                    <button 
                      type="button" 
                      className="flex-1 py-2 border border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E] hover:text-white rounded-md transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 7H7v6h6V7z" />
                        <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                      </svg>
                      PayPal
                    </button>
                  </div>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
