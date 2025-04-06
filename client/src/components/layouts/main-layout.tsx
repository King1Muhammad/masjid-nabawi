import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PrayerTimesTicker from "@/components/prayer-times-ticker";
import IslamicDate from "@/components/islamic-date";
import { SunIcon, MoonIcon } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    // Check if the user prefers dark mode
    const isDarkMode = localStorage.getItem("theme") === "dark";
    setDarkMode(isDarkMode);
    
    // Apply theme to the document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    
    // Apply theme to the document
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Prayer Times Ticker */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-3 md:px-4 flex flex-col md:flex-row justify-between items-center py-2 gap-2 md:gap-0 text-xs md:text-sm">
          <div className="flex items-center">
            <IslamicDate />
          </div>
          <PrayerTimesTicker />
        </div>
      </div>
      
      {/* Header */}
      <header className="bg-background border-b w-full">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <nav className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl md:text-2xl font-bold mb-2 md:mb-0 text-center md:text-right w-full md:w-auto">
              <Link href="/">
                جامعہ مسجد نبوی قریشی ہاشمی
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-1 w-full md:w-auto">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="px-2 py-1">
                {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              </Button>
              
              <Link href="/">
                <Button variant="ghost" size="sm" className="px-2 py-1 text-xs md:text-sm">
                  ہوم
                </Button>
              </Link>
              
              <Link href="/madrasa">
                <Button variant="ghost" size="sm" className="px-2 py-1 text-xs md:text-sm">
                  مدرسہ
                </Button>
              </Link>
              
              <Link href="/community">
                <Button variant="ghost" size="sm" className="px-2 py-1 text-xs md:text-sm">
                  کمیونٹی
                </Button>
              </Link>
              
              <Link href="/history">
                <Button variant="ghost" size="sm" className="px-2 py-1 text-xs md:text-sm">
                  تاریخ
                </Button>
              </Link>
              
              <Link href="/payment">
                <Button variant="ghost" size="sm" className="px-2 py-1 text-xs md:text-sm">
                  فیس
                </Button>
              </Link>
              
              <Link href="/donate">
                <Button variant="default" size="sm" className="px-2 py-1 text-xs md:text-sm">
                  عطیہ
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-6 md:py-8 w-full">
        <div className="container mx-auto px-3 md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="space-y-3 md:space-y-4 text-center md:text-right">
              <h3 className="text-base md:text-lg font-bold">مسجد نبوی قریشی ہاشمی</h3>
              <p className="text-muted-foreground text-sm">مسجد نبوی كے طرز پر سارے اعمال كا آغاز مسجد ھٰذا سے</p>
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm">ہمیں یہاں ملیں: FGEHF D Block G-11/4 Islamabad</p>
                <p className="text-xs md:text-sm">فون: +92 334 9214600</p>
                <p className="text-xs md:text-sm">ای میل: admin@masjidenabawismodel.com</p>
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4 text-center md:text-right">
              <h3 className="text-base md:text-lg font-bold">لنکس</h3>
              <div className="space-y-1 md:space-y-2">
                <Link href="/history">
                  <span className="block text-muted-foreground hover:text-foreground text-xs md:text-sm">تاریخ</span>
                </Link>
                <Link href="/madrasa">
                  <span className="block text-muted-foreground hover:text-foreground text-xs md:text-sm">مدرسہ</span>
                </Link>
                <Link href="/community">
                  <span className="block text-muted-foreground hover:text-foreground text-xs md:text-sm">کمیونٹی</span>
                </Link>
                <Link href="/payment">
                  <span className="block text-muted-foreground hover:text-foreground text-xs md:text-sm">فیس جمع کریں</span>
                </Link>
                <Link href="/donate">
                  <span className="block text-muted-foreground hover:text-foreground text-xs md:text-sm">عطیہ دیں</span>
                </Link>
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4 text-center md:text-right">
              <h3 className="text-base md:text-lg font-bold">مسجد کے اوقات</h3>
              <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span>فجر</span>
                  <span>4:25 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>ظہر</span>
                  <span>12:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>جمعہ</span>
                  <span>1:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>عصر</span>
                  <span>4:45 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>مغرب</span>
                  <span>سورج ڈوبنے کے وقت</span>
                </div>
                <div className="flex justify-between">
                  <span>عشاء</span>
                  <span>8:00 PM</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
            <p className="text-center text-muted-foreground text-xs md:text-sm">
              © {new Date().getFullYear()} جامعہ مسجد نبوی قریشی ہاشمی - تمام حقوق محفوظ ہیں
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;