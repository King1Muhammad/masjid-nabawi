import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import HistoryPage from "@/pages/history-page-new";
import ServicesPage from "@/pages/services-page";
import MadrasaPage from "@/pages/madrasa-page";
import DonationPage from "@/pages/donation-page";
import CommunityPage from "@/pages/community-page";
import ContactPage from "@/pages/contact-page";
import VisionPage from "@/pages/vision-page";
import PlatformPage from "@/pages/platform-page";
import AboutPage from "@/pages/about-page";
import Checkout from "@/pages/checkout";
import DonationSuccess from "@/pages/donation-success";
import AdminPanel from "@/pages/admin-panel";
import AdminAuthPage from "@/pages/admin-auth-page";
import PaymentPage from "@/pages/payment-page";

function Router() {
  const [location] = useLocation();
  
  return (
    <>
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/history" component={HistoryPage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/madrasa" component={MadrasaPage} />
          <Route path="/donate" component={DonationPage} />
          <Route path="/donate/checkout" component={Checkout} />
          <Route path="/donate/success" component={DonationSuccess} />
          <Route path="/community" component={CommunityPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/vision" component={VisionPage} />
          <Route path="/platform" component={PlatformPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/admin/auth" component={AdminAuthPage} />
          <Route path="/payment" component={PaymentPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
