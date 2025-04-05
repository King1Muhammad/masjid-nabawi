import React, { useEffect } from 'react';
import { Link } from 'wouter';

// Import images
import founderImage from '../assets/molana abdul ghaffar qureshi.jpg';
import imamImage from '../assets/Muhammad qureshi imam and nazim e Ala.jpg';
import naibImamImage from '../assets/Naib Imam and Nazim e Kharija .jpg';
import hamidImage from '../assets/Imam and nazim e dakhila Hamid Qureshi.png';
import chairmanImage from '../assets/chairman.png';

const AboutPage = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center bg-[#0C6E4E]">
        <div className="absolute inset-0 z-0 opacity-20 bg-pattern-light">
          {/* Pattern background */}
        </div>
        <div className="container mx-auto px-4 z-10 text-center py-20">
          <h1 className="text-4xl md:text-6xl font-heading text-white mb-6">
            About <span className="text-[#D4AF37]">Masjid Nabvi</span> Qureshi Hashmi
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            مسجد نبوی كے طرز پر سارے اعمال كا آغاز مسجد ھٰذا سے
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-heading text-[#0C6E4E] mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                The mission of Masjid Nabvi Qureshi Hashmi is to replicate the Riasat e Madina's model created by Prophet Muhammad (S.A.W). Our goal is to create a center for community that integrates worship, education, governance, social welfare, and economic activities into a unified system.
              </p>
              <p className="text-gray-700 mb-4">
                We believe that masajids should serve as capitals for their societies, just as countries have their own capitals. This private masjid is run entirely by volunteers and is situated in G11/4 Islamabad, with all necessary building approvals from the CDA.
              </p>
              <p className="text-gray-700">
                Construction is ongoing, and the community has an opportunity to contribute to this noble cause that aims to transform society through the proven model of Masjid-e-Nabawi.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-heading text-[#0C6E4E] mb-6">Our Vision</h2>
              <p className="text-gray-700 mb-4">
                Two 25-year-old friends are on a mission to revolutionize the world's educational, political, and all systems by connecting societies with their centers. They are creating a platform to connect societies with their centers and provide a self-governance system with live-tracking, transparent accounts, and a voting system.
              </p>
              <p className="text-gray-700 mb-4">
                The long-term plan is to address global issues such as climate change, inequality, and the lack of access to education and healthcare. Our vision extends beyond a single community to transform societies worldwide through this proven model of governance and social harmony.
              </p>
              <p className="text-gray-700">
                Their ultimate goal is to build a free nation inspired by the model of Masjid e Nabawi, creating a system that works for everyone, not just the privileged few.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-12 text-center">Our Leadership</h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Founder */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img src={founderImage} alt="Molana Abdul Ghaffar Qureshi" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="text-2xl font-bold text-[#0C6E4E] mb-2">Molana Abdul Ghaffar Qureshi</h3>
                  <p className="text-[#D4AF37] font-semibold mb-4">Founder & Vice Chairman</p>
                  <p className="text-gray-700 mb-4">
                    Molana Abdul Ghaffar Qureshi is the visionary founder of Masjid Nabvi Qureshi Hashmi. A retired government officer, he has dedicated his life to creating a model Islamic center based on the principles of Masjid-e-Nabawi.
                  </p>
                  <p className="text-gray-700">
                    His deep knowledge of Islamic history and governance has been instrumental in shaping the mission and vision of this masjid. As the Imam and Khateeb, he leads the community in prayer and provides spiritual guidance.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Chairman */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img src={chairmanImage} alt="Haji Ghulam Yasin" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="text-2xl font-bold text-[#0C6E4E] mb-2">Haji Ghulam Yasin</h3>
                  <p className="text-[#D4AF37] font-semibold mb-4">Chairman, Intzamia Committee</p>
                  <p className="text-gray-700 mb-4">
                    Haji Ghulam Yasin serves as the Chairman of the Intzamia Committee of Masjid Nabvi Qureshi Hashmi. A retired government officer with extensive administrative experience, he oversees the operational aspects of the masjid.
                  </p>
                  <p className="text-gray-700">
                    His leadership ensures the masjid functions efficiently and stays true to its mission of replicating the Masjid-e-Nabawi model. He is deeply committed to establishing transparent governance and fostering community development.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-[#0C6E4E] mb-8 text-center">Masjid Administration</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Muhammad Qureshi */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-64 mb-4 rounded-md overflow-hidden">
                <img src={imamImage} alt="Muhammad Qureshi" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xl font-bold text-[#0C6E4E] mb-2">Muhammad Qureshi</h4>
              <p className="text-[#D4AF37] font-semibold mb-3">Imam & Nazim-e-Ala</p>
              <p className="text-gray-700">
                Muhammad Qureshi serves as the Imam and Chief Administrator (Nazim-e-Ala) of Masjid Nabvi Qureshi Hashmi. His leadership in daily prayers and administrative matters helps maintain the spiritual and operational integrity of the masjid.
              </p>
            </div>
            
            {/* Ahmed Qureshi */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-64 mb-4 rounded-md overflow-hidden">
                <img src={naibImamImage} alt="Ahmed Qureshi" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xl font-bold text-[#0C6E4E] mb-2">Ahmed Qureshi</h4>
              <p className="text-[#D4AF37] font-semibold mb-3">Naib Imam & Nazim-e-Kharija</p>
              <p className="text-gray-700">
                Ahmed Qureshi serves as the Deputy Imam and External Affairs Administrator. He manages the masjid's relations with the broader community and oversees outreach programs that extend the masjid's influence beyond its walls.
              </p>
            </div>
            
            {/* Hamid Qureshi */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-64 mb-4 rounded-md overflow-hidden">
                <img src={hamidImage} alt="Hamid Qureshi" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xl font-bold text-[#0C6E4E] mb-2">Hamid Qureshi</h4>
              <p className="text-[#D4AF37] font-semibold mb-3">Imam & Nazim-e-Dakhila</p>
              <p className="text-gray-700">
                Hamid Qureshi serves as an Imam and Internal Affairs Administrator. He manages the day-to-day operations within the masjid, ensuring that all internal systems and services run smoothly for the benefit of worshippers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Masjid's Role Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-8 text-center">The Multi-Faceted Role of Our Masjid</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
            Masjid Nabvi Qureshi Hashmi serves as more than just a place of worship; it is a dynamic hub for the Muslim community with multiple roles.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#0C6E4E] text-white flex items-center justify-center rounded-full mb-6 text-2xl">
                <i className="fas fa-pray"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-3">House of Worship</h3>
              <p className="text-gray-700">
                At its core, our masjid is dedicated to worship, providing a sacred space for Muslims to establish a connection with Allah. We host the five daily prayers and the Jumu'ah (Friday) congregational prayer, nurturing spiritual growth and devotion.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#0C6E4E] text-white flex items-center justify-center rounded-full mb-6 text-2xl">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-3">Community Center</h3>
              <p className="text-gray-700">
                Our masjid acts as a vibrant community center, serving as a gathering place for Muslims. We host a wide range of social events, educational programs, and cultural activities that create a sense of unity, solidarity, and belonging among community members.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#0C6E4E] text-white flex items-center justify-center rounded-full mb-6 text-2xl">
                <i className="fas fa-book-open"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-3">Education Hub</h3>
              <p className="text-gray-700">
                We serve as an educational hub, offering a diverse curriculum that includes Quranic studies, Islamic jurisprudence, and the life of Prophet Muhammad. By providing access to Islamic knowledge, we empower individuals to live in accordance with Islamic principles and values.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#0C6E4E] text-white flex items-center justify-center rounded-full mb-6 text-2xl">
                <i className="fas fa-hands-helping"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-3">Guidance and Counseling</h3>
              <p className="text-gray-700">
                Our spiritual leaders, including Imams and scholars, offer guidance, counseling, and support to community members in times of spiritual or personal need. They serve as mentors and sources of inspiration, helping individuals navigate life's challenges.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#0C6E4E] text-white flex items-center justify-center rounded-full mb-6 text-2xl">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-3">Charitable Activities</h3>
              <p className="text-gray-700">
                We are actively involved in charitable activities, reflecting the compassionate teachings of Islam. We distribute food to the needy, provide financial assistance to those facing hardship, and support various social welfare initiatives that uphold Islamic principles.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#0C6E4E] text-white flex items-center justify-center rounded-full mb-6 text-2xl">
                <i className="fas fa-balance-scale"></i>
              </div>
              <h3 className="text-xl font-bold text-[#0C6E4E] mb-3">Governance Model</h3>
              <p className="text-gray-700">
                Following the precedent set by Masjid-e-Nabawi in Madina, our masjid serves as a hub for transparent governance and community decision-making. We implement systems for fair dispute resolution and community consultation on important matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-8 text-center">Our Inspiration: The Transformation Through Islam</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <h3 className="text-2xl font-bold text-[#0C6E4E] mb-4">Before and After Islam</h3>
            <p className="text-gray-700 mb-4">
              The advent of Islam heralded a transformative era in human history, reshaping societies, values, and moral principles. Before Islam, various regions, including Arabia, were characterized by tribalism, idol worship, and social injustices. In contrast, the message of Islam, brought by Prophet Muhammad, ushered in a new era of monotheism, justice, education, and a sense of purpose.
            </p>
            <p className="text-gray-700">
              After Islam, society was transformed with the introduction of monotheism and unity, justice and moral values, empowerment of women, education and knowledge, and guidance and purpose. This transformation continues to inspire our masjid as we work to create positive change in our modern world.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-[#0C6E4E] mb-4">Prophet Muhammad's Vision: Building a Nation from Masjid e Nabawi</h3>
            <p className="text-gray-700 mb-4">
              The migration of Prophet Muhammad (peace be upon him) to Madina in 622 CE marked a pivotal moment in history. In Madina, the Prophet's leadership and vision laid the foundation for a strong sense of community and brotherhood, establishing a model that continues to inspire societies around the globe.
            </p>
            <p className="text-gray-700 mb-4">
              One of the Prophet's first acts in Madina was the signing of the Constitution of Madina, which outlined the rights and responsibilities of all citizens, irrespective of their religion or tribal affiliations. This historic document established a framework for a pluralistic society.
            </p>
            <p className="text-gray-700">
              Prophet Muhammad designated Masjid e Nabawi as the spiritual and administrative heart of the nascent Islamic state. It served as more than just a place of worship; it became a hub for decision-making, discussions, and community gatherings. This integrated model of governance, education, and community welfare is what we strive to recreate at Masjid Nabvi Qureshi Hashmi.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0C6E4E] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Join Us in This Noble Mission</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Contribute to building a masjid that serves as a center for worship, education, community service, and societal transformation</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <div className="inline-block bg-[#D4AF37] text-white px-8 py-4 rounded-md hover:bg-opacity-90 transition-colors font-bold text-lg">
                Support Our Cause
              </div>
            </Link>
            <Link href="/contact">
              <div className="inline-block bg-white text-[#0C6E4E] px-8 py-4 rounded-md hover:bg-opacity-90 transition-colors font-bold text-lg">
                Get Involved
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;