import { TIMELINE_ITEMS } from '@/lib/constants';

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
  // Extended content for each timeline item
  const extendedContent = [
    "The Arabian Peninsula before Islam was primarily a tribal society with a rich oral tradition. The majority of Arabs were polytheists, worshipping numerous deities through idols. The Kaaba in Makkah housed 360 idols and was a major pilgrimage site. Trade was the economic backbone, with Makkah serving as a commercial hub due to its location on trade routes. The social structure was tribal, and warfare between tribes was common. Women had few rights, and female infanticide was practiced. This period, known as 'Jahiliyyah' (age of ignorance), was characterized by tribal loyalty above all else and limited central authority.",
    
    "Prophet Muhammad ﷺ was born in Makkah around 570 CE to Abdullah and Amina. Orphaned at a young age, he was raised by his grandfather and then his uncle Abu Talib. Known for his honesty and trustworthiness, he received his first revelation at age 40 in the Cave of Hira from Angel Jibril (Gabriel). For 13 years in Makkah, he invited people to Islam despite severe opposition from the Quraysh tribe. In 622 CE, he migrated to Madinah (the Hijra), marking the beginning of the Islamic calendar. In Madinah, he established the first Islamic state, united the warring tribes, and established the Constitution of Madinah. Over time, Islam spread throughout Arabia, and before his death in 632 CE, most of the Arabian Peninsula had embraced Islam.",
    
    "Masjid-e-Nabawi (the Prophet's Mosque) was built in Madinah shortly after the Prophet Muhammad's ﷺ migration from Makkah in 622 CE. Initially a simple structure with palm trunks as pillars and a roof of palm leaves, it served not only as a place of worship but also as a community center, educational institution, and the seat of the Prophet's government. The original mosque was approximately 35 x 30 meters, with the eastern side containing apartments for the Prophet's family. After the Prophet's death, he was buried in his wife Aisha's room, which later became part of the mosque. Over centuries, various Islamic rulers expanded and beautified the mosque. Today, it's one of Islam's most sacred sites, characterized by its green dome above the Prophet's tomb, and can accommodate over a million worshippers.",
    
    "Islamic civilization experienced a golden age between the 8th and 14th centuries CE. Muslims made significant contributions to science, mathematics, medicine, astronomy, geography, architecture, art, literature, and philosophy. Baghdad and Córdoba became world centers of knowledge and culture. Institutions like libraries, hospitals, and universities flourished. Scholars translated and preserved Greek, Roman, and Persian works, adding their own discoveries and innovations. Muslim scientists like Ibn al-Haytham, al-Khwarizmi, and Ibn Sina (Avicenna) made groundbreaking contributions. The period saw advancements in irrigation techniques, astronomical instruments, surgical procedures, and architectural innovations such as the pointed arch. Islamic art developed distinctive styles in calligraphy, arabesque, geometric patterns, and miniature painting. This rich cultural and intellectual heritage profoundly influenced the European Renaissance."
  ];

  return (
    <div className="py-16 bg-[#F7F3E9]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-[#0C6E4E] text-center mb-4">Islamic History & Heritage</h1>
        <p className="text-xl text-center max-w-3xl mx-auto mb-16">Exploring the rich tapestry of Islamic civilization from pre-Islamic Arabia through the Prophet Muhammad's ﷺ life and the development of Islamic societies.</p>
        
        <div className="mb-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-heading text-[#0C6E4E] mb-6">The Importance of Islamic History</h2>
          <div className="prose max-w-none">
            <p>Understanding Islamic history is essential for Muslims and non-Muslims alike. For Muslims, it connects them to their religious and cultural roots, providing context for Islamic teachings and practices. It illustrates how Islam transformed societies and continues to shape the world today.</p>
            <p>Islamic history showcases the remarkable achievements of Muslim civilization in science, medicine, mathematics, architecture, arts, and philosophy. It reveals how Muslim scholars preserved and built upon ancient knowledge from Greek, Persian, Indian, and other traditions, making crucial contributions to human progress during Europe's Dark Ages.</p>
            <p>By studying this rich heritage, we gain insights into the diversity and complexity of Islamic societies across different regions and eras. This historical perspective helps challenge stereotypes and promotes a more nuanced understanding of Islam and Muslims in the contemporary world.</p>
          </div>
        </div>
        
        <div className="space-y-8">
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
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-3">Science & Medicine</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ibn al-Haytham's pioneering work in optics</li>
                <li>Al-Khwarizmi's foundational contributions to algebra</li>
                <li>Ibn Sina's "Canon of Medicine," used in European medical schools for centuries</li>
                <li>Al-Zahrawi's revolutionary surgical techniques and instruments</li>
                <li>Development of the scientific method through empirical observation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-3">Arts & Architecture</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Islamic calligraphy as a sophisticated art form</li>
                <li>Architectural innovations including the pointed arch and dome</li>
                <li>Geometric patterns and arabesque designs</li>
                <li>Magnificent structures like the Alhambra and Taj Mahal</li>
                <li>Development of musical instruments and music theory</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-3">Literature & Philosophy</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Al-Farabi's and Ibn Rushd's commentaries on Aristotle</li>
                <li>Persian poetry of Rumi, Hafez, and Omar Khayyam</li>
                <li>Development of the maqamat literary genre</li>
                <li>Islamic philosophy's influence on Thomas Aquinas and Western thought</li>
                <li>Preservation and translation of ancient Greek philosophical works</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-3">Social Innovations</h3>
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
      </div>
    </div>
  );
};

export default HistoryPage;
