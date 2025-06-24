"use client";

import { useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FeaturedCars from "@/components/featured-cars";
import Hero from "@/components/hero";
import GetInTouch from "@/components/GetInTouch";
import WhyChooseUs from "@/components/WhyChooseUs";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  const { verifyToken } = useAuth();

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedCars />
        <GetInTouch />
        <WhyChooseUs />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
