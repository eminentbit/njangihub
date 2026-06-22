import Header from "./section.welcome.page/Header";
import Hero from "./section.welcome.page/Hero";
import Features from "./section.welcome.page/Features";
import HowItWorks from "./section.welcome.page/HowItWorks";
import Pricing from "./section.welcome.page/Pricing";
import Testimonials from "./section.welcome.page/Testimonials";
import FAQ from "./section.welcome.page/FAQ";
import CTA from "./section.welcome.page/CTA";
import Footer from "./section.welcome.page/Footer";
import { useEffect } from "react";
// import axios from "axios";
import { useAuthStore } from "./store/create.auth.store";
import axiosClient, { secureGet } from "./utils/axiosClient";

function App() {
  const { setUser, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await secureGet("/auth/session", {
          silent: true,
        });
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("An error occured", err);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, [setIsAuthenticated, setUser]);

  useEffect(() => {
    const preloadCsrfToken = async (): Promise<void> => {
      try {
        await axiosClient.get("/csrf-token", {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Failed to preload CSRF token", error);
      }
    };

    preloadCsrfToken();
  }, []);

  return (
    <div className="font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
