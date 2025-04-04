import { TIMELINE_ITEMS } from '@/lib/constants';
import { Link } from 'wouter';

const History = () => {
  return (
    <section id="history" className="bg-[#0C6E4E] bg-opacity-5 py-16" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230C6E4E' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading text-[#0C6E4E] mb-4">Islamic Heritage & History</h2>
          <p className="max-w-3xl mx-auto">Exploring the rich history of Islam from pre-Islamic Arabia through the life of Prophet Muhammad ﷺ and the establishment of Masjid-e-Nabawi.</p>
        </div>
        
        <div className="mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-heading text-[#0C6E4E] mb-4">Transformation of Humanity: Before and After Islam</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img 
                  src="/src/assets/IMG_20220826_175300_109.jpg"
                  alt="Pre-Islamic Arabia"
                  className="w-full h-48 object-cover rounded-lg shadow-md mb-4"
                />
                <h4 className="text-xl font-semibold text-[#D4AF37] mb-3">Before Islam</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <p><span className="font-semibold">Tribalism and Warfare:</span> Pre-Islamic Arabian society was deeply divided along tribal lines, leading to frequent conflicts and warfare. Tribal loyalties often took precedence over moral values.</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <p><span className="font-semibold">Idol Worship:</span> The prevalent practice of idol worship hindered spiritual development. The Kaaba in Mecca, originally built for monotheistic worship, had become a center for idolatry.</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <p><span className="font-semibold">Injustice and Inequality:</span> In several parts of the world, including Persia and Rome, kings held absolute power, while the rights of common people, especially slaves, were virtually non-existent.</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <p><span className="font-semibold">Lack of Scientific Progress:</span> Scientific knowledge and inquiry were limited. The pursuit of science and learning was not a priority in many societies.</p>
                  </li>
                </ul>
              </div>
              
              <div>
                <img 
                  src="/src/assets/IMG_20220826_183107_305.jpg"
                  alt="Islamic Civilization"
                  className="w-full h-48 object-cover rounded-lg shadow-md mb-4"
                />
                <h4 className="text-xl font-semibold text-[#0C6E4E] mb-3">After Islam</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0C6E4E] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <p><span className="font-semibold">Monotheism and Unity:</span> Islam brought the concept of monotheism, emphasizing the belief in one God. Muslims formed a united community (Ummah) that transcended tribal divisions.</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0C6E4E] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <p><span className="font-semibold">Justice and Moral Values:</span> Islam introduced principles of equality, justice, and moral values. It emphasized the fair treatment of all individuals, regardless of their social status.</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0C6E4E] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <p><span className="font-semibold">Empowerment of Women:</span> Islam significantly improved the status of women in society. It granted them rights and protections, challenging the pre-existing norms of gender inequality.</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0C6E4E] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <p><span className="font-semibold">Education and Knowledge:</span> Islam encouraged the pursuit of education and knowledge. Islamic scholars made significant contributions to various fields, including science, mathematics, medicine, and philosophy.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-heading text-[#0C6E4E] mb-4">Prophet Muhammad's Vision: Building a Nation from Masjid e Nabawi</h3>
            
            <div className="space-y-4">
              <p>The migration of Prophet Muhammad (peace be upon him) to Madina in 622 CE marked a pivotal moment in history. In Madina, the Prophet's leadership and vision laid the foundation for a strong sense of community and brotherhood, establishing a model that continues to inspire societies around the globe.</p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-[#0C6E4E] bg-opacity-5 p-5 rounded-lg">
                  <h4 className="text-xl font-semibold text-[#0C6E4E] mb-2">Constitution of Madina</h4>
                  <p>One of the Prophet's first acts in Madina was the signing of the Constitution of Madina. This historic document outlined the rights and responsibilities of all citizens, irrespective of their religion or tribal affiliations, establishing a framework for a pluralistic society.</p>
                </div>
                
                <div className="bg-[#0C6E4E] bg-opacity-5 p-5 rounded-lg">
                  <h4 className="text-xl font-semibold text-[#0C6E4E] mb-2">Masjid e Nabawi as a Center</h4>
                  <p>Prophet Muhammad designated Masjid e Nabawi as the spiritual and administrative heart of the nascent Islamic state. It served as more than just a place of worship; it became a hub for decision-making, discussions, and community gatherings.</p>
                </div>
                
                <div className="bg-[#0C6E4E] bg-opacity-5 p-5 rounded-lg">
                  <h4 className="text-xl font-semibold text-[#0C6E4E] mb-2">Unity and Brotherhood</h4>
                  <p>In Madina, Prophet Muhammad fostered a profound sense of unity and brotherhood among its inhabitants. This unity transcended the boundaries of tribalism, as the Muhajirun (migrants) and Ansar (helpers) came together as one community.</p>
                </div>
              </div>
              
              <p className="mt-4">Our masjid, Jamia Masjid Nabvi Qureshi Hashmi, seeks to revive this model in the modern era. In the same way that Prophet Muhammad built a nation from Masjid e Nabawi, we aim to create an AI-powered platform that connects masajids and their communities for collective action and positive change.</p>
            </div>
          </div>
        </div>
        
        <div className="flex overflow-x-auto pb-4 space-x-6 snap-x">
          {TIMELINE_ITEMS.map((item) => (
            <div key={item.id} className="min-w-[300px] max-w-[350px] snap-start bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading text-[#0C6E4E] mb-2">{item.title}</h3>
                <p className="text-sm mb-4">{item.description}</p>
                <Link href="/history-page">
                  <div className="text-[#D4AF37] hover:underline inline-block cursor-pointer">
                    Learn more 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/history-page">
            <div className="inline-block bg-[#0C6E4E] hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors cursor-pointer">
              Explore Full Timeline
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default History;
