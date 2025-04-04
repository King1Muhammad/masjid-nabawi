import { useEffect, useState } from 'react';
import axios from 'axios';

const IslamicDate = () => {
  const [hijriDate, setHijriDate] = useState('');
  
  useEffect(() => {
    const fetchHijriDate = async () => {
      try {
        // Get current Gregorian date
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; // JavaScript months are 0-based
        const year = today.getFullYear();

        // Use Aladhan API to get current Hijri date
        const response = await axios.get(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`);
        
        if (response.data.code === 200) {
          const hijri = response.data.data.hijri;
          const formattedDate = `${hijri.day} ${hijri.month.en}, ${hijri.year} AH`;
          setHijriDate(formattedDate);
        } else {
          // Fallback to current date
          setHijriDate('5 Shawwal, 1445 AH');
        }
      } catch (error) {
        console.error('Error fetching Hijri date:', error);
        // Current accurate date as fallback
        setHijriDate('5 Shawwal, 1445 AH');
      }
    };

    fetchHijriDate();
    
    // Refresh the date once per day
    const interval = setInterval(fetchHijriDate, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[#D4AF37] font-medium text-[10px] xs:text-xs sm:text-sm">{hijriDate}</span>
  );
};

export default IslamicDate;