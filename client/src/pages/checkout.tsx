import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Missing Stripe public key. Payments will not be processed correctly.');
}

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ donationData }: { donationData: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment Service Unavailable",
        description: "Payment processing is currently unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: window.location.origin + "/donate/success",
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred while processing your payment.",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Handle successful payment
        await apiRequest('POST', '/api/donations', donationData);

        toast({
          title: "Payment Successful",
          description: "Thank you for your generous donation!",
        });

        // Redirect to success page
        setLocation('/donate/success');
      } else {
        // Handle other potential payment intent statuses
        toast({
          title: "Payment Processing",
          description: "Your payment is being processed. We'll update you once it's complete.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#F7F3E9] p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium mb-2">Donation Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">${donationData?.amount?.toFixed(2) || '0.00'}</span>
          
          <span className="text-gray-600">Campaign:</span>
          <span className="font-medium">{donationData?.campaign || 'General Fund'}</span>
          
          <span className="text-gray-600">Type:</span>
          <span className="font-medium capitalize">{donationData?.donationType || 'One-time'}</span>
        </div>
      </div>

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#D4AF37] hover:bg-opacity-90 text-white py-3 rounded-md transition-colors font-medium disabled:opacity-50"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Processing...
          </div>
        ) : (
          'Complete Donation'
        )}
      </button>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Your payment is secure and encrypted. By donating, you agree to our terms and conditions.</p>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [donationData, setDonationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Parse the donation data from URL
    const searchParams = new URLSearchParams(window.location.search);
    const amount = parseFloat(searchParams.get('amount') || '0');
    const campaign = searchParams.get('campaign') || 'general';
    const donationType = searchParams.get('type') || 'one-time';
    const firstName = searchParams.get('firstName') || '';
    const lastName = searchParams.get('lastName') || '';
    const email = searchParams.get('email') || '';
    const message = searchParams.get('message') || '';
    const anonymous = searchParams.get('anonymous') === 'true';

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Donation",
        description: "Please specify a valid donation amount.",
        variant: "destructive",
      });
      setLocation('/donate');
      return;
    }

    const data = {
      amount,
      campaign,
      donationType,
      firstName,
      lastName,
      email,
      message,
      anonymous
    };

    setDonationData(data);

    // Create PaymentIntent
    apiRequest("POST", "/api/create-payment-intent", { amount, campaign })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error(data.message || "Failed to initialize payment");
        }
      })
      .catch(error => {
        toast({
          title: "Payment Initialization Failed",
          description: error.message || "There was an error setting up your payment. Please try again.",
          variant: "destructive",
        });
        setLocation('/donate');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toast, setLocation]);

  if (isLoading) {
    return (
      <div className="py-16 bg-[#F7F3E9] min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-[#0C6E4E] border-t-transparent rounded-full mb-4"></div>
              <p className="text-lg">Initializing payment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret || !stripePromise) {
    return (
      <div className="py-16 bg-[#F7F3E9] min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center py-8">
              <h2 className="text-2xl font-medium text-red-600 mb-4">Payment Setup Error</h2>
              <p className="mb-6">There was an error setting up the payment system. This could be due to missing configuration or a temporary service disruption.</p>
              <button
                onClick={() => setLocation('/donate')}
                className="px-6 py-2 bg-[#0C6E4E] text-white rounded-md hover:bg-opacity-90"
              >
                Return to Donation Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-[#F7F3E9] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] text-center mb-6">Complete Your Donation</h1>
          <p className="text-center mb-8">Please review and complete your payment information below</p>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm donationData={donationData} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}