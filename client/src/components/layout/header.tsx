import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import PrayerTimesTicker from '@/components/prayer-times-ticker';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const menuToggle = document.getElementById('menu-toggle');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (
        menuToggle && 
        mobileMenu && 
        !menuToggle.contains(event.target as Node) && 
        !mobileMenu.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 shadow-md bg-white transition-shadow duration-300", 
      scrolled ? "shadow-lg" : "shadow-md"
    )}>
      <PrayerTimesTicker />
      
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => window.location.href = "/"}>
            <div className="text-3xl font-heading text-[#0C6E4E]">
              <span className="font-arabic">جامع مسجد نبوی</span>
              <span className="text-sm block text-[#8D3333]">Jamia Masjid Nabvi Qureshi Hashmi</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <div 
              className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer", 
                location === "/" && "font-medium"
              )}
              onClick={() => window.location.href = "/"}
            >
              Home
            </div>
            <div 
              className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer", 
                location === "/history" && "font-medium"
              )}
              onClick={() => window.location.href = "/history"}
            >
              History
            </div>
            <div 
              className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer", 
                location === "/services" && "font-medium"
              )}
              onClick={() => window.location.href = "/services"}
            >
              Services
            </div>
            <div 
              className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer", 
                location === "/madrasa" && "font-medium"
              )}
              onClick={() => window.location.href = "/madrasa"}
            >
              Madrasa
            </div>
            <div 
              className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer", 
                location === "/community" && "font-medium"
              )}
              onClick={() => window.location.href = "/community"}
            >
              Community
            </div>
            <div 
              className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer", 
                location === "/contact" && "font-medium"
              )}
              onClick={() => window.location.href = "/contact"}
            >
              Contact
            </div>
            <div 
              className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer", 
                location === "/vision" && "font-medium"
              )}
              onClick={() => window.location.href = "/vision"}
            >
              Vision
            </div>
            <div 
              className="bg-[#D4AF37] hover:bg-opacity-90 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
              onClick={() => window.location.href = "/donate"}
            >
              Donate
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              id="menu-toggle" 
              className="text-[#0C6E4E] p-2"
              onClick={toggleMenu}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-6 h-6"
              >
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          id="mobile-menu" 
          className={cn(
            "md:hidden mt-4 bg-white rounded-lg shadow-lg absolute left-0 right-0 mx-4 z-50 transition-all duration-300 ease-in-out",
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          )}
        >
          <div className="flex flex-col py-2">
            <div 
              className="px-4 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/";
              }}
            >
              Home
            </div>
            <div 
              className="px-4 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/history";
              }}
            >
              History
            </div>
            <div 
              className="px-4 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/services";
              }}
            >
              Services
            </div>
            <div 
              className="px-4 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/madrasa";
              }}
            >
              Madrasa
            </div>
            <div 
              className="px-4 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/community";
              }}
            >
              Community
            </div>
            <div 
              className="px-4 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/contact";
              }}
            >
              Contact
            </div>
            <div 
              className="px-4 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/vision";
              }}
            >
              Vision & Mission
            </div>
            <div 
              className="bg-[#D4AF37] mx-4 my-2 text-center text-white px-4 py-2 rounded-md cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/donate";
              }}
            >
              Donate
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
