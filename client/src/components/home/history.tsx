import { TIMELINE_ITEMS } from '@/lib/constants';
import { Link } from 'wouter';

const History = () => {
  return (
    <section id="history" className="bg-[#0C6E4E] bg-opacity-5 py-16" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230C6E4E' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading text-[#0C6E4E] mb-4">Islamic Heritage & History</h2>
          <p className="max-w-3xl mx-auto">Exploring the rich history of Islam from pre-Islamic Arabia through the life of Prophet Muhammad ﷺ and the establishment of Masjid-e-Nabawi.</p>
        </div>
        
        <div className="flex overflow-x-auto pb-4 space-x-6 snap-x">
          {TIMELINE_ITEMS.map((item) => (
            <div key={item.id} className="min-w-[300px] max-w-[350px] snap-start bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading text-[#0C6E4E] mb-2">{item.title}</h3>
                <p className="text-sm mb-4">{item.description}</p>
                <div 
                  className="text-[#D4AF37] hover:underline inline-block cursor-pointer"
                  onClick={() => window.location.href = "/history"}
                >
                  Learn more 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <div 
            className="inline-block bg-[#0C6E4E] hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors cursor-pointer"
            onClick={() => window.location.href = "/history"}
          >
            Explore Full Timeline
          </div>
        </div>
      </div>
    </section>
  );
};

export default History;
