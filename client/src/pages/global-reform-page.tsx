import { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

// Import images
import globalPlatformImage from "@/assets/global_platform.jpg";

// Components
import MainLayout from '@/components/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TimelineItem = ({ year, title, description }: { year: string, title: string, description: string }) => (
  <div className="relative pl-8 pb-8 border-l border-gray-300 dark:border-gray-700">
    <div className="absolute w-4 h-4 bg-[#0C6E4E] rounded-full -left-2 mt-1"></div>
    <div className="text-lg font-bold text-[#0C6E4E]">{year}</div>
    <div className="font-heading text-xl mb-2">{title}</div>
    <p className="text-gray-700 dark:text-gray-300">{description}</p>
  </div>
);

const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) => (
  <Card className="h-full">
    <CardContent className="p-6">
      <div className="mb-4 text-[#0C6E4E]">
        {icon}
      </div>
      <h3 className="text-xl font-heading mb-2">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </CardContent>
  </Card>
);

const ComparisonItem = ({ old, new: newSystem }: { old: string, new: string }) => (
  <div className="grid grid-cols-2 gap-4 mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
      <div className="text-red-700 dark:text-red-400 font-medium">Old System</div>
      <p className="mt-1 text-gray-700 dark:text-gray-300">{old}</p>
    </div>
    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
      <div className="text-green-700 dark:text-green-400 font-medium">New System</div>
      <p className="mt-1 text-gray-700 dark:text-gray-300">{newSystem}</p>
    </div>
  </div>
);

// Icons
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
  </svg>
);

const BlockchainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const VoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const AiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a8 8 0 0 0-8 8v12l6-3 6 3V10a8 8 0 0 0-6-8z" />
  </svg>
);

const UnityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="8" />
    <line x1="12" y1="16" x2="12" y2="22" />
    <line x1="2" y1="12" x2="8" y2="12" />
    <line x1="16" y1="12" x2="22" y2="12" />
  </svg>
);

const GameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M9 8h.01" />
    <path d="M15 8h.01" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </svg>
);

export default function GlobalReformPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <Helmet>
        <title>The Broken System & The New Future | Jamia Masjid Nabvi Qureshi Hashmi</title>
        <meta name="description" content="Learn about the urgent need for global governance reform and our AI-powered decentralized platform solution for a transparent, equitable future." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-r from-[#0C6E4E] to-[#0C9A6E] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              The Broken System & The New Future
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              A global movement to revolutionize governance, economics, and society through transparent, decentralized, AI-powered solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-[#0C6E4E] hover:bg-gray-100 transition-all">
                Learn More
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 transition-all">
                Join Our Mission
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Introduction Section */}
      <section className="py-16 md:py-24 bg-[#F7F3E9]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-[#0C6E4E]">
                The Collapse of Trust in the Old System
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Our world faces unprecedented challenges: growing inequality, environmental crises, democratic decline, and technological disruption. The existing systems of governance and economics are failing to address these issues effectively.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-[#0C6E4E]">
                  Why Change is Urgently Needed
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white">
                      1
                    </div>
                    <div>
                      <strong className="font-medium">Global Financial Crisis:</strong> Centralized banking systems have repeatedly failed, leading to economic instability and inequality.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white">
                      2
                    </div>
                    <div>
                      <strong className="font-medium">Lack of Transparency:</strong> Corruption and mismanagement flourish in opaque governance structures.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white">
                      3
                    </div>
                    <div>
                      <strong className="font-medium">Centralized Power:</strong> Decision-making concentrated in the hands of a few leads to policies that don't represent the majority.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0C6E4E] flex items-center justify-center text-white">
                      4
                    </div>
                    <div>
                      <strong className="font-medium">Disconnected Communities:</strong> People feel increasingly isolated from their social institutions and local governance.
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-heading font-bold mb-4 text-[#0C6E4E]">Key Global Facts</h3>
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <div className="text-3xl font-bold text-[#D4AF37]">71%</div>
                    <div className="text-gray-700">of global wealth is controlled by just 10% of the population</div>
                  </div>
                  <div className="border-b pb-3">
                    <div className="text-3xl font-bold text-[#D4AF37]">$2T+</div>
                    <div className="text-gray-700">estimated annual cost of corruption globally</div>
                  </div>
                  <div className="border-b pb-3">
                    <div className="text-3xl font-bold text-[#D4AF37]">57%</div>
                    <div className="text-gray-700">of people believe their government doesn't act in their interest</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#D4AF37]">2.5B</div>
                    <div className="text-gray-700">people worldwide lack access to basic financial services</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-[#0C6E4E]">
                How Did We Get Here? A Timeline of Global Governance Evolution
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Understanding our past helps us chart a better future. Explore the key moments that shaped our current systems.
              </p>
            </div>
            
            <div className="mt-12">
              <TimelineItem 
                year="1648" 
                title="The Westphalian System" 
                description="Birth of the modern nation-state system, establishing territorial sovereignty as the foundation of international relations."
              />
              <TimelineItem 
                year="1776-1789" 
                title="Democratic Revolutions" 
                description="American and French revolutions established early democratic governance, but with limited suffrage and representation."
              />
              <TimelineItem 
                year="1944" 
                title="Bretton Woods Agreement" 
                description="Established the post-WWII international monetary system with fixed exchange rates and the creation of the IMF and World Bank."
              />
              <TimelineItem 
                year="1971" 
                title="End of the Gold Standard" 
                description="The US abandoned the gold standard, moving to a fiat currency system that increased central banks' control over monetary policy."
              />
              <TimelineItem 
                year="1989-1991" 
                title="End of Cold War" 
                description="The fall of Soviet Union led to rapid spread of market capitalism and liberal democracy as dominant global systems."
              />
              <TimelineItem 
                year="2008" 
                title="Global Financial Crisis" 
                description="Revealed fundamental flaws in financial regulation and the risks of centralized banking systems."
              />
              <TimelineItem 
                year="2009" 
                title="Birth of Bitcoin" 
                description="Introduction of blockchain technology and cryptocurrencies offering an alternative to centralized banking."
              />
              <TimelineItem 
                year="2020-Present" 
                title="Converging Crises" 
                description="Pandemic, climate emergencies, and geopolitical tensions exposed weaknesses in global governance and cooperation."
              />
              <TimelineItem 
                year="Today" 
                title="Technological Revolution" 
                description="AI, blockchain, and decentralized technologies create unprecedented opportunities for systemic transformation."
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Comparison Section */}
      <section className="py-16 md:py-24 bg-[#F7F3E9]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-[#0C6E4E]">
                Old System vs New System
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Compare the failing structures of the past with our vision for a transparent, decentralized future.
              </p>
            </div>
            
            <div className="mt-8 space-y-2">
              <ComparisonItem 
                old="Centralized governance controlled by political elites" 
                new="Decentralized direct democracy with transparent decision-making"
              />
              <ComparisonItem 
                old="Opaque financial systems prone to corruption and manipulation" 
                new="Transparent blockchain-based transactions visible to all stakeholders"
              />
              <ComparisonItem 
                old="Slow, bureaucratic processes resistant to innovation" 
                new="AI-powered efficiency with real-time adaptation to community needs"
              />
              <ComparisonItem 
                old="Disconnected citizens with limited input on decisions" 
                new="Engaged community members with direct voting and participation rights"
              />
              <ComparisonItem 
                old="Profit-driven economic models that increase inequality" 
                new="Community-centered development prioritizing wellbeing and sustainability"
              />
              <ComparisonItem 
                old="Siloed institutions unable to address complex global challenges" 
                new="Integrated platform connecting all aspects of community function"
              />
              <ComparisonItem 
                old="Manual, error-prone record keeping and accounting" 
                new="Automated, tamper-proof blockchain ledgers for perfect accountability"
              />
              <ComparisonItem 
                old="Reactive governance that addresses problems after they emerge" 
                new="Proactive AI-based systems that anticipate and prevent issues"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Platform Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-[#0C6E4E]">
                Introducing the One-Platform That Can Unify & Empower Humanity
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Our innovative platform integrates cutting-edge technologies with community-centered design to create a complete ecosystem for governance, commerce, and social connection.
              </p>
            </div>
            
            <div className="mb-16 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={globalPlatformImage} 
                alt="Global Platform Vision" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                title="Live Transparency Tracking" 
                description="Real-time monitoring of all financial transactions and governance decisions, accessible to every community member."
                icon={<ChartIcon />}
              />
              <FeatureCard 
                title="Blockchain-Based Banking" 
                description="Secure, fast, and transparent financial transactions with minimal fees and maximum accountability."
                icon={<BlockchainIcon />}
              />
              <FeatureCard 
                title="Decentralized Voting System" 
                description="Direct democracy through secure blockchain voting on all community decisions and resource allocations."
                icon={<VoteIcon />}
              />
              <FeatureCard 
                title="AI-Powered Automation" 
                description="Smart systems that reduce bureaucracy, optimize resource allocation, and ensure efficient governance."
                icon={<AiIcon />}
              />
              <FeatureCard 
                title="Community-Centered Design" 
                description="Platform that connects members to their society's center (Masjid, Church, Mandir, etc.) for spiritual and social cohesion."
                icon={<UnityIcon />}
              />
              <FeatureCard 
                title="Real-World AI Games" 
                description="Gamified problem-solving that addresses actual community challenges while building skills and engagement."
                icon={<GameIcon />}
              />
            </div>
            
            <div className="mt-16">
              <Tabs defaultValue="governance">
                <div className="flex justify-center mb-8">
                  <TabsList>
                    <TabsTrigger value="governance">Governance</TabsTrigger>
                    <TabsTrigger value="economy">Economy</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="governance" className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-[#0C6E4E]">Transparent Governance System</h3>
                  <p className="mb-4">Our platform revolutionizes community governance through complete transparency, direct participation, and AI-assisted decision-making.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Real-time tracking of all administrative actions and financial decisions</li>
                    <li>Secure blockchain voting on all significant community matters</li>
                    <li>Decentralized leadership structures that prevent power concentration</li>
                    <li>AI-powered analysis of policy impacts before implementation</li>
                    <li>Automated execution of community-approved decisions</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="economy" className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-[#0C6E4E]">Economic Empowerment</h3>
                  <p className="mb-4">Our economic systems prioritize community wealth, fair distribution, and sustainable development through innovative financial technologies.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Blockchain-based banking with minimal fees and maximum security</li>
                    <li>Community investment pools for local business development</li>
                    <li>Transparent budget allocation visible to all members</li>
                    <li>Cryptocurrency integration for global transactions and investments</li>
                    <li>AI-optimized resource distribution based on community needs</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="social" className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-[#0C6E4E]">Social Connectivity</h3>
                  <p className="mb-4">Our platform strengthens community bonds by connecting people to their social and spiritual centers while facilitating meaningful interactions.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Integrated social networks centered around community institutions</li>
                    <li>Service marketplaces for local skills and business exchange</li>
                    <li>Volunteer coordination systems for community support</li>
                    <li>Event planning and coordination tools for gatherings</li>
                    <li>Crisis response networks for emergency community support</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="education" className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-[#0C6E4E]">Education Systems</h3>
                  <p className="mb-4">Our education component combines traditional wisdom with cutting-edge technology to create accessible, engaging learning for all ages.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>AI-personalized learning paths for all community members</li>
                    <li>Skill-sharing platforms connecting teachers and students</li>
                    <li>Blockchain-verified credentials and certifications</li>
                    <li>Interactive learning through gamification and real-world challenges</li>
                    <li>Preservation and teaching of cultural and spiritual knowledge</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why It Matters Section */}
      <section className="py-16 md:py-24 bg-[#0C6E4E] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Why This Mission Matters to Every Human on Earth
              </h2>
              <p className="text-lg max-w-3xl mx-auto">
                Our platform isn't just about technological innovation—it's about addressing the fundamental challenges facing humanity and creating a more just, equitable world for all.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                <h3 className="text-2xl font-heading font-bold mb-6">Global Impact</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0C6E4E] font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="font-medium">Economic Equality:</strong> Reducing wealth gaps through transparent, equitable resource allocation.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0C6E4E] font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="font-medium">Environmental Stewardship:</strong> Community-led decision making that prioritizes sustainability.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0C6E4E] font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="font-medium">Conflict Reduction:</strong> Transparent governance that reduces corruption and the root causes of discord.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0C6E4E] font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="font-medium">Technological Inclusivity:</strong> Ensuring advanced technologies benefit all of humanity, not just the privileged.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                <h3 className="text-2xl font-heading font-bold mb-6">Individual Benefits</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0C6E4E] font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="font-medium">True Agency:</strong> Direct influence over the decisions that affect your life and community.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0C6E4E] font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="font-medium">Financial Empowerment:</strong> Access to fair, transparent financial systems without exploitative middlemen.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0C6E4E] font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="font-medium">Community Connection:</strong> Stronger bonds with neighbors and local institutions in an increasingly isolated world.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0C6E4E] font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="font-medium">Personal Growth:</strong> Continuous learning and skill development through integrated education systems.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-[#F7F3E9]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-[#0C6E4E]">
                Support the Revolution: Let's Build the Future Together
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                This transformation requires the engagement of passionate individuals and organizations. Join us in creating a more just, transparent, and sustainable world.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-all">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0C6E4E]/10 text-[#0C6E4E]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">Donate</h3>
                  <p className="text-gray-700 mb-4">Support our mission with a financial contribution of any size.</p>
                  <Button className="bg-[#0C6E4E] hover:bg-[#0A5C41] w-full" onClick={() => window.location.href = '/donate'}>
                    Donate Now
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-all">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0C6E4E]/10 text-[#0C6E4E]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">Volunteer</h3>
                  <p className="text-gray-700 mb-4">Contribute your skills, time, and passion to advance our mission.</p>
                  <Button className="bg-[#0C6E4E] hover:bg-[#0A5C41] w-full">
                    Join Our Team
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-all">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0C6E4E]/10 text-[#0C6E4E]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                      <path d="M16.5 9.4 7.55 4.24"></path>
                      <polyline points="3.29 7 12 12 20.71 7"></polyline>
                      <polyline points="12 22 12 12"></polyline>
                      <circle cx="18.5" cy="15.5" r="2.5"></circle>
                      <path d="M20.27 17.27 22 19"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">Invest</h3>
                  <p className="text-gray-700 mb-4">Become a strategic partner in building the future of governance.</p>
                  <Button className="bg-[#0C6E4E] hover:bg-[#0A5C41] w-full">
                    Partner With Us
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-all">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0C6E4E]/10 text-[#0C6E4E]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="4"></circle>
                      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                      <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
                      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">Spread the Word</h3>
                  <p className="text-gray-700 mb-4">Share our vision with your network and help grow the movement.</p>
                  <Button className="bg-[#0C6E4E] hover:bg-[#0A5C41] w-full">
                    Share Now
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-16 text-center">
              <p className="mb-6 text-lg text-gray-700">
                Ready to learn more or discuss how you can contribute to our mission?
              </p>
              <Button size="lg" className="bg-[#D4AF37] hover:bg-[#B59029] text-white" onClick={() => window.location.href = '/contact'}>
                Contact Us Today
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}