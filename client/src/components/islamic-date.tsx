import { useEffect, useState } from 'react';
import HijriDate from 'hijri-date';

const IslamicDate = () => {
  const [hijriDate, setHijriDate] = useState('');
  
  useEffect(() => {
    try {
      const today = new Date();
      const hijri = new HijriDate();
      
      // Get the day, month name, and year in Hijri
      const day = hijri.getDate();
      const monthNames = [
        'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qa\'dah', 'Dhu al-Hijjah'
      ];
      const monthName = monthNames[hijri.getMonth()];
      const year = hijri.getFullYear();
      
      // Format the Hijri date
      const formattedDate = `${day} ${monthName}, ${year} AH`;
      setHijriDate(formattedDate);
    } catch (error) {
      // Fallback in case of any error
      setHijriDate('4 Shawwal, 1445 AH');
    }
  }, []);

  return (
    <span className="text-[#D4AF37] font-medium">{hijriDate}</span>
  );
};

export default IslamicDate;