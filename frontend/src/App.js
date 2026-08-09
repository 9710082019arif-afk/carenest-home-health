import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "@/App.css";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import LocationDetail from "@/pages/LocationDetail";
import Locations from "@/pages/Locations";
import CityService from "@/pages/CityService";
import Legal from "@/pages/Legal";
import { AdminLogin, AdminDashboard } from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import AnalyticsLoader from "@/components/AnalyticsLoader";
import { PAGE_REDIRECTS } from "@/data/redirects";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnalyticsLoader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:slug" element={<LocationDetail />} />
        <Route path="/locations/:city/:slug" element={<CityService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<Legal slug="privacy-policy" />} />
        <Route path="/terms" element={<Legal slug="terms" />} />
        <Route path="/refund-policy" element={<Legal slug="refund-policy" />} />
        <Route path="/cancellation-policy" element={<Legal slug="cancellation-policy" />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {Object.entries(PAGE_REDIRECTS).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
