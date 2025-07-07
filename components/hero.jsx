"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const carBanners = (process.env.NEXT_PUBLIC_CAR_BANNERS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev === carBanners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === carBanners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? carBanners.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full h-screen overflow-hidden mt-[120px]">
      {/* Background Images Slider */}
      <div className="absolute inset-0 z-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {carBanners.map((src, index) => (
          <div key={index} className="min-w-full h-full relative">
            <Image
              src={src || "/placeholder.svg"}
              alt={`Luxury car ${index + 1}`}
              fill
              className="object-cover w-full h-full"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
              <span className="px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full text-emerald-100 text-sm font-medium border border-emerald-400/30 inline-block">
                Premium Collection
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Find Your
                <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
                  Dream Car
                </span>
              </h1>
              <p className="text-xl text-emerald-100 max-w-2xl leading-relaxed">
                Discover exceptional luxury vehicles curated for the discerning driver. 
                Experience excellence in every detail.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                <Link href="/cars">Explore Collection</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full font-semibold transition-all"
              >
                <Link href="/contact">Contact Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-3">
          {carBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="group"
            >
              <div className={`h-1 rounded-full transition-all duration-500 ${
                i === current 
                  ? "w-12 bg-gradient-to-r from-emerald-400 to-teal-300" 
                  : "w-6 bg-white/40 hover:bg-white/60"
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Auto-play Control */}
      <div className="absolute bottom-8 right-8 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
        >
          <Play className={`h-4 w-4 transition-transform duration-300 ${isAutoPlaying ? 'rotate-0' : 'rotate-90'}`} />
        </Button>
      </div>
    </section>
  );
}
