
import React from 'react';

export const PreIslamicBackground = () => (
  <div className="relative w-full h-48 bg-[#8B4513] overflow-hidden rounded-lg shadow-md">
    <div className="absolute inset-0 opacity-30">
      <div className="h-full w-full bg-[repeating-linear-gradient(45deg,#8B4513,#8B4513_10px,#654321_10px,#654321_20px)]"></div>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-white text-opacity-20 text-6xl font-arabic">الجاهلية</span>
    </div>
  </div>
);

export const IslamicBackground = () => (
  <div className="relative w-full h-48 bg-[#0C6E4E] overflow-hidden rounded-lg shadow-md">
    <div className="absolute inset-0 opacity-30">
      <div className="h-full w-full bg-[repeating-radial-gradient(circle_at_0_0,transparent_0,#0C6E4E_40px),repeating-linear-gradient(#D4AF37,#0C6E4E)]"></div>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-white text-opacity-20 text-6xl font-arabic">الإسلام</span>
    </div>
  </div>
);
