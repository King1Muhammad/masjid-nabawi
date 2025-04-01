// Color palette constants
export const COLORS = {
  primary: '#0C6E4E',
  secondary: '#D4AF37',
  accent: '#8D3333',
  light: '#F7F3E9',
  dark: '#333333',
  success: '#4CAF50',
  error: '#F44336',
  info: '#2196F3'
};

// Fonts
export const FONTS = {
  heading: '"Scheherazade New", serif',
  body: 'Roboto, sans-serif',
  arabic: 'Amiri, serif'
};

// Course data
export const COURSES = [
  {
    id: 'quran-reading',
    name: 'Quran Reading',
    ageGroup: '6-12 years',
    schedule: 'Mon-Thu, 4:00-5:30 PM',
    instructor: 'Qari Ahmad'
  },
  {
    id: 'hifz-program',
    name: 'Hifz Program',
    ageGroup: '10-18 years',
    schedule: 'Daily, 6:00-9:00 AM',
    instructor: 'Hafiz Ibrahim'
  },
  {
    id: 'arabic-language',
    name: 'Arabic Language',
    ageGroup: 'All ages',
    schedule: 'Sat-Sun, 10:00-11:30 AM',
    instructor: 'Ustadh Hassan'
  },
  {
    id: 'hadith-studies',
    name: 'Hadith Studies',
    ageGroup: '15+ years',
    schedule: 'Tue & Fri, 8:00-9:30 PM',
    instructor: 'Sheikh Abdullah'
  },
  {
    id: 'weekend-islamic',
    name: 'Weekend Islamic Studies',
    ageGroup: '8-15 years',
    schedule: 'Sat, 2:00-4:00 PM',
    instructor: 'Various Teachers'
  }
];

// History timeline items
export const TIMELINE_ITEMS = [
  {
    id: 1,
    title: 'Pre-Islamic Arabia',
    description: 'Before Islam, Arabian society was marked by tribalism, warfare, idol worship, and injustice. The Kaaba in Mecca, originally built for monotheistic worship, had become a center for idolatry.',
    content: 'Pre-Islamic Arabian society was deeply divided along tribal lines, leading to frequent conflicts and warfare. Idol worship was prevalent, hindering spiritual development. Injustice and inequality were widespread, with the rights of common people, especially slaves, virtually non-existent.',
    image: 'https://images.unsplash.com/photo-1565019011521-b3677c8c9e9d?q=80&w=1000'
  },
  {
    id: 2,
    title: 'Prophet Muhammad ﷺ',
    description: 'The life and teachings of Prophet Muhammad ﷺ brought monotheism, justice, education, and moral values to humanity, shifting society from tribalism to unity.',
    content: 'With the arrival of Islam and the message brought by Prophet Muhammad ﷺ, a transformation occurred. Muslims embraced monotheism (belief in one God), adopted a code of ethics, and gained a sense of unity as a community (Ummah). Islam emphasized equality, justice, improved the status of women, and promoted education and knowledge.',
    image: 'https://images.unsplash.com/photo-1591002801535-807895a69cf0?q=80&w=1000'
  },
  {
    id: 3,
    title: 'Masjid-e-Nabawi',
    description: 'Prophet Muhammad\'s migration to Madina in 622 CE led to the establishment of Masjid e Nabawi, which became more than just a place of worship - it was the center of a new nation.',
    content: 'Prophet Muhammad designated Masjid e Nabawi as the spiritual and administrative heart of the nascent Islamic state. It served as more than just a place of worship; it became a hub for decision-making, discussions, and community gatherings. The Constitution of Madina established a framework for a pluralistic society, where diverse communities coexisted harmoniously under Islamic governance.',
    image: 'https://images.unsplash.com/photo-1581258624948-a1e691a21a27?q=80&w=1000'
  },
  {
    id: 4,
    title: 'Islamic Civilization',
    description: 'Islam encouraged education and knowledge, leading to the Islamic Golden Age with remarkable advancements in science, mathematics, medicine, and philosophy.',
    content: 'The message of Islam continues to inspire individuals to strive for a better world and a more just and inclusive society. Islamic scholars made significant contributions to various fields, including science, mathematics, medicine, and philosophy. The Islamic Golden Age witnessed remarkable advancements in these areas, shaping the world as we know it today.',
    image: 'https://images.unsplash.com/photo-1542702215-6918e3c71dd4?q=80&w=1000'
  }
];

// Services offered by the masjid
export const SERVICES = [
  {
    id: 'daily-prayers',
    title: 'Daily Prayers',
    description: 'Join us for the five daily prayers led by qualified imams. Special Taraweeh prayers during Ramadan and Eid prayers.',
    icon: 'pray',
    features: [
      'Congregational prayers',
      'Friday Jumu\'ah prayers',
      'Special night prayers'
    ]
  },
  {
    id: 'quran-classes',
    title: 'Quran Classes',
    description: 'Learn to read, recite, and understand the Quran with proper Tajweed from qualified instructors.',
    icon: 'book-reader',
    features: [
      'Quran reading (Nazra)',
      'Tajweed rules',
      'Hifz (memorization) program'
    ]
  },
  {
    id: 'islamic-studies',
    title: 'Islamic Studies',
    description: 'Comprehensive Islamic education covering Hadith, Fiqh, Seerah, and Islamic history for all ages.',
    icon: 'chalkboard-teacher',
    features: [
      'Hadith studies',
      'Islamic jurisprudence',
      'Prophet\'s biography'
    ]
  },
  {
    id: 'arabic-language',
    title: 'Arabic Language',
    description: 'Learn Classical and Modern Standard Arabic to better understand the Quran and Islamic texts.',
    icon: 'language',
    features: [
      'Beginner to advanced levels',
      'Quranic Arabic focus',
      'Conversation practice'
    ]
  },
  {
    id: 'community-support',
    title: 'Community Support',
    description: 'Social services including counseling, marriage services, and assistance for those in need.',
    icon: 'hands-helping',
    features: [
      'Marriage services',
      'Islamic counseling',
      'Funeral arrangements'
    ]
  },
  {
    id: 'online-services',
    title: 'Online Services',
    description: 'Access our services remotely through live streams, recorded lectures, and online classes.',
    icon: 'mosque',
    features: [
      'Live prayer broadcasts',
      'Online Quran classes',
      'Recorded lectures'
    ]
  }
];

// Educational programs
export const EDUCATIONAL_PROGRAMS = [
  {
    title: 'Quran Reading & Tajweed',
    description: 'Learn proper Quranic recitation with correct pronunciation and tajweed rules.',
    icon: 'book'
  },
  {
    title: 'Hifz Program (Memorization)',
    description: 'Comprehensive program for memorizing the entire Quran under qualified huffaz.',
    icon: 'award'
  },
  {
    title: 'Hadith Studies',
    description: 'Study of authentic hadith collections and their applications in daily life.',
    icon: 'scroll'
  },
  {
    title: 'Arabic Language',
    description: 'Learn Arabic grammar, vocabulary, and conversation skills.',
    icon: 'language'
  }
];

// Contact information
export const CONTACT_INFO = {
  address: 'G11/4, Islamabad, Pakistan',
  mapLink: 'https://maps.app.goo.gl/6s6MxCCFU8RXsBuE6',
  phone: '+92 333 921 4600',
  email: 'jamiamasjidnabviqureshihashmi@gmail.com',
  officeHours: 'Monday to Saturday: 9:00 AM - 6:00 PM\nSunday: Closed (except for prayers)',
  easyPaisa: '03468053268',
  jazzCash: '03468053268',
  bankAccount: 'Contact masjid administration for bank account details'
};

// Default prayer times (will be updated with API data)
export const DEFAULT_PRAYER_TIMES = {
  Fajr: '5:30 AM',
  Sunrise: '6:45 AM',
  Dhuhr: '1:15 PM',
  Asr: '4:45 PM',
  Maghrib: '6:30 PM',
  Isha: '8:00 PM',
  Juma: '1:30 PM'
};
