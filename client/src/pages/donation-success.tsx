import { Link } from "wouter";

export default function DonationSuccess() {
  return (
    <div className="py-16 bg-[#F7F3E9] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-4">Thank You for Your Donation!</h1>
          
          <p className="text-xl mb-6">Your generous contribution will help support our masjid and community programs.</p>
          
          <div className="bg-[#F7F3E9] p-6 rounded-lg mb-8">
            <h2 className="text-xl font-medium text-[#0C6E4E] mb-4">The Prophet Muhammad ﷺ said:</h2>
            <p className="italic text-lg mb-2">"The likeness of those who spend their wealth in the way of Allah is as the likeness of a grain that grows seven ears, in every ear a hundred grains. Allah multiplies for whom He wills."</p>
            <p className="text-sm text-gray-600">(Surah Al-Baqarah 2:261)</p>
          </div>
          
          <p className="mb-8">A receipt has been sent to your email address. If you have any questions about your donation, please contact us.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/donate">
              <a className="px-6 py-3 bg-[#0C6E4E] text-white rounded-md hover:bg-opacity-90 transition-colors">
                Make Another Donation
              </a>
            </Link>
            <Link href="/">
              <a className="px-6 py-3 border border-[#0C6E4E] text-[#0C6E4E] rounded-md hover:bg-[#0C6E4E] hover:text-white transition-colors">
                Return to Home
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}