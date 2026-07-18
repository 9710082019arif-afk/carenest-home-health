import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Layout>
    <section className="container-lux py-32 text-center">
      <div className="overline text-accent">404</div>
      <h1 className="font-serif text-5xl md:text-6xl mt-4">This page has moved on.</h1>
      <p className="text-muted-foreground mt-4 max-w-lg mx-auto font-light">The page you're looking for doesn't exist. Head back home, or WhatsApp us at +91 9175724546.</p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link to="/" className="btn-primary">Back to home</Link>
        <Link to="/services" className="btn-outline">Browse services</Link>
      </div>
    </section>
  </Layout>
);

export default NotFound;
