import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PRAYER_TIMES } from '@/lib/constants';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

const formatTime = (time24: string): string => {
  // Convert "HH:MM" 24-hour format to "HH:MM AM/PM" 12-hour format
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
};

const PrayerTimesTicker = () => {
  const [islamicDate, setIslamicDate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  
  const { data: prayerTimes, isLoading, isError } = useQuery({
    queryKey: ['/api/prayer-times'],
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    // Set the exact Islamic date as requested
    const islamicYear = 1445;
    setIslamicDate(`2 Shawwal, ${islamicYear}`);
  }, []);

  // Determine next prayer time
  useEffect(() => {
    if (!prayerTimes) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeValue = currentHour * 60 + currentMinute;
      
      // Convert prayer times to comparable values
      const prayers = [
        { name: 'Fajr', time: prayerTimes.Fajr },
        { name: 'Sunrise', time: prayerTimes.Sunrise },
        { name: 'Dhuhr', time: prayerTimes.Dhuhr },
        { name: 'Asr', time: prayerTimes.Asr },
        { name: 'Maghrib', time: prayerTimes.Maghrib },
        { name: 'Isha', time: prayerTimes.Isha },
      ];
      
      // Convert time to minutes
      const timeToMinutes = (timeStr: string): number => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':');
        return (parseInt(hours) * 60) + parseInt(minutes);
      };
      
      // Find next prayer
      let nextPrayerName: string = 'Fajr'; // Default to Fajr if all prayers passed
      
      for (const prayer of prayers) {
        const prayerTimeValue = timeToMinutes(prayer.time);
        if (prayerTimeValue > currentTimeValue) {
          nextPrayerName = prayer.name;
          break;
        }
      }
      
      setNextPrayer(nextPrayerName);
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(timer);
  }, [prayerTimes]);

  const formattedTimes: PrayerTimes = isLoading || isError 
    ? DEFAULT_PRAYER_TIMES as unknown as PrayerTimes
    : {
        Fajr: formatTime(prayerTimes.Fajr),
        Sunrise: formatTime(prayerTimes.Sunrise),
        Dhuhr: formatTime(prayerTimes.Dhuhr),
        Asr: formatTime(prayerTimes.Asr),
        Maghrib: formatTime(prayerTimes.Maghrib),
        Isha: formatTime(prayerTimes.Isha),
        Juma: '1:30 PM'
      };

  return (
    <div className="bg-[#0C6E4E] text-white py-3 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{currentDate}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{currentTime}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" />
            </svg>
            <span className="font-medium">{islamicDate}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {Object.entries(formattedTimes).map(([prayer, time]) => {
            // Skip sunrise for display, but keep it for next prayer calculation
            if (prayer === 'Sunrise') return null;
            
            // Handle special case for Juma (Friday prayer)
            const prayerLabel = prayer === 'Dhuhr' ? 'Zuhr' : prayer;
            
            const isNext = prayer === nextPrayer;
            
            return (
              <div 
                key={prayer} 
                className={`flex items-center px-3 py-1 rounded-full ${isNext ? 'bg-[#D4AF37] text-black font-bold' : ''}`}
              >
                <span>{prayerLabel}: {time}</span>
                {isNext && (
                  <span className="ml-1 text-xs">
                    (Next)
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesTicker;
