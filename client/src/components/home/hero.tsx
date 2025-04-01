import { Link } from 'wouter';
import masjidPlanImage from "@assets/274956820_282699894003089_2825656189918966555_n.jpg";
import masjidAdminImage from "@assets/masjidnabviadministration.jpg";
import masjidEntryImage from "@assets/IMG_20230318_150311_747.jpg";
import masjidAreaImage from "@assets/IMG_20230318_151124_594.jpg";
import masjidGroundImage from "@assets/IMG_20230318_151137_544.jpg";
import masjidPhilosophy from "@assets/masjidphilosophy.jpg";
import masjidInteriorImage from "@assets/IMG_20230318_150704_129.jpg";
import masjidOutsideImage from "@assets/IMG_20230318_150712_252.jpg";
import masjidExteriorImage from "@assets/IMG_20230318_151014_122.jpg";
import masjidHeroImage from "@assets/1.png";
import chairmanImage from "@assets/chairman_updated.png";
import blueprintImage from "@assets/masjid_blueprint.jpg";
import constructionApprovalImage from "@assets/construction_approval.jpg";
import constructionSiteImage from "@assets/construction_site.jpg";
import constructionPanoramaImage from "@assets/construction_panorama.jpg";
import accountCertificateImage from "@assets/account_certificate.jpg";
import bankAccountImage from "@assets/bank_account.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative">
      <div className="relative overflow-hidden flex flex-col">
        <div className="bg-white w-full">
          <div className="h-[65vh] relative overflow-hidden">
            <img 
              src={masjidHeroImage} 
              alt="Masjid Nabvi Qureshi Hashmi"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <div className="w-full bg-white py-10">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto p-8 text-center">
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                <span className="text-[#D4AF37]">Jamia Masjid Nabvi</span> 
                <span className="text-black"> Qureshi Hashmi</span>
              </h1>
              <p className="text-xl mb-6 font-bold text-black">مسجد نبوی كے طرز پر سارے اعمال كا آغاز مسجد ھٰذا سے</p>
              <p className="text-xl mb-8 text-[#0C6E4E] font-semibold">Based on Masjid-E-Nabawi's Model</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Link href="/donation-page">
                  <div className="bg-[#D4AF37] hover:bg-opacity-90 text-white text-center px-8 py-4 rounded-md transition-colors font-medium cursor-pointer text-lg shadow-xl border border-[#D4AF37]">
                    Support Our Masjid
                  </div>
                </Link>
                <Link href="/services-page">
                  <div className="bg-[#0C6E4E] hover:bg-opacity-90 text-white text-center px-8 py-4 rounded-md transition-colors font-medium cursor-pointer text-lg shadow-xl border border-[#0C6E4E]">
                    Our Services
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading text-[#0C6E4E] mb-6">Our Vision & Mission</h2>
            <p className="mb-4">Chairman Haji Ghulam Yasin, along with the founder, Khateeb, and Imam of Masjid Nabvi Qureshi Hashmi, Molana Abdul Ghaffar Qureshi, are inspired by the vision and mission of Masjid e Nabawi's model.</p>
            <p className="mb-4">Masajids should serve as capitals for their societies, just like countries have their own capitals. The purpose of Masjid Nabvi Qureshi Hashmi is to replicate the Riasat e Madina's model created by Prophet Muhammad (S.A.W).</p>
            <p className="mb-6">Muhammad Qureshi is on a mission to revolutionize the world's educational, political, and governance systems by connecting societies with their masajid. We are creating a platform with live-tracking, transparent accounts, and a democratic voting system to empower Muslims to improve their circumstances collectively.</p>
            <p className="mb-6">Our platform aims to introduce scientific educational games to stimulate interest in science and technology, addressing global challenges like climate change, inequality, and access to education and healthcare.</p>
            <div className="flex items-center space-x-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0zm-1 0a5 5 0 11-10 0 5 5 0 0110 0z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-xl font-medium text-[#0C6E4E]">Daily Prayers & Services</h3>
                <p>Open for all five daily prayers with qualified imams</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div>
                <h3 className="text-xl font-medium text-[#0C6E4E]">Islamic Education</h3>
                <p>Comprehensive Quranic and Islamic studies for all ages</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
              <div>
                <h3 className="text-xl font-medium text-[#0C6E4E]">AI-Powered Community Platform</h3>
                <p>Transparent, democratic system connecting Muslims worldwide</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-6">
              <div className="w-1/2">
                <div className="rounded-xl overflow-hidden shadow-xl h-64">
                  <img src={chairmanImage} alt="Chairman of Masjid Nabvi Qureshi Hashmi" className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#0C6E4E] text-white p-2 text-center rounded-b-xl">
                  <p className="text-sm font-semibold">Haji Ghulam Yasin</p>
                  <p className="text-xs">Chairman & Co-founder</p>
                </div>
              </div>
              
              <div className="w-1/2">
                <div className="rounded-xl overflow-hidden shadow-xl h-64">
                  <img src={masjidAdminImage} alt="Masjid Administration" className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#0C6E4E] text-white p-2 text-center rounded-b-xl">
                  <p className="text-sm font-semibold">Molana Abdul Ghaffar Qureshi</p>
                  <p className="text-xs">Founder & Imam</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img src={masjidPlanImage} alt="Masjid Nabvi Qureshi Hashmi plan view" className="w-full h-auto" />
              <div className="bg-[#D4AF37] text-black p-2 text-center">
                <p className="font-semibold">Masjid Nabvi Qureshi Hashmi Plan</p>
                <p className="text-xs">Under Construction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Philosophy */}
      <div className="bg-[#f8f8f8] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading text-center text-[#0C6E4E] mb-4">Our Philosophy & Platform</h2>
          <p className="text-center max-w-3xl mx-auto mb-8">Understanding the core philosophy of our masjid and how we plan to transform masajid for the modern era</p>
          
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden my-8">
            <div className="grid md:grid-cols-2">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-[#D4AF37] mb-4">Masjid Nabvi's Model in Modern Times</h3>
                <p className="mb-4">Our platform aims to translate the principles that made Masjid-e-Nabawi the center of society into a modern context through technology and community engagement.</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Democratic governance system with transparent accounting</li>
                  <li>Live-tracking of masjid activities and construction progress</li>
                  <li>Integration of education, spirituality, and social services</li>
                  <li>Scientific approach to Islamic education</li>
                  <li>Using AI to enhance community participation</li>
                </ul>
                <p className="italic text-gray-600">Our mission is to create a model that can be replicated by masajid worldwide.</p>
              </div>
              <div className="bg-gray-100">
                <img src={masjidPhilosophy} alt="Masjid Philosophy Diagram" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
          
          {/* Construction Plans & Legal Documentation */}
          <div className="mt-16 mb-8">
            <h2 className="text-3xl font-heading text-center text-[#0C6E4E] mb-4">Construction Plans & Documentation</h2>
            <p className="text-center max-w-3xl mx-auto mb-6">Our masjid construction is officially approved with all legal documentation in place</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img src={blueprintImage} alt="Masjid Blueprint" className="w-full h-full object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#0C6E4E]">Official Masjid Blueprint</h3>
                  <p className="text-sm text-gray-600">Approved architectural plans for Masjid Nabvi Qureshi Hashmi</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img src={constructionApprovalImage} alt="Construction Approval Document" className="w-full h-full object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#0C6E4E]">Construction Approval</h3>
                  <p className="text-sm text-gray-600">Official authorization for the building of Masjid Nabvi Qureshi Hashmi</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img src={bankAccountImage} alt="Bank Account Document" className="w-full h-full object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#0C6E4E]">Official Bank Account</h3>
                  <p className="text-sm text-gray-600">MCB Islamic Bank Account: PK53 MCIB 0541 0037 6590 0001</p>
                  <p className="text-sm font-bold text-[#D4AF37] mt-2">Account Number: 0541003765900001</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img src={constructionSiteImage} alt="Construction Site" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#0C6E4E]">Construction in Progress</h3>
                  <p className="text-sm text-gray-600">Current construction work being done on the masjid site</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img src={constructionPanoramaImage} alt="Construction Site Panorama" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#0C6E4E]">Construction Site Overview</h3>
                  <p className="text-sm text-gray-600">Panoramic view of the masjid construction area</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/donation-page">
                <div className="inline-block bg-[#D4AF37] hover:bg-opacity-90 text-white px-8 py-4 rounded-md transition-colors font-bold text-lg shadow-xl">
                  Donate for Construction
                </div>
              </Link>
              <p className="mt-4 text-gray-700 font-medium">Bank Account: 0541003765900001 (MCB Islamic Bank)</p>
            </div>
          </div>
          
          <div className="mt-16 mb-8">
            <h2 className="text-3xl font-heading text-center text-[#0C6E4E] mb-4">Our Beautiful Masjid</h2>
            <p className="text-center max-w-3xl mx-auto mb-12">Explore our masjid facilities and surroundings in Islamabad, where we are building a community center inspired by Masjid-e-Nabawi's model.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="h-64 overflow-hidden">
                <img src={masjidInteriorImage} alt="Masjid Interior" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-[#0C6E4E] mb-2">Prayer Hall Interior</h3>
                <p className="text-gray-600">Our spacious prayer hall accommodates the community for daily prayers and special events.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="h-64 overflow-hidden">
                <img src={masjidExteriorImage} alt="Masjid Exterior" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-[#0C6E4E] mb-2">Masjid Exterior</h3>
                <p className="text-gray-600">Our masjid features beautiful architecture and design reflecting Islamic traditions.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="h-64 overflow-hidden">
                <img src={masjidOutsideImage} alt="Masjid Building" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-[#0C6E4E] mb-2">Masjid Building</h3>
                <p className="text-gray-600">Our new masjid building is designed to accommodate the growing Muslim community in Islamabad.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/donation-page">
              <div className="inline-block bg-[#D4AF37] hover:bg-opacity-90 text-white px-8 py-4 rounded-md transition-colors font-medium mr-6 cursor-pointer text-lg shadow-xl">
                Support Construction
              </div>
            </Link>
            <Link href="/contact-page">
              <div className="inline-block bg-[#0C6E4E] hover:bg-opacity-90 text-white px-8 py-4 rounded-md transition-colors font-medium cursor-pointer text-lg shadow-xl">
                Visit Our Masjid
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
