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
    description: 'The Arabian Peninsula before Islam was characterized by tribal systems, polytheism, and trading communities centered around Makkah.',
    image: 'https://images.unsplash.com/photo-1551041777-ed5954a60fe2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    title: 'Prophet Muhammad ﷺ',
    description: 'The life and teachings of Prophet Muhammad ﷺ, from his birth in Makkah to the revelation of the Quran and his migration to Madinah.',
    image: 'https://images.unsplash.com/photo-1591001282774-14b0bd0d53d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    title: 'Masjid-e-Nabawi',
    description: 'The establishment and significance of Masjid-e-Nabawi in Madinah, one of the most sacred sites in Islam and its architectural evolution.',
    image: 'https://images.unsplash.com/photo-1552867082-0be20c309e14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    title: 'Islamic Civilization',
    description: 'The spread of Islam and the development of Islamic civilization, science, arts, and architecture through the centuries.',
    image: 'https://images.unsplash.com/photo-1618749049243-d3d865f86b76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
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
  address: '123 Islamic Center Road, Islamabad, Pakistan',
  phone: '+92 51 1234567',
  email: 'info@jamiamasjidnabvi.org',
  officeHours: 'Monday to Saturday: 9:00 AM - 6:00 PM\nSunday: Closed (except for prayers)'
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
