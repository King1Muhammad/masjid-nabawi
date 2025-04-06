import React, { useEffect } from 'react';
import { Link } from 'wouter';

// Import images - using relative paths
import bnbQRCode from '../assets/bnb ahmed wallet.jpg';
import trc20QRCode from '../assets/trc20 ahmed wallet.jpg';
import globalPlatformImage from '../assets/global platform.jpg';
import governanceImage from '../assets/masjidnabviadministration.jpg';
import communityPlatformImage from '../assets/masajid governance.jpg';
import educationImage from '../assets/masjid education.jpg';
import constructionImage from '../assets/construction_panorama.jpg';

const PlatformPage = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/platform-hero-bg.webp" 
            alt="Platform Vision" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#0C6E4E]/70"></div>
        </div>
        <div className="container mx-auto px-4 z-10 text-center py-20">
          <h1 className="text-4xl md:text-6xl font-heading text-white mb-6 text-shadow-lg">
            <span className="text-[#D4AF37]">The Future is Now:</span><br/>
            <span className="font-light">A Global AI-Based Governance & Banking Revolution</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto text-shadow-md">
            Transforming the world through transparent governance, decentralized banking, and AI-driven solutions inspired by Masjid-e-Nabawi's model
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <div className="bg-[#D4AF37] hover:bg-opacity-90 text-white text-center px-8 py-4 rounded-md transition-colors font-bold text-lg shadow-xl cursor-pointer">
                Support the Platform
              </div>
            </Link>
            <Link href="/community">
              <div className="bg-[#0C6E4E] hover:bg-opacity-90 text-white text-center px-8 py-4 rounded-md transition-colors font-bold text-lg shadow-xl cursor-pointer">
                Join the Movement
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-4">Current World Crisis</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">Our world faces unprecedented challenges that traditional systems are failing to address. These systemic problems require revolutionary solutions that completely reimagine how society operates.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:-translate-y-2">
              <div className="h-48 relative">
                <img src="https://source.unsplash.com/random/600x400/?corruption,politics" alt="Political Corruption" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0C6E4E] mb-3">Political Corruption</h3>
                <p className="text-gray-700 mb-3">Corrupt leaders and systems siphon resources meant for public welfare, while ordinary citizens suffer from lack of basic necessities.</p>
                <p className="text-gray-600 text-sm">The current political systems worldwide are plagued with corruption, nepotism, and lack of accountability. Public funds disappear into private accounts while infrastructure crumbles and social services deteriorate.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:-translate-y-2">
              <div className="h-48 relative">
                <img src="https://source.unsplash.com/random/600x400/?poverty,inequality" alt="Economic Inequality" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0C6E4E] mb-3">Economic Inequality</h3>
                <p className="text-gray-700 mb-3">The gap between rich and poor widens as centralized banking systems and currency manipulation benefit the elite few.</p>
                <p className="text-gray-600 text-sm">Interest-based banking systems ensure the rich get richer while the poor stay trapped in cycles of debt. Central banks print money at will, causing inflation that disproportionately harms those with limited resources.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:-translate-y-2">
              <div className="h-48 relative">
                <img src="https://source.unsplash.com/random/600x400/?bureaucracy,paperwork" alt="Bureaucratic Inefficiency" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0C6E4E] mb-3">Bureaucratic Inefficiency</h3>
                <p className="text-gray-700 mb-3">Slow, outdated governmental processes and lack of transparency create barriers to progress and foster distrust.</p>
                <p className="text-gray-600 text-sm">Modern governance systems are burdened by layers of bureaucracy that slow down decision-making and implementation. Citizens struggle to access basic services while facing complex procedures and endless paperwork.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:-translate-y-2">
              <div className="h-48 relative">
                <img src="https://source.unsplash.com/random/600x400/?inflation,economy" alt="Currency Manipulation" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0C6E4E] mb-3">Currency Manipulation</h3>
                <p className="text-gray-700 mb-3">Central banks and financial institutions control monetary policies that lead to inflation, devaluation, and economic instability.</p>
                <p className="text-gray-600 text-sm">Fiat currencies are increasingly unstable as governments print money without restraint, causing inflation that erodes savings and purchasing power. The financial elite can manipulate markets with minimal oversight.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-[#0C6E4E] mb-4 text-center">The Need for Revolutionary Change</h3>
            <p className="text-gray-700 mb-4">
              These aren't isolated problems—they're symptoms of deeply flawed systems that require fundamental reimagining. Incremental changes and surface-level reforms have repeatedly failed to address the root causes of these issues.
            </p>
            <p className="text-gray-700">
              Our platform takes inspiration from history's most successful governance model—Masjid-e-Nabawi's integrated approach—and combines it with cutting-edge AI technology to create a comprehensive solution that addresses all these challenges simultaneously.
            </p>
          </div>
        </div>
      </section>

      {/* AI Era Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-4">The AI Revolution</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">Artificial Intelligence is reshaping our world at unprecedented speed, creating both opportunities and challenges</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">The Dawn of a New Era</h3>
              <p className="mb-4 text-gray-700">We are witnessing the most transformative technological revolution in human history. Artificial Intelligence is not just changing how we work—it's fundamentally altering the structure of society itself.</p>
              <p className="mb-4 text-gray-700">From automated decision-making to predictive governance, AI technologies are already being deployed by governments and corporations worldwide. The pressing question is: will these powerful tools centralize power further, or can they be harnessed to create more equitable, transparent systems?</p>
              <p className="text-gray-700 mb-4">The choice we face is clear: allow AI to become a tool of further control and inequality, or proactively design AI systems that distribute power, increase transparency, and serve humanity's collective interests.</p>
              <p className="text-gray-700">Our platform aims to put AI in service of communities rather than corporations, ensuring that this revolutionary technology benefits all of humanity, not just the select few who control it.</p>
            </div>
            <div className="bg-white h-auto rounded-lg shadow-xl overflow-hidden">
              <div className="p-8 bg-gradient-to-br from-[#0C6E4E]/10 to-[#D4AF37]/10">
                <h4 className="text-xl font-bold text-[#0C6E4E] mb-4">Key AI Applications in Our Platform</h4>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white mr-3">
                      <i className="fas fa-robot text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold">Transparent Decision Making</p>
                      <p className="text-gray-600 text-sm">AI-powered voting systems with built-in checks against manipulation and bias</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white mr-3">
                      <i className="fas fa-university text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold">Ethical Resource Distribution</p>
                      <p className="text-gray-600 text-sm">Algorithms that ensure fair allocation of community resources based on need</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white mr-3">
                      <i className="fas fa-brain text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold">Personalized Education</p>
                      <p className="text-gray-600 text-sm">Learning systems that adapt to individual needs while preserving community values</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white mr-3">
                      <i className="fas fa-shield-alt text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold">Decentralized Security</p>
                      <p className="text-gray-600 text-sm">Community-owned security systems that protect without surveillance overreach</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#0C6E4E] text-white p-8 rounded-lg text-center shadow-lg">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">70%</div>
              <p>of jobs will be transformed by AI in the next decade</p>
              <p className="text-sm mt-3 text-white/80">Our platform provides communities with the tools to adapt and thrive in this new landscape</p>
            </div>
            <div className="bg-[#0C6E4E] text-white p-8 rounded-lg text-center shadow-lg">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">$15.7T</div>
              <p>potential contribution to the global economy by 2030</p>
              <p className="text-sm mt-3 text-white/80">We ensure this wealth creation benefits communities, not just corporate shareholders</p>
            </div>
            <div className="bg-[#0C6E4E] text-white p-8 rounded-lg text-center shadow-lg">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">90%</div>
              <p>of developing nations at risk of being left behind</p>
              <p className="text-sm mt-3 text-white/80">Our platform democratizes access to AI, ensuring technological benefits reach all communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-[#0C6E4E] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-white mb-4">Our Revolutionary Solution</h2>
            <p className="text-lg max-w-3xl mx-auto">A comprehensive AI-driven platform inspired by the integrated model of Masjid-e-Nabawi</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-8 rounded-lg text-center transform transition-transform hover:-translate-y-2">
              <div className="text-4xl text-[#D4AF37] mb-4">
                <i className="fas fa-balance-scale"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Decentralized Governance</h3>
              <p>Community-driven decision making with transparent voting mechanisms and accountability at all levels</p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-lg text-center transform transition-transform hover:-translate-y-2">
              <div className="text-4xl text-[#D4AF37] mb-4">
                <i className="fas fa-landmark"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Alternative Banking</h3>
              <p>Interest-free microfinance, community-held assets, and blockchain-based transparent financial systems</p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-lg text-center transform transition-transform hover:-translate-y-2">
              <div className="text-4xl text-[#D4AF37] mb-4">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Integrated Education</h3>
              <p>Holistic education combining spiritual values with modern sciences, programming, and practical skills</p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-lg text-center transform transition-transform hover:-translate-y-2">
              <div className="text-4xl text-[#D4AF37] mb-4">
                <i className="fas fa-network-wired"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Powered Infrastructure</h3>
              <p>Utilizing artificial intelligence for fair resource distribution, urban planning, and community development</p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-lg text-center transform transition-transform hover:-translate-y-2">
              <div className="text-4xl text-[#D4AF37] mb-4">
                <i className="fas fa-hands-helping"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Social Support System</h3>
              <p>Comprehensive welfare programs ensuring no community member falls through the cracks</p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-lg text-center transform transition-transform hover:-translate-y-2">
              <div className="text-4xl text-[#D4AF37] mb-4">
                <i className="fas fa-globe-asia"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Global Scaling Model</h3>
              <p>Framework for implementing our system across communities worldwide, adaptable to local contexts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-4">Global Impact</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">Our vision extends beyond a single community to transform societies worldwide through a proven model of governance and social harmony</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="h-auto rounded-lg overflow-hidden shadow-xl">
              <img src={globalPlatformImage} alt="Global Platform Vision" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Creating a Better World</h3>
              <p className="mb-4 text-gray-700">Our platform doesn't just address symptoms but tackles the root causes of societal problems. By combining the timeless wisdom of Islam's golden era with cutting-edge technology, we're creating a system that works for everyone, not just the privileged few.</p>
              <p className="mb-6 text-gray-700">This isn't merely a theoretical concept—it's a proven model based on the governance system of Masjid-e-Nabawi, which successfully integrated religious practice, education, governance, social welfare, and economic activity into a unified system that created the most advanced and just civilization of its time.</p>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white mr-4">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Economic Justice</p>
                    <p className="text-gray-600 mb-2">Eliminating interest-based systems that perpetuate poverty and inequality</p>
                    <p className="text-gray-500 text-sm">Our platform introduces community-controlled financial systems that distribute wealth fairly, prevent exploitation, and ensure basic needs are met for all members.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white mr-4">
                    <i className="fas fa-balance-scale"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Transparent Governance</p>
                    <p className="text-gray-600 mb-2">Ending corruption through blockchain-verified transparent systems</p>
                    <p className="text-gray-500 text-sm">Every decision, transaction, and resource allocation is recorded immutably and visible to all community members, completely eliminating the possibility of corruption.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white mr-4">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Educational Revolution</p>
                    <p className="text-gray-600 mb-2">Providing access to quality, holistic education to all community members</p>
                    <p className="text-gray-500 text-sm">Our education system integrates spiritual development with practical skills, technological literacy, and critical thinking, preparing individuals to thrive in the modern world while maintaining their values.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-gray-50 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-[#0C6E4E] mb-6 text-center">Real-World Implementation</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-full h-48 bg-gray-100 rounded-md mb-4 overflow-hidden">
                  <img src={governanceImage} alt="Governance System" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-lg font-bold text-[#0C6E4E] mb-2">Governance Implementation</h4>
                <p className="text-gray-700">Our prototype community governance system is already functioning in our local mosque community, with transparent decision-making and resource allocation.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-full h-48 bg-gray-100 rounded-md mb-4 overflow-hidden">
                  <img src={communityPlatformImage} alt="Community Platform" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-lg font-bold text-[#0C6E4E] mb-2">Society Housing Platform</h4>
                <p className="text-gray-700">Our 176-flat society has implemented a transparent system for monthly contributions, expenses tracking, and community decision-making.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-full h-48 bg-gray-100 rounded-md mb-4 overflow-hidden">
                  <img src={educationImage} alt="Education System" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-lg font-bold text-[#0C6E4E] mb-2">Education Integration</h4>
                <p className="text-gray-700">Our madrasa combines traditional Islamic education with modern sciences, programming, and practical skills for holistic development.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-4">Join the Movement</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">Be part of the solution and help us create a better future for all humanity</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl text-[#0C6E4E] mb-4">
                <i className="fas fa-hands-helping"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-4">Volunteer</h3>
              <p className="text-gray-700 mb-6">Contribute your skills, time, and expertise to help build our platform and community initiatives</p>
              <Link href="/contact">
                <div className="inline-block bg-[#0C6E4E] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors">
                  Get Involved
                </div>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl text-[#0C6E4E] mb-4">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-4">Donate</h3>
              <p className="text-gray-700 mb-6">Support our mission financially to help us build infrastructure, develop technology, and expand our impact</p>
              <Link href="/donate">
                <div className="inline-block bg-[#D4AF37] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors">
                  Contribute Now
                </div>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl text-[#0C6E4E] mb-4">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-4">Partner</h3>
              <p className="text-gray-700 mb-6">Join forces with us as an organization, business, or community leader to amplify our collective impact</p>
              <Link href="/contact">
                <div className="inline-block bg-[#0C6E4E] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors">
                  Discuss Partnership
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-4">Support Our Mission</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">Your contribution will help us build the infrastructure for a more just and equitable future</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-4">Bank Transfer (Pakistan)</h3>
              <div className="mb-4">
                <p className="font-semibold mb-1">Account Title:</p>
                <p>Muhammad Qureshi</p>
              </div>
              <div className="mb-4">
                <p className="font-semibold mb-1">JS Bank Limited:</p>
                <p className="font-mono bg-white p-2 rounded text-sm">0133-79543-01</p>
              </div>
              <div className="mb-4">
                <p className="font-semibold mb-1">IBAN:</p>
                <p className="font-mono bg-white p-2 rounded text-sm">PK56JSBL9005000133795401</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mt-4">* Both Pakistani Rupee and US Dollar transactions are supported</p>
                <p className="text-sm text-gray-600 mt-1">* For international transfers, use the IBAN number</p>
              </div>
            </div>
            
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-4">Mobile Wallets (Pakistan)</h3>
              <div className="mb-4">
                <p className="font-semibold mb-1">EasyPaisa:</p>
                <p className="font-mono bg-white p-2 rounded">03468053268</p>
              </div>
              <div className="mb-4">
                <p className="font-semibold mb-1">JazzCash:</p>
                <p className="font-mono bg-white p-2 rounded">03468053268</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Account Title:</p>
                <p>Muhammad Qureshi</p>
                <p className="text-sm text-gray-600 mt-3">* Instant transfers available 24/7</p>
              </div>
            </div>
            
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-4">Cryptocurrency</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold mb-1">TRC20 USDT:</p>
                  <p className="font-mono bg-white p-2 rounded text-sm break-all">TAYc66GdUqufsWcAHXxS6qgXRW2w73179f</p>
                  <div className="mt-2 flex justify-center">
                    <img src={trc20QRCode} alt="TRC20 USDT QR Code" className="w-24 h-24 object-cover border border-gray-300" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1">BNB:</p>
                  <p className="font-mono bg-white p-2 rounded text-sm break-all">0xd4f5912e37aa51402849acd7d9d4e7e9d94eb458</p>
                  <div className="mt-2 flex justify-center">
                    <img src={bnbQRCode} alt="BNB Wallet QR Code" className="w-24 h-24 object-cover border border-gray-300" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mt-2">* For other cryptocurrency options, please contact us</p>
                <p className="text-sm text-gray-600 mt-1">* Always verify wallet addresses before sending funds</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/donate">
              <div className="inline-block bg-[#D4AF37] text-white px-8 py-4 rounded-md hover:bg-opacity-90 transition-colors font-bold text-lg">
                Donate Through Our Platform
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Ready to Help Build the Future?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join us in creating a world where technology serves humanity, not the other way around</p>
          <Link href="/contact">
            <div className="inline-block bg-[#D4AF37] text-black px-8 py-4 rounded-md hover:bg-opacity-90 transition-colors font-bold text-lg">
              Get in Touch
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PlatformPage;