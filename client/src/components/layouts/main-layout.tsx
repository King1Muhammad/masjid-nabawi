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
        <div className="container flex justify-between items-center py-2">
          <div className="flex items-center">
            <IslamicDate />
          </div>
          <PrayerTimesTicker />
        </div>
      </div>
      
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container py-4">
          <nav className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              <Link href="/">
                جامعہ مسجد نبوی قریشی ہاشمی
              </Link>
            </div>
            
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </Button>
              
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ہوم
                </Button>
              </Link>
              
              <Link href="/madrasa">
                <Button variant="ghost" size="sm">
                  مدرسہ
                </Button>
              </Link>
              
              <Link href="/community">
                <Button variant="ghost" size="sm">
                  کمیونٹی
                </Button>
              </Link>
              
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  تاریخ
                </Button>
              </Link>
              
              <Link href="/payment">
                <Button variant="ghost" size="sm">
                  فیس جمع کریں
                </Button>
              </Link>
              
              <Link href="/donate">
                <Button variant="default" size="sm">
                  عطیہ کریں
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
      <footer className="bg-muted py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">مسجد نبوی قریشی ہاشمی</h3>
              <p className="text-muted-foreground">مسجد نبوی كے طرز پر سارے اعمال كا آغاز مسجد ھٰذا سے</p>
              <div className="space-y-2">
                <p className="text-sm">ہمیں یہاں ملیں: FGEHF D Block G-11/4 Islamabad</p>
                <p className="text-sm">فون: +92 334 9214600</p>
                <p className="text-sm">ای میل: admin@masjidenabawismodel.com</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold">لنکس</h3>
              <div className="space-y-2">
                <Link href="/history">
                  <span className="block text-muted-foreground hover:text-foreground">تاریخ</span>
                </Link>
                <Link href="/madrasa">
                  <span className="block text-muted-foreground hover:text-foreground">مدرسہ</span>
                </Link>
                <Link href="/community">
                  <span className="block text-muted-foreground hover:text-foreground">کمیونٹی</span>
                </Link>
                <Link href="/payment">
                  <span className="block text-muted-foreground hover:text-foreground">فیس جمع کریں</span>
                </Link>
                <Link href="/donate">
                  <span className="block text-muted-foreground hover:text-foreground">عطیہ دیں</span>
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold">مسجد کے اوقات</h3>
              <div className="space-y-2">
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
          
          <div className="mt-8 pt-6 border-t">
            <p className="text-center text-muted-foreground">
              © {new Date().getFullYear()} جامعہ مسجد نبوی قریشی ہاشمی - تمام حقوق محفوظ ہیں
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;