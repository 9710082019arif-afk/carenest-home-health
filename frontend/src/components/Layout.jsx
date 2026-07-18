import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";
import { Toaster } from "sonner";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-[100px] md:pt-[112px]">{children}</main>
      <Footer />
      <FloatingActions />
      <Toaster position="top-center" richColors closeButton theme="system" />
    </div>
  );
};

export default Layout;
