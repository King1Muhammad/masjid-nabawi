import { Link } from 'wouter';
import masjidPlanImage from "@assets/274956820_282699894003089_2825656189918966555_n.jpg";
import masjidAdminImage from "@assets/masjidnabviadministration.jpg";
import masjidEntryImage from "@assets/IMG_20230318_150311_747.jpg";
import masjidAreaImage from "@assets/IMG_20230318_151124_594.jpg";
import masjidGroundImage from "@assets/IMG_20230318_151137_544.jpg";
import masjidNewImage from "@assets/WhatsApp Image 2024-06-29 at 19.33.33_a41e9b66.jpg";
import masjidInteriorImage from "@assets/IMG_20230318_150704_129.jpg";
import masjidOutsideImage from "@assets/IMG_20230318_150712_252.jpg";
import masjidExteriorImage from "@assets/IMG_20230318_151014_122.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative">
      <div className="h-[70vh] bg-cover bg-center relative" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8))", backgroundColor: "#000000"}}>
        <div className="absolute inset-0 flex justify-center items-center">
          <img src={masjidNewImage} alt="Masjid Nabvi Qureshi Hashmi" className="max-h-full max-w-full object-contain opacity-80" />
        </div>
        <div className="absolute inset-0 bg-[#000000] bg-opacity-30"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              <span className="text-[#D4AF37]">Jamia Masjid Nabvi</span> Qureshi Hashmi
            </h1>
            <p className="text-xl mb-4 font-bold">مسجد نبوی كے طرز پر سارے اعمال كا آغاز مسجد ھٰذا سے</p>
            <p className="text-lg mb-8">Building a masjid based on Masjid e Nabawi's model - transforming masajid for the AI era</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/donation-page">
                <div className="bg-[#D4AF37] hover:bg-opacity-90 text-white text-center px-6 py-3 rounded-md transition-colors font-medium cursor-pointer">
                  Support Our Masjid
                </div>
              </Link>
              <Link href="/services-page">
                <div className="border-2 border-white hover:bg-white hover:text-[#0C6E4E] text-center text-white px-6 py-3 rounded-md transition-colors font-medium cursor-pointer">
                  Our Services
                </div>
              </Link>
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
          <div className="grid grid-cols-1 gap-6">
            <div className="clip-path-dome overflow-hidden shadow-2xl" style={{clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)"}}>
              <img src={masjidPlanImage} alt="Masjid Nabvi Qureshi Hashmi plan view" className="w-full h-auto" />
              <div className="absolute bottom-0 left-0 right-0 bg-[#D4AF37] bg-opacity-80 text-black px-4 py-2 text-center text-sm font-bold">
                Masjid Nabvi Qureshi Hashmi Plan - Under Construction
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img src={masjidAdminImage} alt="Masjid Administration" className="w-full h-auto" />
              <div className="bg-[#0C6E4E] text-white p-3 text-center">
                Founder Molana Abdul Ghaffar Qureshi with Naib Imams and Administration
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Masjid Showcase */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading text-center text-[#0C6E4E] mb-4">Our Beautiful Masjid</h2>
          <p className="text-center max-w-3xl mx-auto mb-12">Explore our masjid facilities and surroundings in Islamabad, where we are building a community center inspired by Masjid-e-Nabawi's model.</p>
          
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

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="h-64 overflow-hidden">
                <img src={masjidEntryImage} alt="Masjid Entry" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-[#0C6E4E] mb-2">Masjid Entrance</h3>
                <p className="text-gray-600">The welcoming entrance to our masjid invites worshippers to enter and find peace.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="h-64 overflow-hidden">
                <img src={masjidAreaImage} alt="Masjid Area" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-[#0C6E4E] mb-2">Masjid Surroundings</h3>
                <p className="text-gray-600">Our masjid is surrounded by green spaces providing a peaceful environment for worship.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="h-64 overflow-hidden">
                <img src={masjidGroundImage} alt="Construction Site" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-[#0C6E4E] mb-2">Construction Progress</h3>
                <p className="text-gray-600">Witness the ongoing construction of our masjid as we build for future generations.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/donation-page">
              <div className="inline-block bg-[#D4AF37] hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors font-medium mr-4 cursor-pointer">
                Support Construction
              </div>
            </Link>
            <Link href="/contact-page">
              <div className="inline-block bg-[#0C6E4E] hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors font-medium cursor-pointer">
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
