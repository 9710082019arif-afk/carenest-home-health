import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/App.css";
import { ThemeProvider } from "@/lib/theme";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import BookAppointment from "@/pages/BookAppointment";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Gallery from "@/pages/Gallery";
import Testimonials from "@/pages/Testimonials";
import Blog from "@/pages/Blog";
import Careers from "@/pages/Careers";
import LocationDetail from "@/pages/LocationDetail";
import CityService from "@/pages/CityService";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";
import AnalyticsLoader from "@/components/AnalyticsLoader";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AnalyticsLoader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/locations/:slug" element={<LocationDetail />} />
          <Route path="/locations/:city/:slug" element={<CityService />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy-policy" element={<Legal slug="privacy-policy" />} />
          <Route path="/terms" element={<Legal slug="terms" />} />
          <Route path="/refund-policy" element={<Legal slug="refund-policy" />} />
          <Route path="/cancellation-policy" element={<Legal slug="cancellation-policy" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
