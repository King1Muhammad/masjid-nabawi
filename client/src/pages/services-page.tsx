import { SERVICES } from '@/lib/constants';
import { Link } from 'wouter';

interface ServiceIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const ServiceIcon = ({ name, size = 'md' }: ServiceIconProps) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const classes = sizeClasses[size];
  
  switch (name) {
    case 'pray':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={classes} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'book-reader':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={classes} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'chalkboard-teacher':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={classes} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      );
    case 'language':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={classes} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      );
    case 'hands-helping':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={classes} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      );
    case 'mosque':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={classes} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={classes} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

const ServicesPage = () => {
  // Additional service details for extended content
  const servicesExtended = [
    {
      id: 'daily-prayers',
      times: {
        fajr: '5:30 AM',
        zuhr: '1:15 PM',
        asr: '4:45 PM',
        maghrib: '6:30 PM',
        isha: '8:00 PM',
        juma: '1:30 PM'
      },
      additionalInfo: 'Our masjid remains open 30 minutes before each prayer time and stays open until after prayer completion. Special Taraweeh prayers are held during Ramadan, and extended hours are observed during Eid and other Islamic occasions. Women\'s prayer areas are available and properly maintained.'
    },
    {
      id: 'quran-classes',
      schedules: [
        { level: 'Beginner', days: 'Mon-Wed', time: '4:00 PM - 5:30 PM' },
        { level: 'Intermediate', days: 'Tue-Thu', time: '6:00 PM - 7:30 PM' },
        { level: 'Advanced', days: 'Sat-Sun', time: '10:00 AM - 12:00 PM' }
      ],
      additionalInfo: 'Our qualified Quran teachers use approved teaching methodologies with proper tajweed rules. Classes are available for all age groups and both genders. We also offer one-on-one Quran learning sessions for those with special needs or schedules.'
    },
    {
      id: 'islamic-studies',
      courses: [
        'Fundamentals of Islamic Faith',
        'Fiqh (Islamic Jurisprudence)',
        'Hadith Sciences',
        'Seerah (Biography of Prophet Muhammad ﷺ)',
        'Contemporary Islamic Issues'
      ],
      additionalInfo: 'Our Islamic studies curriculum is designed to provide a comprehensive understanding of Islam in the modern context. Classes are taught by scholars with appropriate qualifications in Islamic sciences. We also organize special workshops and seminars throughout the year.'
    },
    {
      id: 'arabic-language',
      levels: [
        'Beginner - Learn Arabic alphabet and basic vocabulary',
        'Intermediate - Basic grammar and sentence structure',
        'Advanced - Conversational Arabic and Quranic vocabulary',
        'Specialized - Quranic Arabic and classical texts'
      ],
      additionalInfo: 'We utilize modern language learning techniques combined with traditional methods. Our curriculum focuses on both modern standard Arabic and classical Arabic for understanding the Quran and Islamic texts. Resources include textbooks, audio materials, and online practice tools.'
    },
    {
      id: 'community-support',
      services: [
        'Marriage counseling and nikah services',
        'Funeral arrangements and guidance',
        'Zakat and sadaqah distribution to needy families',
        'Family counseling and dispute resolution',
        'New Muslim support and guidance'
      ],
      additionalInfo: 'Our community support services are provided by trained professionals with expertise in both Islamic guidance and modern counseling techniques. All services are offered with complete confidentiality and respect for privacy.'
    },
    {
      id: 'online-services',
      platforms: [
        'Live streaming of Friday sermons and special lectures',
        'Online Quran and Islamic studies classes',
        'Digital library of recorded lectures and courses',
        'Mobile app for prayer times and masjid updates',
        'Social media channels for community engagement'
      ],
      additionalInfo: 'Our digital infrastructure is designed to make Islamic education and services accessible to those unable to physically attend the masjid. We employ modern technology while ensuring all content adheres to authentic Islamic teachings.'
    }
  ];

  return (
    <div className="py-16 bg-[#F7F3E9]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-[#0C6E4E] text-center mb-4">Our Services</h1>
        <p className="text-xl text-center max-w-3xl mx-auto mb-16">Jamia Masjid Nabvi offers a comprehensive range of services to nurture faith, education, and community well-being in accordance with Islamic teachings.</p>
        
        <div className="mb-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-heading text-[#0C6E4E] mb-6">Services Overview</h2>
          <p className="mb-6">Our masjid is committed to serving the spiritual, educational, and social needs of Muslims in Islamabad and surrounding areas. We offer a diverse range of services designed to strengthen faith, promote Islamic knowledge, and foster a supportive community environment.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0C6E4E] bg-opacity-5 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-4">Spiritual Services</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Regular congregational prayers led by qualified imams
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Friday Jumu'ah prayers with insightful khutbahs
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Special prayers during Ramadan, Eid, and other Islamic occasions
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Dhikr gatherings and spiritual development sessions
                </li>
              </ul>
            </div>
            
            <div className="bg-[#0C6E4E] bg-opacity-5 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-4">Educational Services</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Comprehensive Quran reading and memorization programs
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Islamic studies classes for all age groups
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Arabic language courses for better understanding of Islamic texts
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Regular lectures and workshops on various Islamic topics
                </li>
              </ul>
            </div>
            
            <div className="bg-[#0C6E4E] bg-opacity-5 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-4">Community Services</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Marriage and family counseling services
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Funeral and burial assistance
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Zakat collection and distribution to those in need
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Community events and gatherings
                </li>
              </ul>
            </div>
            
            <div className="bg-[#0C6E4E] bg-opacity-5 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-4">Online Services</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Live streaming of Friday khutbahs
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Online Quran and Islamic studies classes
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Digital library of lectures and resources
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Virtual counseling sessions
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-12">
          {SERVICES.map((service) => {
            const extendedService = servicesExtended.find(s => s.id === service.id);
            
            return (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-[#0C6E4E] bg-opacity-10 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                      <ServiceIcon name={service.icon} size="lg" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-heading text-[#0C6E4E] mb-2">{service.title}</h2>
                      <p className="text-lg">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-medium text-[#0C6E4E] mb-4">What We Offer</h3>
                    
                    {service.id === 'daily-prayers' && extendedService && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Prayer Times</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          {Object.entries(extendedService.times).map(([prayer, time]) => (
                            <div key={prayer} className="bg-[#F7F3E9] p-3 rounded">
                              <div className="font-medium capitalize">{prayer}</div>
                              <div>{time}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {service.id === 'quran-classes' && extendedService && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Class Schedule</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse">
                            <thead>
                              <tr className="bg-[#0C6E4E] text-white">
                                <th className="px-4 py-2 text-left">Level</th>
                                <th className="px-4 py-2 text-left">Days</th>
                                <th className="px-4 py-2 text-left">Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {extendedService.schedules.map((schedule, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-4 py-2 border border-gray-200">{schedule.level}</td>
                                  <td className="px-4 py-2 border border-gray-200">{schedule.days}</td>
                                  <td className="px-4 py-2 border border-gray-200">{schedule.time}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {service.id === 'islamic-studies' && extendedService && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Available Courses</h4>
                        <ul className="grid md:grid-cols-2 gap-2">
                          {extendedService.courses.map((course, index) => (
                            <li key={index} className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {course}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {service.id === 'arabic-language' && extendedService && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Course Levels</h4>
                        <div className="space-y-2">
                          {extendedService.levels.map((level, index) => (
                            <div key={index} className="bg-[#F7F3E9] p-3 rounded">
                              <div className="flex items-start">
                                <div className="bg-[#0C6E4E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <div>{level}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {service.id === 'community-support' && extendedService && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Support Services</h4>
                        <ul className="space-y-2">
                          {extendedService.services.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {service.id === 'online-services' && extendedService && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Digital Platforms</h4>
                        <ul className="space-y-2">
                          {extendedService.platforms.map((platform, index) => (
                            <li key={index} className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {platform}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-2">Additional Information</h4>
                      <p>{extendedService?.additionalInfo}</p>
                    </div>
                    
                    <div className="mt-6">
                      <ul className="grid md:grid-cols-3 gap-4">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center bg-[#F7F3E9] p-3 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-heading text-[#0C6E4E] mb-4">Need More Information?</h2>
          <p className="mb-6">If you have questions about any of our services, please don't hesitate to contact us.</p>
          <Link href="/contact">
            <a className="inline-block bg-[#0C6E4E] hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors">
              Contact Us
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
