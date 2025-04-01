import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function DonationSuccess() {
  const [, navigate] = useLocation();
  const [seconds, setSeconds] = useState(10);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);
  
  return (
    <div className="py-24 bg-[#F7F3E9] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-green-600" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-heading text-[#0C6E4E] mb-4">Thank You for Your Donation!</h1>
          
          <p className="text-xl mb-8">
            Your generous contribution to Jamia Masjid Nabvi Qureshi Hashmi has been recorded.
          </p>
          
          <div className="bg-[#F7F3E9] p-6 rounded-lg mb-8">
            <h2 className="text-xl font-medium text-[#0C6E4E] mb-4">What Your Donation Supports</h2>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-[#D4AF37] mr-2 mt-0.5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>Masjid maintenance and operations</span>
              </li>
              <li className="flex items-start">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-[#D4AF37] mr-2 mt-0.5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>Educational programs and Madrasa activities</span>
              </li>
              <li className="flex items-start">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-[#D4AF37] mr-2 mt-0.5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>Community services and charitable activities</span>
              </li>
              <li className="flex items-start">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-[#D4AF37] mr-2 mt-0.5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>Expansion and improvement projects</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              May Allah (SWT) accept your contribution and grant you immense rewards.
            </p>
            
            <p className="text-gray-600">
              A receipt has been sent to your email if provided. You'll be redirected to the homepage in {seconds} seconds.
            </p>
            
            <div className="flex justify-center space-x-4 mt-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/donate')}
              >
                Make Another Donation
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                className="bg-[#0C6E4E] hover:bg-opacity-90"
              >
                Return to Homepage
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}