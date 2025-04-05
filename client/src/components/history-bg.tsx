
import React from 'react';
import preIslamicImage from '@assets/pre islamic arabia beti.webp';
import islamicImage from '@assets/DALL·E 2025-04-05 00.40.25 - A symbolic image representing the themes of monotheism, justice, education, and unity. The scene features an open Quran at the center, surrounded by r.webp';

export const PreIslamicBackground = () => (
  <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-md">
    <img src={preIslamicImage} alt="Pre-Islamic Arabia" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <span className="text-white text-opacity-80 text-6xl font-arabic">الجاهلية</span>
    </div>
  </div>
);

export const IslamicBackground = () => (
  <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-md">
    <img src={islamicImage} alt="Islamic Era" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <span className="text-white text-opacity-80 text-6xl font-arabic">الإسلام</span>
    </div>
  </div>
);
