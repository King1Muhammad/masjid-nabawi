import { TIMELINE_ITEMS } from '@/lib/constants';
import { useEffect } from 'react';

// Import custom images
import islamicContributionsImage from '@assets/islamic-civilization.webp';
import preIslamicImage from '@assets/pre-islamic-arabia.webp';
import islamicPrinciplesImage from '@assets/islamic-principles.webp';
import masjidImage from '@assets/our masjid project.webp';

interface TimelineItemProps {
  title: string;
  description: string;
  image: string;
  isReversed?: boolean;
  content: string;
}

const TimelineItem = ({ title, description, image, isReversed = false, content }: TimelineItemProps) => {
  return (
    <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center mb-16`}>
      <div className="md:w-1/2">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img src={image} alt={title} className="w-full h-auto" />
        </div>
      </div>
      <div className="md:w-1/2">
        <h3 className="text-2xl font-heading text-[#0C6E4E] mb-3">{title}</h3>
        <p className="text-lg font-medium mb-4">{description}</p>
        <div className="prose max-w-none">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};



const HistoryPage = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Extended content for each timeline item with more details
  const extendedContent = [
    "The Arabian Peninsula before Islam was primarily a tribal society with a rich oral tradition. The majority of Arabs were polytheists, worshipping numerous deities through idols. The Kaaba in Makkah housed 360 idols and was a major pilgrimage site. Trade was the economic backbone, with Makkah serving as a commercial hub due to its location on trade routes connecting Yemen to Syria and beyond. Social justice was largely absent, with the strong oppressing the weak. The social structure was tribal, with loyalty to one's tribe considered the highest virtue, and warfare between tribes was common and often lasted for generations. Women had few rights, and female infanticide was practiced out of fear of poverty or dishonor. This period, known as 'Jahiliyyah' (age of ignorance), was characterized by tribal loyalty above all else and limited central authority.",
    
    "Prophet Muhammad ﷺ was born in Makkah around 570 CE to Abdullah and Amina of the respected Quraysh tribe. Orphaned at a young age, he was raised by his grandfather Abdul Muttalib and then his uncle Abu Talib. Even before prophethood, he was known for his exceptional character, earning the title 'Al-Amin' (the trustworthy). At age 40, while meditating in the Cave of Hira, he received his first revelation from Angel Jibril (Gabriel), marking the beginning of his prophetic mission. For 13 years in Makkah, he invited people to Islam, emphasizing monotheism and moral reform, despite severe opposition and persecution from the Quraysh tribe whose economic interests were tied to idol worship. In 622 CE, he migrated to Madinah (the Hijra), a journey that marks the beginning of the Islamic calendar. In Madinah, he established the first Islamic state based on brotherhood, justice, and equality, united the warring tribes, and established the Constitution of Madinah - the first written constitution in history that guaranteed rights for all citizens regardless of faith. He led by example, living simply despite his position of authority. Over time, Islam spread throughout Arabia through peaceful means and strategic alliances. Before his death in 632 CE, most of the Arabian Peninsula had embraced Islam, transforming from a divided, tribal society to a unified community guided by divine revelation.",
    
    "Masjid-e-Nabawi (the Prophet's Mosque) was built in Madinah shortly after the Prophet Muhammad's ﷺ migration from Makkah in 622 CE. The land where the mosque was built belonged to two orphans, and the Prophet ﷺ purchased it fairly rather than simply claiming it. Initially a simple structure measuring approximately 35 x 30 meters, it featured walls made of mud bricks, palm trunks as pillars, and a roof of palm leaves and mud. The mosque had three doors and an open courtyard with a shaded area (suffah) where poor Muslims and those dedicated to learning would reside. The eastern side contained apartments for the Prophet's family, built from the same humble materials. The Prophet ﷺ himself participated in its construction, carrying bricks and stones alongside his companions. Beyond a place of worship, it served as a community center where people gathered, a court where disputes were resolved, an educational institution where the Quran was taught, and the seat of the Prophet's government. After the Prophet's death in 632 CE, he was buried in his wife Aisha's room, which later became part of the mosque. Over centuries, various Islamic rulers expanded and beautified the mosque, with major renovations during the reigns of Caliph Umar, Caliph Uthman, the Umayyads, the Abbasids, and the Ottomans. The most distinctive modern feature, the green dome (Qubat al-Khadra), was added in 1818 CE. Today, it's one of Islam's most sacred sites, second only to the Kaaba, and can accommodate over a million worshippers during Hajj and Ramadan. The design and function of Masjid-e-Nabawi continues to inspire mosques worldwide and serves as a model for our own Jamia Masjid Nabvi Qureshi Hashmi.",
    
    "Islamic civilization experienced a golden age between the 8th and 14th centuries CE, a period characterized by remarkable scientific, cultural, and intellectual achievements. While Europe was in its Dark Ages, the Islamic world was a beacon of knowledge and innovation. Major centers like Baghdad, Córdoba, Cairo, and Damascus became global hubs of learning. The House of Wisdom (Bayt al-Hikmah) in Baghdad, established by Caliph Al-Ma'mun, was perhaps the greatest intellectual center of its time, attracting scholars from diverse backgrounds and faiths. Muslims made groundbreaking contributions across numerous fields: Ibn al-Haytham revolutionized optics, Al-Khwarizmi established algebra as a mathematical discipline, Ibn Sina's Canon of Medicine remained a standard medical text in Europe for centuries, Al-Zahrawi pioneered surgical instruments still used today, Al-Biruni accurately calculated Earth's circumference, and Ibn Khaldun developed early theories of sociology and economics. The period saw the establishment of the world's first degree-granting universities like Al-Qarawiyyin in Morocco (founded by a Muslim woman, Fatima al-Fihri) and libraries containing hundreds of thousands of volumes. Technological innovations included water-raising machines, astronomical instruments, and mechanical clocks. Islamic art flourished with distinctive styles in calligraphy, arabesque, geometric patterns, and architecture, while literature explored new genres and themes. This golden age was made possible by a culture that valued knowledge as a religious duty, practiced intellectual openness, provided institutional support for research, and embraced scholars regardless of faith or ethnicity. The contributions of this era not only enriched Islamic civilization but also laid much of the groundwork for the later European Renaissance."
  ];

  return (
    <div className="py-16 bg-[#F7F3E9]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-[#0C6E4E] text-center mb-4">Islamic History & Heritage</h1>
        <p className="text-xl text-center max-w-3xl mx-auto mb-8">Exploring the rich tapestry of Islamic civilization from pre-Islamic Arabia through the Prophet Muhammad's ﷺ life and the development of Islamic societies.</p>
        
        <div className="mb-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-heading text-[#0C6E4E] mb-6">The Importance of Islamic History</h2>
          <div className="prose max-w-none">
            <p>Understanding Islamic history is essential for Muslims and non-Muslims alike. For Muslims, it connects them to their religious and cultural roots, providing context for Islamic teachings and practices. It illustrates how Islam transformed societies and continues to shape the world today.</p>
            <p>Islamic history showcases the remarkable achievements of Muslim civilization in science, medicine, mathematics, architecture, arts, and philosophy. It reveals how Muslim scholars preserved and built upon ancient knowledge from Greek, Persian, Indian, and other traditions, making crucial contributions to human progress during Europe's Dark Ages.</p>
            <p>By studying this rich heritage, we gain insights into the diversity and complexity of Islamic societies across different regions and eras. This historical perspective helps challenge stereotypes and promotes a more nuanced understanding of Islam and Muslims in the contemporary world.</p>
          </div>
        </div>
        
        <div className="space-y-12">
          {TIMELINE_ITEMS.map((item, index) => (
            <TimelineItem 
              key={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              isReversed={index % 2 !== 0}
              content={extendedContent[index]}
            />
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-heading text-[#0C6E4E] mb-6">Islamic Contributions to Modern Civilization</h2>
          
          <div className="mb-8">
            <img 
              src={islamicContributionsImage} 
              alt="Islamic Contributions" 
              className="w-full h-64 object-cover object-center rounded-lg shadow-md mb-6" 
            />
            <p className="text-lg text-center text-gray-700 italic">
              "Islamic civilization has contributed significantly to many fields of human knowledge and development"
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#F7F3E9] p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#0C6E4E] flex items-center justify-center mr-4 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#0C6E4E]">Science & Medicine</h3>
              </div>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ibn al-Haytham's pioneering work in optics</li>
                <li>Al-Khwarizmi's foundational contributions to algebra</li>
                <li>Ibn Sina's "Canon of Medicine," used in European medical schools for centuries</li>
                <li>Al-Zahrawi's revolutionary surgical techniques and instruments</li>
                <li>Development of the scientific method through empirical observation</li>
              </ul>
            </div>
            
            <div className="bg-[#F7F3E9] p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center mr-4 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#0C6E4E]">Arts & Architecture</h3>
              </div>
              <ul className="list-disc pl-5 space-y-2">
                <li>Islamic calligraphy as a sophisticated art form</li>
                <li>Architectural innovations including the pointed arch and dome</li>
                <li>Geometric patterns and arabesque designs</li>
                <li>Magnificent structures like the Alhambra and Taj Mahal</li>
                <li>Development of musical instruments and music theory</li>
              </ul>
            </div>
            
            <div className="bg-[#F7F3E9] p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#0C6E4E] flex items-center justify-center mr-4 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#0C6E4E]">Literature & Philosophy</h3>
              </div>
              <ul className="list-disc pl-5 space-y-2">
                <li>Al-Farabi's and Ibn Rushd's commentaries on Aristotle</li>
                <li>Persian poetry of Rumi, Hafez, and Omar Khayyam</li>
                <li>Development of the maqamat literary genre</li>
                <li>Islamic philosophy's influence on Thomas Aquinas and Western thought</li>
                <li>Preservation and translation of ancient Greek philosophical works</li>
              </ul>
            </div>
            
            <div className="bg-[#F7F3E9] p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center mr-4 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#0C6E4E]">Social Innovations</h3>
              </div>
              <ul className="list-disc pl-5 space-y-2">
                <li>Establishment of the world's first degree-granting universities</li>
                <li>Development of advanced hospital systems with specialized wards</li>
                <li>Public libraries and centers of learning</li>
                <li>Charitable endowments (waqf) for public services</li>
                <li>Early concepts of international law and diplomatic relations</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Additional section about Masjid Nabvi as a model */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-heading text-[#0C6E4E] mb-6">Masjid-e-Nabawi as Our Model</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              <p className="mb-4">As Jamia Masjid Nabvi Qureshi Hashmi Islamabad, we draw our inspiration directly from the original Masjid-e-Nabawi established by Prophet Muhammad ﷺ. Our mission statement reflects this commitment: <span className="font-semibold text-[#D4AF37]">مسجد نبوی كے طرز پر سارے اعمال كا آغاز مسجد ھٰذا سے</span> (Beginning all actions according to the model of Masjid-e-Nabawi from this mosque).</p>
              
              <p className="mb-4">We strive to embody the multifunctional role that the Prophet's mosque served in early Islamic society:</p>
              
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>A place of worship that welcomes all Muslims for prayer and spiritual growth</li>
                <li>A center for Islamic education through our madrasa programs</li>
                <li>A community hub where people can gather, connect, and support one another</li>
                <li>A beacon of ethical values, promoting justice, transparency, and compassion</li>
                <li>A source of assistance for those in need within our community</li>
              </ul>
              
              <p>By following this comprehensive model, we aim to revive the true spirit and function of mosques as envisioned by the Prophet Muhammad ﷺ, serving not only as places of prayer but as centers of positive transformation for the entire community.</p>
            </div>
            
            <div className="flex justify-center">
              <div className="rounded-lg overflow-hidden shadow-lg max-w-md">
                <img 
                  src={masjidImage} 
                  alt="Original Masjid-e-Nabawi" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-[#F7F3E9] rounded-lg">
            <h3 className="text-xl font-medium text-[#0C6E4E] mb-3">Our Guiding Principles</h3>
            <p className="mb-4">In following the model of Masjid-e-Nabawi, we adhere to these key principles:</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center mb-3 text-white">1</div>
                <h4 className="font-medium mb-2">Inclusivity</h4>
                <p className="text-sm">Welcoming all Muslims regardless of background, ethnicity, or social status</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center mb-3 text-white">2</div>
                <h4 className="font-medium mb-2">Education</h4>
                <p className="text-sm">Prioritizing Quranic and Islamic knowledge for all age groups</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center mb-3 text-white">3</div>
                <h4 className="font-medium mb-2">Simplicity</h4>
                <p className="text-sm">Focusing on substance and function rather than excessive ornamentation</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center mb-3 text-white">4</div>
                <h4 className="font-medium mb-2">Community Service</h4>
                <p className="text-sm">Actively addressing the needs of the community we serve</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center mb-3 text-white">5</div>
                <h4 className="font-medium mb-2">Transparency</h4>
                <p className="text-sm">Maintaining open financial records and decision-making processes</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center mb-3 text-white">6</div>
                <h4 className="font-medium mb-2">Innovation</h4>
                <p className="text-sm">Embracing beneficial technologies while preserving Islamic values</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
