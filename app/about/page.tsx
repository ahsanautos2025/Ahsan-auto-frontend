"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Award, Users, Star, Target, Heart, Shield, Sparkles, ArrowRight, Car, Trophy } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description:
        "We are committed to excellence in every aspect of our business, from the vehicles we select to the service we provide.",
      color: "from-emerald-500 to-teal-500",
      delay: 0.1,
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Integrity",
      description:
        "We operate with complete transparency and honesty, building lasting relationships based on trust and mutual respect.",
      color: "from-emerald-600 to-emerald-700",
      delay: 0.2,
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Innovation",
      description:
        "We embrace innovation and continuously seek new ways to enhance the customer experience and exceed expectations.",
      color: "from-teal-500 to-emerald-600",
      delay: 0.3,
    },
  ]

  const teamMembers = [
    {
      name: "Jonathan Reynolds",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=400&width=400",
      description: "Visionary leader with 20+ years in luxury automotive",
    },
    {
      name: "Sarah Mitchell",
      role: "Sales Director",
      image: "/placeholder.svg?height=400&width=400",
      description: "Expert in premium vehicle sales and customer relations",
    },
    {
      name: "Michael Chen",
      role: "Customer Experience Manager",
      image: "/placeholder.svg?height=400&width=400",
      description: "Dedicated to delivering exceptional customer journeys",
    },
    {
      name: "Olivia Rodriguez",
      role: "Marketing Director",
      image: "/placeholder.svg?height=400&width=400",
      description: "Creative strategist building our luxury brand presence",
    },
  ]

  const stats = [
    { number: "500+", label: "Happy Customers", icon: <Users className="h-6 w-6" /> },
    { number: "18+", label: "Years Experience", icon: <Trophy className="h-6 w-6" /> },
    { number: "50+", label: "Premium Vehicles", icon: <Car className="h-6 w-6" /> },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 mt-[120px]">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
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

            {/* Floating Elements */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
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

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-4xl"
              >
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center gap-10 items-center text-center mb-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group "
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300">
                    <div className="inline-flex p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
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
                    with the finest luxury vehicles and an unparalleled buying experience. What started as a boutique
                    showroom with just five premium cars has evolved into one of the most respected luxury car
                    dealerships in the region.
                  </p>

                  <p>
                    Our founder, Jonathan Reynolds, believed that purchasing a luxury vehicle should be as exceptional
                    as the car itself. This philosophy continues to guide everything we do, from our meticulously
                    curated inventory to our personalized white-glove service.
                  </p>

                  <p>
                    Today, LuxuryCars is proud to represent some of the world's most prestigious automotive brands,
                    offering a carefully selected collection of vehicles that combine performance, craftsmanship, and
                    innovation.
                  </p>
                </div>

                <div className="mt-8">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Link href="/cars" className="flex items-center gap-2">
                      Explore Our Collection
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2"
                    alt="LuxuryCars showroom interior"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Our Mission</div>
                      <div className="text-sm text-gray-600">Excellence in every detail</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
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
                These core principles guide every decision we make and every relationship we build
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: value.delay }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100 overflow-hidden">
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    />

                    {/* Icon */}
                    <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${value.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {value.icon}
                    </div>

                    {/* Content */}
                    <div className="space-y-4 relative z-10">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>

                    {/* Number Badge */}
                    <div className="absolute top-6 right-6 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-600">{index + 1}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  Our People
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Meet Our
                <span className="block text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                  Expert Team
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Passionate professionals dedicated to delivering exceptional automotive experiences
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
                    <div className="relative h-48 w-48 mx-auto rounded-2xl overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300">
                      <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-teal-900">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
              alt="Luxury car background"
              fill
              className="object-cover opacity-20"
            />
          </div>

          {/* Animated Background Elements */}
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
                  duration: 4 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-block mb-6">
                <span className="px-6 py-3 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 rounded-full text-sm font-medium border border-emerald-400/30 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
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
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <Link href="/cars" className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Browse Our Inventory
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="border-2 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/10 hover:border-emerald-400 backdrop-blur-sm px-8 py-4 rounded-full font-semibold transition-all duration-300"
                >
                  <Link href="/contact">Contact Our Team</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-emerald-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm">Award-Winning Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm">Certified Pre-Owned Vehicles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm">Lifetime Support</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
