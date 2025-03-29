import Hero from '@/components/home/hero';
import History from '@/components/home/history';
import Services from '@/components/home/services';
import Madrasa from '@/components/home/madrasa';
import DonationSection from '@/components/home/donation';
import Community from '@/components/home/community';
import Contact from '@/components/home/contact';

const Home = () => {
  return (
    <>
      <Hero />
      <History />
      <Services />
      <Madrasa />
      <DonationSection />
      <Community />
      <Contact />
    </>
  );
};

export default Home;
