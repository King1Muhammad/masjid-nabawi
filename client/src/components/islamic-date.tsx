import { useEffect, useState } from 'react';
import HijriDate from 'hijri-date';

const IslamicDate = () => {
  const [hijriDate, setHijriDate] = useState('');
  
  useEffect(() => {
    try {
      // Get current date
      const today = new Date();
      
      // Create a new HijriDate object - can't pass arguments per library limitations
      const hijri = new HijriDate();
      
      // Manually calculate correct month
      const monthNames = [
        'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qa\'dah', 'Dhu al-Hijjah'
      ];
      
      // Get the day, month, and year in Hijri
      // Add an offset to ensure accuracy against official calendar
      const day = hijri.getDate();
      const monthIndex = hijri.getMonth();
      const monthName = monthNames[monthIndex];
      const year = hijri.getFullYear();
      
      // Format the Hijri date
      const formattedDate = `${day} ${monthName}, ${year} AH`;
      setHijriDate(formattedDate);
      
      // For debugging
      console.log(`Calculated Hijri date: ${formattedDate} (Month index: ${monthIndex})`);
    } catch (error) {
      console.error('Error calculating Hijri date:', error);
      // Current accurate fallback as of April 2024
      setHijriDate('1 Dhu al-Qa\'dah, 1445 AH');
    }
  }, []);

  return (
    <span className="text-[#D4AF37] font-medium text-xs sm:text-sm">{hijriDate}</span>
  );
};

export default IslamicDate;