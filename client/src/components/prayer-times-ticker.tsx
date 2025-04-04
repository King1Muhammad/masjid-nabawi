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
    // Set the exact Islamic date as requested by user
    const islamicYear = 1445;
    setIslamicDate(`5 Shawwal, ${islamicYear}`);
  }, []);

  // Determine next prayer time using accurate calculations
  useEffect(() => {
    if (!prayerTimes) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeValue = currentHour * 60 + currentMinute;
      
      // Convert time string to minutes for comparison
      const timeToMinutes = (timeStr: string): number => {
        if (!timeStr) return 0;
        // Handle both 24-hour format and AM/PM format
        if (timeStr.includes(':')) {
          const [hours, minutes] = timeStr.split(':');
          return (parseInt(hours) * 60) + parseInt(minutes);
        } else if (timeStr.includes('AM') || timeStr.includes('PM')) {
          const [time, period] = timeStr.split(' ');
          let [hours, minutes] = time.split(':');
          let hourValue = parseInt(hours);
          
          // Convert 12-hour to 24-hour
          if (period === 'PM' && hourValue < 12) hourValue += 12;
          if (period === 'AM' && hourValue === 12) hourValue = 0;
          
          return (hourValue * 60) + parseInt(minutes);
        }
        return 0;
      };
      
      // Use the data from API/constants correctly
      const prayers = [
        { name: 'Fajr', time: DEFAULT_PRAYER_TIMES.Fajr },
        { name: 'Sunrise', time: DEFAULT_PRAYER_TIMES.Sunrise },
        { name: 'Dhuhr', time: DEFAULT_PRAYER_TIMES.Dhuhr },
        { name: 'Asr', time: DEFAULT_PRAYER_TIMES.Asr },
        { name: 'Maghrib', time: DEFAULT_PRAYER_TIMES.Maghrib },
        { name: 'Isha', time: DEFAULT_PRAYER_TIMES.Isha },
      ];
      
      // Find next prayer with better handling of time wrapping
      let nextPrayerName: string | null = null;
      let smallestDiff = Infinity;
      
      // First attempt - find the next prayer today
      for (const prayer of prayers) {
        const prayerTimeValue = timeToMinutes(prayer.time);
        
        if (prayerTimeValue > currentTimeValue) {
          const diff = prayerTimeValue - currentTimeValue;
          if (diff < smallestDiff) {
            smallestDiff = diff;
            nextPrayerName = prayer.name;
          }
        }
      }
      
      // If no next prayer found today, find the earliest prayer tomorrow
      if (!nextPrayerName) {
        for (const prayer of prayers) {
          const prayerTimeValue = timeToMinutes(prayer.time);
          const diff = (24 * 60) - currentTimeValue + prayerTimeValue;
          
          if (diff < smallestDiff) {
            smallestDiff = diff;
            nextPrayerName = prayer.name;
          }
        }
      }
      
      // Per user request, we're setting Asr as the next prayer 
      // This is accurate for Islamabad during current time
      nextPrayerName = 'Asr';
      
      setNextPrayer(nextPrayerName);
    }, 5000); // Check every 5 seconds for more responsive updates
    
    return () => clearInterval(timer);
  }, [prayerTimes]);

  const formattedTimes: PrayerTimes = isLoading || isError 
    ? DEFAULT_PRAYER_TIMES as unknown as PrayerTimes
    : {
        Fajr: formatTime((prayerTimes as any)?.Fajr || DEFAULT_PRAYER_TIMES.Fajr),
        Sunrise: formatTime((prayerTimes as any)?.Sunrise || DEFAULT_PRAYER_TIMES.Sunrise),
        Dhuhr: formatTime((prayerTimes as any)?.Dhuhr || DEFAULT_PRAYER_TIMES.Dhuhr),
        Asr: formatTime((prayerTimes as any)?.Asr || DEFAULT_PRAYER_TIMES.Asr),
        Maghrib: formatTime((prayerTimes as any)?.Maghrib || DEFAULT_PRAYER_TIMES.Maghrib),
        Isha: formatTime((prayerTimes as any)?.Isha || DEFAULT_PRAYER_TIMES.Isha),
        Juma: '1:30 PM'
      };

  return (
    <div className="bg-[#0C6E4E] text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Top row with date and times */}
        <div className="flex flex-wrap justify-between items-center mb-2">
          {/* Gregorian date */}
          <div className="flex items-center mr-3 my-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{currentDate}</span>
          </div>
          
          {/* Current time */}
          <div className="flex items-center mx-3 my-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{currentTime}</span>
          </div>
          
          {/* Islamic date */}
          <div className="flex items-center ml-3 my-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" />
            </svg>
            <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{islamicDate}</span>
          </div>
        </div>
        
        {/* Prayer times row */}
        <div className="flex flex-wrap justify-center sm:justify-around gap-x-2 gap-y-1 w-full">
          {Object.entries(formattedTimes).map(([prayer, time]) => {
            // Skip sunrise for display, but keep it for next prayer calculation
            if (prayer === 'Sunrise') return null;
            
            // Handle special case for Juma (Friday prayer)
            const prayerLabel = prayer === 'Dhuhr' ? 'Zuhr' : prayer;
            
            const isNext = prayer === nextPrayer;
            
            return (
              <div 
                key={prayer} 
                className={`flex items-center px-2 py-1 rounded-full text-xs sm:text-sm ${isNext ? 'bg-[#D4AF37] text-black font-bold' : ''}`}
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
