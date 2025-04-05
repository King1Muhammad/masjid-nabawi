import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { Switch, Route } from "wouter";

// Pages
import HomePage from "./pages/home";
import HistoryPage from "./pages/history-page";
import VisionsPage from "./pages/vision-page";
import CommunityPage from "./pages/community-page";
import MadrasaPage from "./pages/madrasa-page";
import DonationPage from "./pages/donation-page";
import ContactPage from "./pages/contact-page";
import ServicesPage from "./pages/services-page";
import CheckoutPage from "./pages/checkout";
import DonationSuccessPage from "./pages/donation-success";
import GlobalReformPage from "./pages/global-reform-page";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="masjid-nabvi-theme">
        <main className="min-h-screen">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/about" component={HomePage} />
            <Route path="/history" component={HistoryPage} />
            <Route path="/vision" component={VisionsPage} />
            <Route path="/community" component={CommunityPage} />
            <Route path="/madrasa" component={MadrasaPage} />
            <Route path="/donate" component={DonationPage} />
            <Route path="/donate/success" component={DonationSuccessPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/global-reform" component={GlobalReformPage} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </main>
      </ThemeProvider>
    </QueryClientProvider>
  );
}