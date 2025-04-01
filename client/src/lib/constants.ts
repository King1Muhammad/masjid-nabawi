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
    id: 'men-islamic-studies',
    name: 'Men\'s Complete Islamic Studies',
    ageGroup: 'Adult Men',
    schedule: 'Daily, Maghrib to Isha',
    instructor: 'Qualified Ulama'
  },
  {
    id: 'women-islamic-studies',
    name: 'Women\'s Complete Islamic Education',
    ageGroup: 'Adult Women',
    schedule: 'Weekdays, 10:00 AM-12:00 PM',
    instructor: 'Female Islamic Scholars'
  },
  {
    id: 'children-quran',
    name: 'Children\'s Quran & Seerat Program',
    ageGroup: '6-14 years',
    schedule: 'Mon-Thu, 4:00-5:30 PM',
    instructor: 'Qari Ahmad & Team'
  },
  {
    id: 'tableegh-program',
    name: 'Monthly Tableegh Program',
    ageGroup: 'All ages (separate groups)',
    schedule: '3 days each month',
    instructor: 'Various Scholars'
  },
  {
    id: 'tech-social-skills',
    name: 'Technology & Social Skills',
    ageGroup: '10-16 years',
    schedule: 'Weekends, 2:00-4:00 PM',
    instructor: 'Specialist Instructors'
  },
  {
    id: 'monthly-excursions',
    name: 'Monthly Islamic Excursions',
    ageGroup: 'All ages (separate groups)',
    schedule: 'Once per month',
    instructor: 'Group Leaders'
  },
  {
    id: 'online-international',
    name: 'International Online Program',
    ageGroup: 'All ages worldwide',
    schedule: 'Flexible, 24/7 access',
    instructor: 'Gender-appropriate Teachers'
  }
];

// History timeline items
export const TIMELINE_ITEMS = [
  {
    id: 1,
    title: 'Pre-Islamic Arabia',
    description: 'Before Islam, Arabian society was marked by tribalism, warfare, idol worship, and injustice. The Kaaba in Mecca, originally built for monotheistic worship, had become a center for idolatry.',
    content: 'Pre-Islamic Arabian society was deeply divided along tribal lines, leading to frequent conflicts and warfare. Idol worship was prevalent, hindering spiritual development. Injustice and inequality were widespread, with the rights of common people, especially slaves, virtually non-existent.',
    image: '../assets/IMG_20220826_175300_109.jpg'
  },
  {
    id: 2,
    title: 'Prophet Muhammad ﷺ',
    description: 'The life and teachings of Prophet Muhammad ﷺ brought monotheism, justice, education, and moral values to humanity, shifting society from tribalism to unity.',
    content: 'With the arrival of Islam and the message brought by Prophet Muhammad ﷺ, a transformation occurred. Muslims embraced monotheism (belief in one God), adopted a code of ethics, and gained a sense of unity as a community (Ummah). Islam emphasized equality, justice, improved the status of women, and promoted education and knowledge.',
    image: '../assets/IMG_20220826_183107_305.jpg'
  },
  {
    id: 3,
    title: 'Masjid-e-Nabawi',
    description: 'Prophet Muhammad\'s migration to Madina in 622 CE led to the establishment of Masjid e Nabawi, which became more than just a place of worship - it was the center of a new nation.',
    content: 'Prophet Muhammad designated Masjid e Nabawi as the spiritual and administrative heart of the nascent Islamic state. It served as more than just a place of worship; it became a hub for decision-making, discussions, and community gatherings. The Constitution of Madina established a framework for a pluralistic society, where diverse communities coexisted harmoniously under Islamic governance.',
    image: '../assets/IMG-20220513-WA0016.jpg'
  },
  {
    id: 4,
    title: 'Islamic Civilization',
    description: 'Islam encouraged education and knowledge, leading to the Islamic Golden Age with remarkable advancements in science, mathematics, medicine, and philosophy.',
    content: 'The message of Islam continues to inspire individuals to strive for a better world and a more just and inclusive society. Islamic scholars made significant contributions to various fields, including science, mathematics, medicine, and philosophy. The Islamic Golden Age witnessed remarkable advancements in these areas, shaping the world as we know it today.',
    image: '../assets/IMG_20230124_151302_955.jpg'
  },
  {
    id: 5,
    title: 'Our Masjid Project',
    description: 'Jamia Masjid Nabvi Qureshi Hashmi is reviving the true model of Masjid e Nabawi with comprehensive Islamic education and community governance.',
    content: 'Our masjid project aims to restore the comprehensive role that masajids played during the time of Prophet Muhammad ﷺ. We are creating a center for education, governance, social welfare, and economic activities, all governed by Islamic principles and transparent community participation.',
    image: '../assets/IMG_20230318_144743_2.jpg'
  }
];

// Services offered by the masjid
export const SERVICES = [
  {
    id: 'daily-prayers',
    title: 'Daily Prayers & Facilities',
    description: 'Our masjid is open 24/7 for all five daily prayers led by qualified imams, with special Taraweeh prayers during Ramadan and Eid prayers.',
    icon: 'pray',
    features: [
      'Open 24 hours, 7 days a week',
      'Congregational prayers',
      'Friday Jumu\'ah prayers',
      'Special night prayers'
    ]
  },
  {
    id: 'mens-madrasa',
    title: 'Men\'s Madrasa',
    description: 'Special evening classes from Maghrib to Isha for working men and businessmen who want to learn Islamic knowledge.',
    icon: 'book-reader',
    features: [
      'Specifically designed for busy working men',
      'Maghrib to Isha timing',
      'Complete Islamic curriculum',
      'Taught by qualified Ulama and Qaris'
    ]
  },
  {
    id: 'womens-madrasa',
    title: 'Women\'s Madrasa',
    description: 'A separate, dedicated environment for women to learn Islamic knowledge taught exclusively by female teachers.',
    icon: 'chalkboard-teacher',
    features: [
      'Private space for women\'s education',
      'Female teachers only',
      'Comprehensive Islamic curriculum',
      'Flexible timings for housewives'
    ]
  },
  {
    id: 'children-madrasa',
    title: 'Children\'s Madrasa',
    description: 'Special education program for children focusing on Islamic knowledge, character development, and social skills.',
    icon: 'language',
    features: [
      'Weekly Seerat classes',
      'Monthly 3-day Tableegh program',
      'Social skills development',
      'Islamic arts and activities'
    ]
  },
  {
    id: 'community-activities',
    title: 'Community Activities',
    description: 'Monthly excursions and educational trips organized separately for men, women, and children in Islamic environments.',
    icon: 'hands-helping',
    features: [
      'Monthly nature trips for each group',
      'Educational outings to Islamic sites',
      'Community bonding activities',
      'Problem-solving and personal growth'
    ]
  },
  {
    id: 'community-governance',
    title: 'Community Governance',
    description: 'Democratic decision-making process for community issues with transparent fund management and community participation.',
    icon: 'mosque',
    features: [
      'Community voting on important issues',
      'Transparent financial management',
      'Regular community meetings',
      'Online participation options'
    ]
  },
  {
    id: 'online-services',
    title: 'International Online Services',
    description: 'Access our services globally through live streams, recorded lectures, and online classes for all age groups.',
    icon: 'mosque',
    features: [
      'Live prayer broadcasts',
      'Online Quran classes for men, women & children',
      'International access to all programs',
      'Interactive learning platforms'
    ]
  }
];

// Educational programs
export const EDUCATIONAL_PROGRAMS = [
  {
    title: 'Men\'s Evening Islamic Studies',
    description: 'Specialized evening classes (Maghrib to Isha) for working men and businessmen who want to learn complete Islamic knowledge.',
    icon: 'book'
  },
  {
    title: 'Women\'s Islamic Education',
    description: 'Exclusive program for women taught by female teachers in a comfortable, private environment with comprehensive Islamic curriculum.',
    icon: 'award'
  },
  {
    title: 'Children\'s Holistic Education',
    description: 'Weekly Seerat classes, monthly 3-day Tableegh program, and special activities to develop Islamic knowledge and social skills.',
    icon: 'scroll'
  },
  {
    title: 'Technology & Social Integration',
    description: 'Special programs for children focused on mobile devices to enhance their social skills while maintaining Islamic values.',
    icon: 'language'
  },
  {
    title: 'Monthly Islamic Excursions',
    description: 'Separate monthly trips for men, women, and children to Islamic environments and natural settings for education and community bonding.',
    icon: 'book'
  },
  {
    title: 'International Online Education',
    description: 'Global access to our educational programs through online platforms with gender-appropriate teachers for all age groups.',
    icon: 'language'
  }
];

// Contact information
export const CONTACT_INFO = {
  address: 'Jamia Masjid Nabvi Qureshi Hashmi, opposite D-13 Block FGEHF G-11/4 Islamabad, Pakistan',
  mapLink: 'https://maps.app.goo.gl/fS9FmcFzGBrCbveh7',
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
