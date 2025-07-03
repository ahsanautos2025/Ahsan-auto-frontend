"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Award, Users, Star, Target, Heart, Shield, Sparkles, ArrowRight, Car, Trophy } from "lucide-react"
import { useSettings } from "@/Context/SettingsContext"

export default function AboutPage() {
  const { settings } = useSettings()
  const stats = settings?.stats || []

  const values = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "We are committed to excellence in every aspect of our business, from the vehicles we select to the service we provide.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Integrity",
      description: "We operate with complete transparency and honesty, building lasting relationships based on trust and mutual respect.",
      color: "from-emerald-600 to-emerald-700",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Innovation",
      description: "We embrace innovation and continuously seek new ways to enhance the customer experience and exceed expectations.",
      color: "from-teal-500 to-emerald-600",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 mt-[120px]">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="relative h-[60vh] w-full">
            <Image
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43"
              alt="Luxury car showroom"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/70 to-teal-900/90" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <div className="max-w-4xl">
                <div className="inline-block mb-6">
                  <span className="px-6 py-3 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 rounded-full text-sm font-medium border border-emerald-400/30">
                    Our Story
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  About
                  <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
                    LuxuryCars
                  </span>
                </h1>
                <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                  Delivering exceptional luxury vehicles and unparalleled service since 2005
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <div
                key={stat._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
              >
                <div className="inline-flex p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-white mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  Our Journey
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Crafting Excellence Since
                <span className="block text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                  2005
                </span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2005, LuxuryCars began with a simple yet ambitious vision: to provide discerning clients
                  with the finest luxury vehicles and an unparalleled buying experience.
                </p>
                <p>
                  Our founder believed that purchasing a luxury vehicle should be as exceptional as the car itself. This
                  philosophy guides everything we do.
                </p>
                <p>
                  Today, LuxuryCars proudly offers a carefully selected collection of vehicles that combine performance,
                  craftsmanship, and innovation.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/cars" className="flex items-center gap-2">
                    Explore Our Collection
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2"
                alt="Showroom"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Our Mission</div>
                    <div className="text-sm text-gray-600">Excellence in every detail</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  Our Foundation
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Values That
                <span className="block text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                  Drive Us
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                These core principles guide every decision we make and every relationship we build.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${value.color} text-white mb-6 shadow-lg`}
                  >
                    {value.icon}
                  </div>
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-teal-900">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
              alt="Luxury car background"
              fill
              className="object-cover opacity-20"
            />
          </div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-block mb-6">
                <span className="px-6 py-3 bg-emerald-500/20 text-emerald-200 rounded-full text-sm font-medium border border-emerald-400/30">
                  <Heart className="h-4 w-4 inline-block mr-1" />
                  Experience Excellence
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Experience the
                <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
                  LuxuryCars Difference
                </span>
              </h2>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                Visit our showroom today and discover why we're the preferred choice for luxury car enthusiasts
                worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold shadow-xl">
                  <Link href="/cars">
                    <Car className="h-5 w-5 mr-2" />
                    Browse Our Inventory
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="border-2 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/10 hover:border-emerald-400 px-8 py-4 rounded-full font-semibold">
                  <Link href="/contact">Contact Our Team</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
