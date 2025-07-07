"use client";

import { useAuth } from "@/Context/AuthContext";
import { useEffect } from "react";
import Navbar from "./navbar";
import GetInTouch from "./GetInTouch";
import Hero from "./hero";
import FeaturedCars from "./featured-cars";
import CallToAction from "./CallToAction";
import WhyChooseUs from "./WhyChooseUs";
import Footer from "./footer";


export default function HomeContent() {
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
