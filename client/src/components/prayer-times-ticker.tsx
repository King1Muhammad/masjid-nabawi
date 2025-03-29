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
  
  const { data: prayerTimes, isLoading, isError } = useQuery({
    queryKey: ['/api/prayer-times'],
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  useEffect(() => {
    // Calculate Islamic date (simplified example)
    const today = new Date();
    const islamicYear = 1445; // This would normally be calculated
    const islamicMonths = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
      'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
    ];
    const islamicMonth = islamicMonths[Math.floor(today.getMonth() % 12)];
    const islamicDay = (today.getDate() % 30) || 30;
    
    setIslamicDate(`${islamicDay} ${islamicMonth}, ${islamicYear}`);
  }, []);

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
    <div className="bg-[#0C6E4E] text-white py-1 overflow-hidden">
      <div className="flex items-center space-x-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd" />
          </svg>
          <span>Fajr: {formattedTimes.Fajr}</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd" />
          </svg>
          <span>Zuhr: {formattedTimes.Dhuhr}</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd" />
          </svg>
          <span>Asr: {formattedTimes.Asr}</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <span>Maghrib: {formattedTimes.Maghrib}</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <span>Isha: {formattedTimes.Isha}</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span>Friday Khutbah: {formattedTimes.Juma}</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span data-bind="islamicDate">{islamicDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesTicker;
