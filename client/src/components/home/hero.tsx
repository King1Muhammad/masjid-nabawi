import { Link } from 'wouter';
import masjidPlanImage from "@assets/274956820_282699894003089_2825656189918966555_n.jpg";
import masjidAdminImage from "@assets/masjidnabviadministration.jpg";
import masjidEntryImage from "@assets/IMG_20230318_150311_747.jpg";
import masjidAreaImage from "@assets/IMG_20230318_151124_594.jpg";
import masjidGroundImage from "@assets/IMG_20230318_151137_544.jpg";
import masjidPhilosophy from "@assets/masjidphilosophy.jpg";
import masjidInteriorImage from "@assets/IMG_20230318_150311_747.jpg";
import masjidOutsideImage from "@assets/IMG_20230318_150712_252.jpg";
import masjidExteriorImage from "@assets/IMG_20230318_151014_122.jpg";
// Using the new hero image from public folder
const masjidHeroImage = "/images/new-masjid-hero.png";
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
      {/* Optimized Hero Section for mobile */}
      <div className="relative overflow-hidden flex flex-col">
        <div className="bg-white w-full">
          <div className="h-[55vh] md:h-[65vh] relative overflow-hidden bg-[#f4f4f4]">
            <img 
              src={masjidHeroImage} 
              alt="Masjid Nabvi Qureshi Hashmi"
              className="w-full h-full object-cover"
              loading="eager" 
            />
          </div>
        </div>
        
        {/* Reduced padding on mobile for better content density */}
        <div className="w-full bg-white py-5 md:py-10">
          <div className="mx-auto">
            <div className="max-w-4xl mx-auto px-3 md:px-8 text-center">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 md:mb-6">
                <span className="text-[#D4AF37]">Jamia Masjid Nabvi</span> 
                <span className="text-black"> Qureshi Hashmi</span>
              </h1>
              <p className="text-lg md:text-xl mb-3 md:mb-6 font-bold text-black">مسجد نبوی كے طرز پر سارے اعمال كا آغاز مسجد ھٰذا سے</p>
              <p className="text-lg md:text-xl mb-5 md:mb-8 text-[#0C6E4E] font-semibold">Based on Masjid-E-Nabawi's Model</p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-4 md:mt-6">
                <Link href="/donate">
                  <div className="bg-[#D4AF37] hover:bg-opacity-90 text-white text-center px-5 md:px-8 py-3 md:py-4 rounded-md transition-colors font-medium cursor-pointer text-base md:text-lg shadow-lg md:shadow-xl border border-[#D4AF37]">
                    Support Our Masjid
                  </div>
                </Link>
                <Link href="/services">
                  <div className="bg-[#0C6E4E] hover:bg-opacity-90 text-white text-center px-5 md:px-8 py-3 md:py-4 rounded-md transition-colors font-medium cursor-pointer text-base md:text-lg shadow-lg md:shadow-xl border border-[#0C6E4E]">
                    Our Services
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vision & Mission section with optimized spacing for mobile */}
      <div className="mx-auto px-3 md:px-4 py-8 md:py-16">
        <div className="relative rounded-xl overflow-hidden bg-[#F7F3E9] shadow-lg">
          <div className="absolute inset-0 opacity-10 z-0">
            <img src="@assets/masjid logo.png" alt="Masjid Logo Background" className="w-full h-full object-contain" loading="lazy" />
          </div>
          
          <div className="relative z-10 px-4 md:px-8 py-8 md:py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-6 md:mb-8">Our Vision & Mission</h2>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg mb-5 text-center font-medium">
                <span className="text-xl font-semibold text-[#D4AF37]">"مسجد نبوی كے طرز پر سارے اعمال كا آغاز مسجد ھٰذا سے"</span>
                <br />
                <span className="italic text-gray-600">Beginning all actions according to the model of Masjid-e-Nabawi from this masjid</span>
              </p>
              
              <p className="text-base md:text-lg mb-6">
                Chairman Haji Ghulam Yasin and Founder Molana Abdul Ghaffar Qureshi are driven by a profound vision: to revive the comprehensive role that Masjid-e-Nabawi played during the time of Prophet Muhammad ﷺ. Our mission extends beyond creating a prayer space—we aim to establish a complete societal framework where the masjid serves as the central institution for community development.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-10 text-left">
                <div className="bg-white/80 p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-medium text-[#0C6E4E] mb-4 border-b-2 border-[#D4AF37] pb-2">Our Vision</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold mt-1">•</span>
                      <span>To establish masajid as community capitals, serving as the central hub for spiritual, social, educational, and governance activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold mt-1">•</span>
                      <span>To create a replicable model of Islamic community governance that can be implemented worldwide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold mt-1">•</span>
                      <span>To revive the comprehensive role of masajid in community development and problem-solving</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold mt-1">•</span>
                      <span>To bridge traditional Islamic knowledge with modern technological advancements</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/80 p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-medium text-[#0C6E4E] mb-4 border-b-2 border-[#D4AF37] pb-2">Our Mission</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold mt-1">•</span>
                      <span>To develop a revolutionary community platform with live-tracking, transparent accounting, and democratic governance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold mt-1">•</span>
                      <span>To implement comprehensive educational programs combining Islamic traditions with scientific knowledge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold mt-1">•</span>
                      <span>To address global challenges through community-led initiatives and solutions based on Islamic principles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold mt-1">•</span>
                      <span>To create a self-sustaining community model that ensures economic prosperity and social welfare</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-10">
                <div className="bg-white/80 p-5 rounded-lg shadow-md text-center">
                  <div className="mx-auto bg-[#F7F3E9] w-14 h-14 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0zm-1 0a5 5 0 11-10 0 5 5 0 0110 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-[#0C6E4E]">Daily Prayers & Services</h3>
                  <p className="text-sm">Open for all five daily prayers with qualified imams</p>
                </div>
                
                <div className="bg-white/80 p-5 rounded-lg shadow-md text-center">
                  <div className="mx-auto bg-[#F7F3E9] w-14 h-14 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-[#0C6E4E]">Islamic Education</h3>
                  <p className="text-sm">Comprehensive Quranic and Islamic studies for all ages</p>
                </div>
                
                <div className="bg-white/80 p-5 rounded-lg shadow-md text-center">
                  <div className="mx-auto bg-[#F7F3E9] w-14 h-14 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-[#0C6E4E]">AI-Powered Platform</h3>
                  <p className="text-sm">Transparent, democratic system connecting Muslims worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Philosophy - Optimized for mobile */}
      <div className="bg-[#f8f8f8] py-8 md:py-16">
        <div className="mx-auto px-3 md:px-4">
          <h2 className="text-2xl md:text-3xl font-heading text-center text-[#0C6E4E] mb-3 md:mb-4">Our Philosophy & Platform</h2>
          <p className="text-center text-sm md:text-base max-w-3xl mx-auto mb-4 md:mb-8">Understanding the core philosophy of our masjid and how we plan to transform masajid for the modern era</p>
          
          <div className="bg-white rounded-xl shadow-xl md:shadow-2xl overflow-hidden my-4 md:my-8">
            <div className="flex flex-col">
              <div className="h-[300px] md:h-[450px] overflow-hidden bg-gray-50">
                <img 
                  src={masjidPhilosophy} 
                  alt="Masjid Philosophy Diagram" 
                  className="w-full h-full object-contain p-2 md:p-4"
                  loading="lazy" 
                />
              </div>
              <div className="p-4 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold text-[#D4AF37] mb-3 md:mb-4">Masjid Nabvi's Model in Modern Times</h3>
                <p className="text-sm md:text-base mb-3 md:mb-4">Our platform aims to translate the principles that made Masjid-e-Nabawi the center of society into a modern context through technology and community engagement.</p>
                <ul className="list-disc pl-5 space-y-1 md:space-y-2 mb-4 md:mb-6 text-sm md:text-base">
                  <li>Democratic governance system with transparent accounting</li>
                  <li>Live-tracking of masjid activities and construction progress</li>
                  <li>Integration of education, spirituality, and social services</li>
                  <li>Scientific approach to Islamic education</li>
                  <li>Using AI to enhance community participation</li>
                </ul>
                <p className="italic text-gray-600 text-sm md:text-base">Our mission is to create a model that can be replicated by masajid worldwide.</p>
              </div>
            </div>
          </div>
          
          {/* Construction Plans & Legal Documentation - Optimized for Mobile */}
          <div className="mt-8 md:mt-16 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-heading text-center text-[#0C6E4E] mb-3 md:mb-4">Construction Plans & Documentation</h2>
            <p className="text-center text-sm md:text-base max-w-3xl mx-auto mb-4 md:mb-6">Our masjid construction is officially approved with all legal documentation in place</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mt-6 md:mt-12">
              <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg">
                <div className="h-36 md:h-48 overflow-hidden">
                  <img 
                    src={blueprintImage} 
                    alt="Masjid Blueprint" 
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-semibold text-[#0C6E4E]">Official Masjid Blueprint</h3>
                  <p className="text-xs md:text-sm text-gray-600">Approved architectural plans for Masjid Nabvi Qureshi Hashmi</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg">
                <div className="h-36 md:h-48 overflow-hidden">
                  <img 
                    src={constructionApprovalImage} 
                    alt="Construction Approval Document" 
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-semibold text-[#0C6E4E]">Construction Approval</h3>
                  <p className="text-xs md:text-sm text-gray-600">Official authorization for the building of Masjid Nabvi Qureshi Hashmi</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg sm:col-span-2 lg:col-span-1">
                <div className="h-36 md:h-48 overflow-hidden">
                  <img 
                    src={bankAccountImage} 
                    alt="Bank Account Document" 
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-semibold text-[#0C6E4E]">Official Bank Account</h3>
                  <p className="text-xs md:text-sm text-gray-600">MCB Islamic Bank Account: PK53 MCIB 0541 0037 6590 0001</p>
                  <p className="text-xs md:text-sm font-bold text-[#D4AF37] mt-1 md:mt-2">Account Number: 0541003765900001</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 mt-3 md:mt-6">
              <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg">
                <div className="h-36 md:h-48 overflow-hidden">
                  <img 
                    src={constructionSiteImage} 
                    alt="Construction Site" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-semibold text-[#0C6E4E]">Construction in Progress</h3>
                  <p className="text-xs md:text-sm text-gray-600">Current construction work being done on the masjid site</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg">
                <div className="h-36 md:h-48 overflow-hidden">
                  <img 
                    src={constructionPanoramaImage} 
                    alt="Construction Site Panorama" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-semibold text-[#0C6E4E]">Construction Site Overview</h3>
                  <p className="text-xs md:text-sm text-gray-600">Panoramic view of the masjid construction area</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-8 text-center">
              <Link href="/donate">
                <div className="inline-block bg-[#D4AF37] hover:bg-opacity-90 text-white px-5 md:px-8 py-3 md:py-4 rounded-md transition-colors font-bold text-base md:text-lg shadow-md md:shadow-xl">
                  Donate for Construction
                </div>
              </Link>
              <p className="mt-3 md:mt-4 text-gray-700 font-medium text-sm md:text-base">Bank Account: 0541003765900001 (MCB Islamic Bank)</p>
            </div>
          </div>
          
          {/* Our Beautiful Masjid - Optimized for mobile */}
          <div className="mt-8 md:mt-16 mb-5 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-heading text-center text-[#0C6E4E] mb-3 md:mb-4">Our Beautiful Masjid</h2>
            <p className="text-center text-sm md:text-base max-w-3xl mx-auto mb-6 md:mb-12">Explore our masjid facilities and surroundings in Islamabad, where we are building a community center inspired by Masjid-e-Nabawi's model.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg transform transition-transform hover:scale-102 md:hover:scale-105">
              <div className="h-48 md:h-64 overflow-hidden">
                <img 
                  src={masjidInteriorImage} 
                  alt="Masjid Interior" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3 md:p-5">
                <h3 className="text-lg md:text-xl font-semibold text-[#0C6E4E] mb-1 md:mb-2">Prayer Hall Interior</h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">Our spacious prayer hall accommodates the community for daily prayers and special events.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg transform transition-transform hover:scale-102 md:hover:scale-105">
              <div className="h-48 md:h-64 overflow-hidden">
                <img 
                  src={masjidExteriorImage} 
                  alt="Masjid Exterior" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3 md:p-5">
                <h3 className="text-lg md:text-xl font-semibold text-[#0C6E4E] mb-1 md:mb-2">Masjid Exterior</h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">Our masjid features beautiful architecture and design reflecting Islamic traditions.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg transform transition-transform hover:scale-102 md:hover:scale-105 sm:col-span-2 md:col-span-1">
              <div className="h-48 md:h-64 overflow-hidden">
                <img 
                  src={masjidOutsideImage} 
                  alt="Masjid Building" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3 md:p-5">
                <h3 className="text-lg md:text-xl font-semibold text-[#0C6E4E] mb-1 md:mb-2">Masjid Building</h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">Our new masjid building is designed to accommodate the growing Muslim community in Islamabad.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 md:mt-12 text-center">
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <Link href="/donate">
                <div className="bg-[#D4AF37] hover:bg-opacity-90 text-white px-5 md:px-8 py-3 md:py-4 rounded-md transition-colors font-medium cursor-pointer text-base md:text-lg shadow-md md:shadow-xl">
                  Support Construction
                </div>
              </Link>
              <Link href="/contact">
                <div className="bg-[#0C6E4E] hover:bg-opacity-90 text-white px-5 md:px-8 py-3 md:py-4 rounded-md transition-colors font-medium cursor-pointer text-base md:text-lg shadow-md md:shadow-xl">
                  Visit Our Masjid
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
