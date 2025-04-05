import { useEffect } from 'react';
import { Link } from 'wouter';

// Import custom images
// Import images directly from public folder
const preIslamicImage = '/images/pre-islamic-arabia.webp';
import islamicCivilizationImage from '@assets/islamic-principles.webp';
import masjidConstructionImage from '@assets/IMG_20230124_151302_955.jpg';
import chairmanImage from '@assets/chairman.png';
import masjidBlueprint from '@assets/masjid_blueprint.jpg';
import constructionSiteImage from '@assets/construction_site.jpg';
import masjidHeroImage from '@assets/IMG_20230318_151014_122.jpg';
import masjidTeamImage from '@assets/IMG_20230318_150704_129.jpg';
import phase1Image from '@assets/IMG_20230318_150712_252.jpg';
// Import images directly from public folder
const phase2Image = '/images/global_platform.jpg';
import phase3Image from '@assets/IMG_20230318_151134_689.jpg';
import constructionApprovalImage from '@assets/construction_approval.jpg';
import masjidAdministrationImage from '@assets/masjidnabviadministration.jpg';
import masjidPhilosophyImage from '@assets/masjidphilosophy.jpg';
import bankAccountImage from '@assets/bank_account.jpg';

const VisionPage = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F7F3E9]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={masjidHeroImage} 
            alt="Masjid-e-Nabawi Model" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-center py-20">
          <h1 className="text-4xl md:text-6xl font-heading text-white mb-6">
            <span className="text-[#D4AF37]">Reviving Masjid-e-Nabawi's Model</span><br/>
            <span className="font-light">The Future of Humanity Begins Here!</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto">
            Join us in rebuilding the true purpose of masajids and creating an AI-driven, transparent system for a just and empowered world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <div className="bg-[#D4AF37] hover:bg-opacity-90 text-white text-center px-8 py-4 rounded-md transition-colors font-bold text-lg shadow-xl cursor-pointer">
                Donate Now
              </div>
            </Link>
            <Link href="/community">
              <div className="bg-[#0C6E4E] hover:bg-opacity-90 text-white text-center px-8 py-4 rounded-md transition-colors font-bold text-lg shadow-xl cursor-pointer">
                Join the Revolution
              </div>
            </Link>
            <Link href="/history">
              <div className="bg-white text-[#0C6E4E] hover:bg-opacity-90 text-center px-8 py-4 rounded-md transition-colors font-bold text-lg shadow-xl border border-[#0C6E4E] cursor-pointer">
                Learn More
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction to Islam & Role of Masajids */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] text-center mb-16">
            Islam & The Role of Masajids
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-heading text-[#D4AF37] mb-6">Before Islam</h3>
              <p className="mb-4 text-gray-800">In pre-Islamic Arabia, society was characterized by injustice, oppression, and lack of moral guidance. The Ka'bah in Makkah, originally built by Prophet Ibrahim (AS) as a house of worship for One God, had been filled with over 360 idols. Society was deeply divided by tribal affiliations and social hierarchy.</p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Polytheism dominated religious practices, with tribal leaders exploiting the pilgrimage for economic gain</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Female infanticide was common, usury exploited the poor, and strong tribal affiliations led to endless blood feuds</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>No organized educational system existed, with knowledge limited to tribal poetry and oral traditions</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Corrupt governance systems driven by wealth and power ensured the oppression of the poor and weak</p>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src={preIslamicImage} 
                alt="Before Islam - The state of pre-Islamic society" 
                className="w-full h-auto object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src={masjidPhilosophyImage} 
                alt="After Islam - Masjid-e-Nabawi Philosophy" 
                className="w-full h-auto object-cover rounded-xl shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-heading text-[#0C6E4E] mb-6">After Islam</h3>
              <p className="mb-4 text-gray-800">The advent of Islam through Prophet Muhammad ﷺ brought a revolutionary system that transformed society. Masjid-e-Nabawi in Madinah became the first comprehensive institution serving multiple functions - a place of worship, seat of governance, educational institution, social service center, and economic hub.</p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#0C6E4E] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>The constitution of Madinah created the first multicultural, multi-religious society with equal rights for all citizens</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#0C6E4E] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Masjid-e-Nabawi established an integrated system where spiritual development, education, governance, and economics operated in harmony</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#0C6E4E] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>The Islamic Golden Age introduced groundbreaking advances in science, medicine, mathematics, astronomy, and architecture</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#0C6E4E] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>All aspects of life were integrated into a cohesive system, with masajids serving as the center of community development</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-[#F7F3E9] rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-heading text-center text-[#0C6E4E] mb-6">Masajids in the Golden Era of Islam</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="w-12 h-12 rounded-full bg-[#0C6E4E] text-white flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">Education</h4>
                <p className="text-center">Free education for all (men & women), teaching various sciences, arts, and practical skills</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">Governance</h4>
                <p className="text-center">Center of administration, public decision-making, and transparent governance</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="w-12 h-12 rounded-full bg-[#0C6E4E] text-white flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">Justice</h4>
                <p className="text-center">Courts where justice was dispensed equally regardless of status or wealth</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">Social Welfare</h4>
                <p className="text-center">Providing for the needy, orphans, travelers, and the sick through Zakat and Sadaqah</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="w-12 h-12 rounded-full bg-[#0C6E4E] text-white flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">Economy</h4>
                <p className="text-center">Interest-free financial system and ethical business practices</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">Defense</h4>
                <p className="text-center">Organizing protection for the society and strategic planning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Decline of Muslims & How We Lost Our System */}
      <section className="py-16 bg-[#F7F3E9]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] text-center mb-16">
            The Decline of Muslims & How We Lost Our System
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-heading text-[#D4AF37] mb-6">Why Did the Muslim World Decline?</h3>
              <ul className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#D4AF37] text-white mr-4">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Departure from Islamic Values</h4>
                    <p className="text-gray-700">Muslims moved away from Islam's true teachings and integrated foreign practices.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#D4AF37] text-white mr-4">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Colonial Mental Enslavement</h4>
                    <p className="text-gray-700">British enslaved Muslims mentally through imposed education & employment systems.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#D4AF37] text-white mr-4">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Reduction of Masjid's Role</h4>
                    <p className="text-gray-700">Masajids lost their original comprehensive role and became limited to prayers only.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#D4AF37] text-white mr-4">
                    <span className="font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Continuation of Colonial Systems</h4>
                    <p className="text-gray-700">Despite independence in 1947, Pakistan continued the British governance system instead of reviving Islamic governance.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-heading text-[#0C6E4E] mb-6">Current Problems</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 flex-shrink-0 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#0C6E4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Corrupt Governance</h4>
                    <p className="text-gray-700">Lack of transparency, accountability, and public interest in decision-making.</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 flex-shrink-0 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#0C6E4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Economic Inequality</h4>
                    <p className="text-gray-700">Growing gap between rich and poor, exploitation through interest-based banking.</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 flex-shrink-0 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#0C6E4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Lack of Real Education</h4>
                    <p className="text-gray-700">Education focused only on degrees for jobs, not innovation or critical thinking.</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 flex-shrink-0 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#0C6E4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Brain Drain</h4>
                    <p className="text-gray-700">Youth leaving Pakistan due to broken systems and lack of opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0C6E4E] text-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-heading text-[#D4AF37] mb-4">It's Time for a Change</h3>
            <p className="text-lg mb-6">We must revive the original model of Islam that created the most successful civilization in history.</p>
            <div className="inline-block bg-[#D4AF37] text-white px-6 py-3 rounded-md font-bold">
              Join Our Movement
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision & Mission */}
      <section className="py-16 bg-white" id="vision">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] text-center mb-16">
            Our Vision & Mission – Reviving the Masjid-e-Nabawi Model
          </h2>
          
          <div className="mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <img 
                    src={constructionApprovalImage}
                    alt="Masjid Construction Approval"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <img 
                      src={masjidBlueprint}
                      alt="Masjid Blueprint"
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                    <img 
                      src={masjidConstructionImage}
                      alt="Masjid Construction Site"
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-heading text-[#D4AF37] mb-4">Our Masjid Construction</h3>
                  <p className="mb-4">We are currently constructing our masjid in Islamabad, opposite D-13 Block FGEHF G-11/4, which will serve as the center for our ambitious mission to revive the true model of Masjid-e-Nabawi. Construction is progressing with all official approvals in place.</p>
                  <p className="mb-4">Our masjid's design is inspired by the multifunctional role of Masjid-e-Nabawi, incorporating spaces for prayer, education, community services, and governance. The project has been approved by all relevant authorities.</p>
                  <p className="mb-4">With your support, we will complete this vital project that will serve as a model for future masajids worldwide.</p>
                  <Link href="/donate">
                    <div className="inline-block bg-[#0C6E4E] hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors cursor-pointer">
                      Support Our Construction
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-heading text-[#D4AF37] mb-6">About Jamia Masjid Nabvi Qureshi Hashmi</h3>
              <p className="mb-4">Located opposite D-13 Block FGEHF G-11/4 Islamabad, Pakistan, our masjid is built fully on volunteerism and dedicated to reviving the true model of Islamic governance and society as exemplified by Masjid-e-Nabawi.</p>
              <p className="mb-4">Founded by Molana Abdul Ghaffar Qureshi & Haji Ghulam Yasin, our mission continues under the leadership of Muhammad Qureshi, Ahmed Qureshi & Hamid Qureshi with support from a dedicated community.</p>
              <p className="mb-4">Our vision is to implement the statement: <strong>"مسجد نبوی كے طرز پر سارے اعمال كا آغاز مسجد ھٰذا سے"</strong> (Starting all actions based on Masjid-e-Nabawi's model from this masjid).</p>
              <p className="mb-6">We are building not just a physical structure, but a complete system to transform our community and ultimately, contribute to global revival.</p>
              <div className="flex items-center space-x-4">
                <img src={masjidAdministrationImage} alt="Masjid Administration" className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold">Our Administration</h4>
                  <p className="text-sm text-gray-600">A transparent and accountable leadership structure</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src={chairmanImage} 
                alt="Haji Ghulam Yasin, Chairman and Cofounder of Masjid Nabvi Qureshi Hashmi" 
                className="w-full h-auto rounded-xl shadow-xl mb-4"
              />
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="font-semibold text-center text-[#0C6E4E]">Haji Ghulam Yasin</h4>
                <p className="text-center text-sm text-gray-600">Chairman and Co-founder of Masjid Nabvi Qureshi Hashmi</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-2xl font-heading text-[#0C6E4E] text-center mb-8">Our Mission</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#F7F3E9] rounded-xl p-6 shadow-lg transform transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-[#0C6E4E] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">Restore Masajid's Role</h4>
                <p className="text-center">Revive masajids as centers of governance, knowledge, and social welfare</p>
              </div>
              <div className="bg-[#F7F3E9] rounded-xl p-6 shadow-lg transform transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-[#D4AF37] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">AI-Powered Transparency</h4>
                <p className="text-center">Implement self-governance through AI transparency & live tracking</p>
              </div>
              <div className="bg-[#F7F3E9] rounded-xl p-6 shadow-lg transform transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-[#0C6E4E] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">Global Platform</h4>
                <p className="text-center">Create a futuristic platform for economic, political, and social justice</p>
              </div>
              <div className="bg-[#F7F3E9] rounded-xl p-6 shadow-lg transform transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-[#D4AF37] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">Knowledge Revolution</h4>
                <p className="text-center">Build a knowledge-based society with Islamic & scientific education for all</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our AI-Driven Platform */}
      <section className="py-16 bg-[#F7F3E9]" id="platform">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] text-center mb-16">
            Our AI-Driven Platform – The Future of Governance & Economy
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-heading text-[#D4AF37] mb-6">What We Are Creating</h3>
              <p className="mb-6">We are developing a comprehensive digital platform that integrates multiple functions to create a complete ecosystem for community governance:</p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#0C6E4E] text-white mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">AI-driven Transparent Governance</h4>
                    <p className="text-gray-700">A voting & decision-making system where every member of the community has a voice.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#0C6E4E] text-white mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Blockchain-based Economy</h4>
                    <p className="text-gray-700">An interest-free financial system for fair and ethical economic activities.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#0C6E4E] text-white mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Comprehensive Education System</h4>
                    <p className="text-gray-700">Combining Islamic knowledge with modern science and practical skills.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#0C6E4E] text-white mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Community Marketplace</h4>
                    <p className="text-gray-700">A platform for ethical business and services within the community.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src={islamicCivilizationImage} 
                alt="AI Platform" 
                className="w-full h-auto rounded-xl shadow-xl"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-2xl font-heading text-[#0C6E4E] text-center mb-8">How It Will Solve Global Problems</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0C6E4E] rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Eliminating Corruption</h4>
                  <p>Transparency through blockchain and AI will make corruption impossible, as all transactions and decisions will be visible to everyone.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Direct Public Governance</h4>
                  <p>People make decisions collectively through AI voting, eliminating the problems of representative democracy and elite control.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0C6E4E] rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Fair Economic System</h4>
                  <p>No interest, no exploitation - a system that prevents wealth concentration and ensures equitable distribution of resources.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Knowledge Revolution</h4>
                  <p>Education focused on skills & innovation, not just degrees, creating problem-solvers and innovators.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 bg-white" id="roadmap">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] text-center mb-8">
            Roadmap – How We Will Achieve This Revolution
          </h2>
          
          <p className="text-center text-lg text-gray-700 max-w-4xl mx-auto mb-16">
            Reviving the Masjid-e-Nabawi model is a revolutionary journey that requires strategic planning and phased implementation. Our roadmap outlines precisely how we will transform both physical infrastructure and digital systems to create a comprehensive ecosystem for community development.
          </p>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#D4AF37]"></div>
            
            {/* Phase 1 */}
            <div className="relative z-10 mb-20">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                <div className="w-16 h-16 bg-[#0C6E4E] rounded-full border-4 border-[#D4AF37] flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="md:text-right md:pr-12">
                  <div className="bg-[#F7F3E9] p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-heading text-[#D4AF37] mb-5">Phase 1: Foundation & Infrastructure Development</h3>
                    <div className="space-y-4">
                      <div className="flex items-start md:justify-end gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1 md:order-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                          </svg>
                        </div>
                        <div className="text-left md:text-right md:order-1">
                          <h4 className="font-semibold text-[#0C6E4E]">Masjid Construction</h4>
                          <p className="text-gray-700">Complete main prayer hall with capacity for 500 worshippers, featuring sustainable design principles and energy efficiency. Estimated completion by December 2025.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start md:justify-end gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1 md:order-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="text-left md:text-right md:order-1">
                          <h4 className="font-semibold text-[#0C6E4E]">Educational Facilities</h4>
                          <p className="text-gray-700">Build classrooms for Quranic studies, advanced Islamic sciences, and modern STEM education for children, youth, and adults of all backgrounds.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start md:justify-end gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1 md:order-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="text-left md:text-right md:order-1">
                          <h4 className="font-semibold text-[#0C6E4E]">Community Building</h4>
                          <p className="text-gray-700">Establish core volunteer team of 50+ dedicated members, conduct weekly awareness programs about the revolutionary Masjid-e-Nabawi model and its applications today.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start md:justify-end gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1 md:order-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="text-left md:text-right md:order-1">
                          <h4 className="font-semibold text-[#0C6E4E]">Transparent Administration</h4>
                          <p className="text-gray-700">Create open governance structure with detailed financial reporting, community input systems, and democratic decision-making processes for masjid operations.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:pl-12">
                  <div className="bg-white p-2 rounded-xl shadow-lg">
                    <img 
                      src={constructionSiteImage} 
                      alt="Phase 1: Masjid Construction" 
                      className="rounded-lg w-full h-auto object-cover"
                    />
                    <div className="mt-4 bg-[#F7F3E9] p-4 rounded-lg">
                      <h4 className="font-semibold text-[#0C6E4E] mb-2">Key Milestones:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">✓</span>
                          <span>Land acquisition and construction permits secured</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">✓</span>
                          <span>Foundation work completed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">→</span>
                          <span>Main structure construction (60% complete)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">→</span>
                          <span>Interior work and utilities installation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Phase 2 */}
            <div className="relative z-10 mb-20">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                <div className="w-16 h-16 bg-[#0C6E4E] rounded-full border-4 border-[#D4AF37] flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="md:order-2 md:text-left md:pl-12">
                  <div className="bg-[#F7F3E9] p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-heading text-[#D4AF37] mb-5">Phase 2: Digital Transformation & Community Services</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#0C6E4E]">Integrated Digital Platform</h4>
                          <p className="text-gray-700">Develop a comprehensive mobile app and web platform connecting all masjid services, allowing for transparent financial tracking, community voting on initiatives, and real-time engagement.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#0C6E4E]">AI Governance System</h4>
                          <p className="text-gray-700">Implement AI-powered decision support systems that analyze community needs, manage resources efficiently, and ensure fair distribution of services while maintaining accountability.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#0C6E4E]">Economic Empowerment</h4>
                          <p className="text-gray-700">Launch interest-free microfinance programs for community members, provide business incubation services, and establish a transparent digital Zakat and Sadaqah collection and distribution system.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#0C6E4E]">Regional Implementation</h4>
                          <p className="text-gray-700">Extend the model to at least 5 additional masajids in Pakistan, demonstrating the scalability and effectiveness of the system with proven results and data-driven outcomes.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:order-1 md:pr-12">
                  <div className="bg-white p-2 rounded-xl shadow-lg">
                    <img 
                      src={phase2Image} 
                      alt="Phase 2: Global Platform" 
                      className="rounded-lg w-full h-auto object-cover"
                    />
                    <div className="mt-4 bg-[#F7F3E9] p-4 rounded-lg">
                      <h4 className="font-semibold text-[#0C6E4E] mb-2">Expected Timeline:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">2026 Q1-Q2:</span>
                          <span>Platform design and development</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">2026 Q3-Q4:</span>
                          <span>Beta testing and community feedback</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">2027 Q1-Q2:</span>
                          <span>Full implementation and expansion</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Phase 3 */}
            <div className="relative z-10">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                <div className="w-16 h-16 bg-[#0C6E4E] rounded-full border-4 border-[#D4AF37] flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="md:text-right md:pr-12">
                  <div className="bg-[#F7F3E9] p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-heading text-[#D4AF37] mb-5">Phase 3: Global Network & Unified System</h3>
                    <div className="space-y-4">
                      <div className="flex items-start md:justify-end gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1 md:order-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-left md:text-right md:order-1">
                          <h4 className="font-semibold text-[#0C6E4E]">Global Partnerships</h4>
                          <p className="text-gray-700">Establish strategic alliances with at least 100 masajids across 30+ countries, creating a unified network of institutions following the Masjid-e-Nabawi model with shared resources and knowledge.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start md:justify-end gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1 md:order-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div className="text-left md:text-right md:order-1">
                          <h4 className="font-semibold text-[#0C6E4E]">Decentralized Governance</h4>
                          <p className="text-gray-700">Implement a global, AI-enhanced governance framework that allows communities worldwide to participate in decision-making while maintaining local autonomy and cultural sensitivity.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start md:justify-end gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1 md:order-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <div className="text-left md:text-right md:order-1">
                          <h4 className="font-semibold text-[#0C6E4E]">Knowledge Integration</h4>
                          <p className="text-gray-700">Create a unified knowledge repository combining Islamic sciences with modern fields, providing accessible education to communities worldwide through multilingual platforms.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start md:justify-end gap-3">
                        <div className="bg-[#0C6E4E] text-white p-2 rounded-full flex-shrink-0 mt-1 md:order-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </div>
                        <div className="text-left md:text-right md:order-1">
                          <h4 className="font-semibold text-[#0C6E4E]">Economic Integration</h4>
                          <p className="text-gray-700">Establish an ethical global economic system connecting Muslim communities worldwide, enabling interest-free financing, fair trade networks, and sustainable business practices.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:pl-12">
                  <div className="bg-white p-2 rounded-xl shadow-lg">
                    <img 
                      src={masjidPhilosophyImage} 
                      alt="Phase 3: Global Network" 
                      className="rounded-lg w-full h-auto object-cover"
                    />
                    <div className="mt-4 bg-[#F7F3E9] p-4 rounded-lg">
                      <h4 className="font-semibold text-[#0C6E4E] mb-2">Vision for 2030:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">•</span>
                          <span>100+ masajids operating on unified system</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">•</span>
                          <span>10+ million users engaged globally</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">•</span>
                          <span>Comprehensive ethical economic system</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">•</span>
                          <span>AI-driven governance model established</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-20 max-w-3xl mx-auto">
            <div className="p-6 bg-[#0C6E4E] rounded-xl shadow-lg text-white">
              <h3 className="text-2xl font-heading text-[#D4AF37] mb-4">Join Our Revolutionary Journey</h3>
              <p className="mb-6">This roadmap outlines our step-by-step approach to reviving the comprehensive model of Masjid-e-Nabawi for the modern era. Each phase builds upon the previous one, creating a sustainable, scalable system that empowers communities worldwide.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/donate">
                  <div className="bg-[#D4AF37] hover:bg-opacity-90 text-white px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer">
                    Support the Vision
                  </div>
                </Link>
                <Link href="/contact">
                  <div className="bg-white text-[#0C6E4E] hover:bg-opacity-90 px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer">
                    Get Involved
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#0C6E4E] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-[#D4AF37] mb-8">
            Join Our Revolution Today
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-12">
            Be part of the movement to revive the true model of Masjid-e-Nabawi and transform our societies into just, prosperous, and knowledge-based communities.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white text-[#0C6E4E] rounded-xl p-6 shadow-lg transform transition-transform hover:scale-105">
              <div className="w-20 h-20 bg-[#D4AF37] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Donate</h3>
              <p className="mb-6">Support the construction of our masjid and the development of our AI platform.</p>
              <Link href="/donation-page">
                <a className="inline-block bg-[#0C6E4E] text-white px-6 py-2 rounded-md font-semibold">
                  Donate Now
                </a>
              </Link>
            </div>
            
            <div className="bg-white text-[#0C6E4E] rounded-xl p-6 shadow-lg transform transition-transform hover:scale-105">
              <div className="w-20 h-20 bg-[#D4AF37] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Volunteer</h3>
              <p className="mb-6">Join our team as a volunteer to contribute your skills and time to this noble cause.</p>
              <button className="inline-block bg-[#0C6E4E] text-white px-6 py-2 rounded-md font-semibold">
                Join as Volunteer
              </button>
            </div>
            
            <div className="bg-white text-[#0C6E4E] rounded-xl p-6 shadow-lg transform transition-transform hover:scale-105">
              <div className="w-20 h-20 bg-[#D4AF37] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Spread the Word</h3>
              <p className="mb-6">Help us share this vision with others and grow our community of supporters.</p>
              <button className="inline-block bg-[#0C6E4E] text-white px-6 py-2 rounded-md font-semibold">
                Share Our Mission
              </button>
            </div>
          </div>
          
          <div className="mt-16">
            <h3 className="text-2xl font-heading text-[#D4AF37] mb-6">Contact Us</h3>
            <p className="mb-4">📍 G-11/4, Islamabad, Pakistan</p>
            <p className="mb-4">📱 +92 333 921 4600</p>
            <p className="mb-8">📧 jamiamasjidnabviqureshihashmi@gmail.com</p>
            <div className="flex justify-center space-x-4">
              <div className="w-12 h-12 bg-white text-[#0C6E4E] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.001 2.002C6.47895 2.002 2.00195 6.479 2.00195 12.001C2.00195 16.991 5.65795 21.127 10.439 21.88V14.892H7.89895V12.001H10.439V9.798C10.439 7.29 11.932 5.907 14.215 5.907C15.309 5.907 16.455 6.102 16.455 6.102V8.561H15.191C13.951 8.561 13.563 9.333 13.563 10.124V11.999H16.334L15.891 14.89H13.563V21.878C18.344 21.129 22 16.992 22 12.001C22 6.479 17.523 2.002 12.001 2.002Z"></path>
                </svg>
              </div>
              <div className="w-12 h-12 bg-white text-[#0C6E4E] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.995 6.68799C20.8914 6.15208 21.5622 5.30823 21.882 4.31399C21.0397 4.81379 20.118 5.16587 19.157 5.35499C17.8246 3.94552 15.7135 3.60251 14.0034 4.51764C12.2933 5.43277 11.4075 7.37948 11.841 9.26999C8.39062 9.09676 5.17598 7.4669 2.99702 4.78599C1.85986 6.74741 2.44097 9.25477 4.32502 10.516C3.64373 10.4941 2.97754 10.3096 2.38202 9.97799C2.38202 9.99599 2.38202 10.014 2.38202 10.032C2.38241 12.0751 3.82239 13.8351 5.82502 14.24C5.19308 14.4119 4.53022 14.4372 3.88702 14.314C4.45022 16.0613 6.06057 17.2583 7.89602 17.294C6.37585 18.4871 4.49849 19.1342 2.56602 19.131C2.22349 19.1315 1.88123 19.1118 1.54102 19.072C3.50341 20.333 5.78739 21.0023 8.12002 21C11.3653 21.0223 14.484 19.7429 16.7787 17.448C19.0734 15.1531 20.3526 12.0342 20.33 8.78899C20.33 8.60299 20.3257 8.41799 20.317 8.23399C21.1575 7.62659 21.8828 6.87414 22.459 6.01199C21.676 6.35905 20.8455 6.58691 19.995 6.68799Z"></path>
                </svg>
              </div>
              <div className="w-12 h-12 bg-white text-[#0C6E4E] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38738C5.74016 4.55585 5.42709 4.75006 5.09352 5.09295C4.75348 5.43132 4.55585 5.74352 4.38738 6.17487C4.20094 6.6664 4.09461 7.18954 4.0578 7.97452C4.00655 9.12457 4 9.52703 4 12C4 14.4743 4.00655 14.8765 4.0578 16.0255C4.09461 16.8114 4.20007 17.3352 4.38738 17.8251C4.55585 18.2574 4.75006 18.5693 5.09295 18.9039C5.43132 19.2444 5.74352 19.4412 6.17487 19.6106C6.6664 19.7976 7.18954 19.9039 7.97452 19.9422C9.12457 19.9935 9.52703 20 12 20C14.4743 20 14.8765 19.9935 16.0255 19.9422C16.8114 19.9054 17.3352 19.7999 17.8251 19.6126C18.2574 19.4441 18.5693 19.2499 18.9039 18.907C19.2444 18.5687 19.4412 18.2565 19.6106 17.8251C19.7976 17.3336 19.9039 16.8105 19.9422 16.0255C19.9935 14.8754 20 14.473 20 12C20 9.52569 19.9935 9.12345 19.9422 7.97227C19.9054 7.18815 19.7999 6.66253 19.6126 6.17416C19.4441 5.74016 19.2499 5.42709 18.907 5.09352C18.5687 4.75348 18.2565 4.55585 17.8251 4.38738C17.3336 4.20094 16.8105 4.09461 16.0255 4.0578C14.8754 4.00655 14.473 4 12 4H12.001ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.94 7.8775C21.99 8.94417 22 9.28333 22 12C22 14.7167 21.99 15.0558 21.94 16.1225C21.8908 17.1867 21.7226 17.9133 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.99 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87764 21.94C6.81347 21.8908 6.08681 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12347 19.7658 2.78014 19.2067 2.52598 18.55C2.27848 17.9133 2.11098 17.1867 2.06098 16.1225C2.01098 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.08583 2.52598 5.45C2.78014 4.79167 3.12347 4.23417 3.67931 3.67833C4.23514 3.1225 4.79431 2.78 5.45098 2.525C6.08681 2.2775 6.81347 2.11 7.87764 2.06C8.94514 2.01 9.28431 2 12.001 2Z"></path>
                </svg>
              </div>
              <div className="w-12 h-12 bg-white text-[#0C6E4E] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.543 6.498C22 8.28 22 12 22 12C22 12 22 15.72 21.543 17.502C21.289 18.487 20.546 19.262 19.605 19.524C17.896 20 12 20 12 20C12 20 6.107 20 4.395 19.524C3.45 19.258 2.708 18.484 2.457 17.502C2 15.72 2 12 2 12C2 12 2 8.28 2.457 6.498C2.711 5.513 3.454 4.738 4.395 4.476C6.107 4 12 4 12 4C12 4 17.896 4 19.605 4.476C20.55 4.742 21.292 5.516 21.543 6.498ZM10 15.5L16 12L10 8.5V15.5Z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Selection and Newsletter */}
      <section className="py-8 bg-[#F7F3E9]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <select className="bg-white border border-[#0C6E4E] text-[#0C6E4E] rounded-md px-4 py-2">
                <option value="en">English</option>
                <option value="ur">اردو</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <p className="text-[#0C6E4E] font-semibold mr-4 mb-2 md:mb-0">Subscribe to our Newsletter:</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-md border border-[#0C6E4E] focus:outline-none" />
                <button className="bg-[#0C6E4E] text-white px-4 py-2 rounded-r-md">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionPage;