import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";
import { Toaster } from "sonner";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-background text-foreground pb-mobile-cta">
      <Header />
      <main className="pt-[68px] md:pt-[76px]">{children}</main>
      <Footer />
      <FloatingActions />
      <Toaster position="top-center" richColors closeButton theme="light" />
    </div>
  );
};

export default Layout;
