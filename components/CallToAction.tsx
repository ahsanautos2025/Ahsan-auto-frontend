"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Car } from "lucide-react"

export default function CallToAction() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Parallax Effect */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d"
          alt="Luxury Sports Car"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/80 to-teal-900/90 backdrop-blur-md" />

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-3 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 rounded-full text-sm font-medium border border-emerald-400/30 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Start Your Journey
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Ready to Drive Your
            <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
              Dream Car?
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-emerald-100 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Explore our exclusive collection of premium vehicles or connect with our experts to find the perfect luxury
            car tailored to your lifestyle.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 group"
            >
              <Link href="/cars" className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                View All Vehicles
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-emerald-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm">Premium Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm">Expert Consultation Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm">Transparent Pricing</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
