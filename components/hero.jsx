"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const carBanners = [
  process.env.NEXT_PUBLIC_CAR_BANNER_1,
  process.env.NEXT_PUBLIC_CAR_BANNER_2,
  process.env.NEXT_PUBLIC_CAR_BANNER_3,
].filter(Boolean);

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
      {/* Background Images with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {carBanners.map((src, index) => (
            index === current && (
              <motion.div
                key={index}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Luxury car ${index + 1}`}
                  width={0}
                  height={0}
                  priority={index === 0}
                  className="w-[100%] h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-emerald-800/60 to-transparent" />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="inline-block"
                >
                  <span className="px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full text-emerald-100 text-sm font-medium border border-emerald-400/30">
                    Premium Collection
                  </span>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="text-5xl md:text-7xl font-bold text-white leading-tight"
                >
                  Find Your
                  <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
                    Dream Car
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="text-xl text-emerald-100 max-w-2xl leading-relaxed"
                >
                  Discover exceptional luxury vehicles curated for the discerning driver. 
                  Experience excellence in every detail.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/cars">
                    Explore Collection
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full font-semibold transition-all duration-300"
                >
                  <Link href="/contact">
                    Contact Expert
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Elegant Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-3">
          {carBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="group relative"
            >
              <div className={`h-1 rounded-full transition-all duration-500 ${
                i === current 
                  ? "w-12 bg-gradient-to-r from-emerald-400 to-teal-300" 
                  : "w-6 bg-white/40 hover:bg-white/60"
              }`} />
              {i === current && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full shadow-lg"
                />
              )}
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
