import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PRAYER_TIMES } from '@/lib/constants';
import IslamicDate from './islamic-date';

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
  // No need for islamicDate state since we're using IslamicDate component
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  
  const { data: prayerTimes, isLoading, isError } = useQuery<PrayerTimes>({
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
  
  // Import the IslamicDate component to handle the Hijri date
  // This has been moved to a separate component that uses the API

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
      
      // Use the data from API or fall back to constants if API call failed
      const prayers = [
        { name: 'Fajr', time: (prayerTimes as PrayerTimes)?.Fajr || DEFAULT_PRAYER_TIMES.Fajr },
        { name: 'Sunrise', time: (prayerTimes as PrayerTimes)?.Sunrise || DEFAULT_PRAYER_TIMES.Sunrise },
        { name: 'Dhuhr', time: (prayerTimes as PrayerTimes)?.Dhuhr || DEFAULT_PRAYER_TIMES.Dhuhr },
        { name: 'Asr', time: (prayerTimes as PrayerTimes)?.Asr || DEFAULT_PRAYER_TIMES.Asr },
        { name: 'Maghrib', time: (prayerTimes as PrayerTimes)?.Maghrib || DEFAULT_PRAYER_TIMES.Maghrib },
        { name: 'Isha', time: (prayerTimes as PrayerTimes)?.Isha || DEFAULT_PRAYER_TIMES.Isha },
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
      
      // Use the actual next prayer based on calculations
      // This will automatically update as time passes
      
      setNextPrayer(nextPrayerName);
    }, 5000); // Check every 5 seconds for more responsive updates
    
    return () => clearInterval(timer);
  }, [prayerTimes]);

  const formattedTimes: PrayerTimes = isLoading || isError 
    ? DEFAULT_PRAYER_TIMES as unknown as PrayerTimes
    : {
        Fajr: formatTime((prayerTimes as PrayerTimes)?.Fajr || DEFAULT_PRAYER_TIMES.Fajr),
        Sunrise: formatTime((prayerTimes as PrayerTimes)?.Sunrise || DEFAULT_PRAYER_TIMES.Sunrise),
        Dhuhr: formatTime((prayerTimes as PrayerTimes)?.Dhuhr || DEFAULT_PRAYER_TIMES.Dhuhr),
        Asr: formatTime((prayerTimes as PrayerTimes)?.Asr || DEFAULT_PRAYER_TIMES.Asr),
        Maghrib: formatTime((prayerTimes as PrayerTimes)?.Maghrib || DEFAULT_PRAYER_TIMES.Maghrib),
        Isha: formatTime((prayerTimes as PrayerTimes)?.Isha || DEFAULT_PRAYER_TIMES.Isha),
        Juma: '1:30 PM'
      };

  return (
    <div className="bg-[#0C6E4E] text-white py-1 overflow-hidden">
      <div className="container mx-auto px-2">
        {/* Mobile layout with two rows */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-1">
          {/* Top row for mobile, left section for desktop: Dates */}
          <div className="flex items-center justify-between sm:justify-start sm:space-x-4 w-full sm:w-auto">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-[10px] xs:text-xs whitespace-nowrap">{currentDate}</span>
            </div>
            
            <div className="flex items-center sm:mx-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" />
              </svg>
              <IslamicDate />
            </div>
            
            {/* Current time - moved to top row on mobile */}
            <div className="flex items-center sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-[10px] xs:text-xs whitespace-nowrap">{currentTime}</span>
            </div>
          </div>
          
          {/* Bottom row for mobile with scrollable prayer times */}
          <div className="w-full sm:w-auto flex items-center justify-between">
            {/* Scrollable prayer times - better for mobile */}
            <div className="flex-1 flex items-center overflow-x-auto scrollbar-hide gap-x-2 md:gap-x-3 py-1 sm:py-0 sm:justify-center">
              {Object.entries(formattedTimes).map(([prayer, time]) => {
                // Skip sunrise for display, but keep it for next prayer calculation
                if (prayer === 'Sunrise') return null;
                
                // Handle special case for Juma (Friday prayer)
                const prayerLabel = prayer === 'Dhuhr' ? 'Zuhr' : prayer;
                
                const isNext = prayer === nextPrayer;
                
                return (
                  <div 
                    key={prayer} 
                    className={`flex items-center px-1 xs:px-2 py-0.5 rounded-sm text-[10px] xs:text-xs whitespace-nowrap flex-shrink-0 ${isNext ? 'bg-[#D4AF37] text-black font-bold' : ''}`}
                  >
                    <span>{prayerLabel}: {time}</span>
                    {isNext && (
                      <span className="ml-1 text-[8px] xs:text-[9px]">
                        (Next)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Current time - desktop only */}
            <div className="hidden sm:flex items-center ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-[10px] xs:text-xs whitespace-nowrap">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesTicker;
