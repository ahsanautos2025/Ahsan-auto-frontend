"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye, Calendar, Gauge, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useCars } from "@/Context/CarContext"
import { motion, AnimatePresence } from "framer-motion"

export default function FeaturedCars() {
  const { featuredCars, getFeaturedCars, loading, error } = useCars()
  const [currentPage, setCurrentPage] = useState(0)
  const carsPerPage = 4

  const totalPages = Math.ceil(featuredCars.length / carsPerPage)
  useEffect(() => {
    getFeaturedCars()
  }, [])

  const displayedCars = featuredCars.slice(currentPage * carsPerPage, (currentPage + 1) * carsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex)
  }

  // Loading skeleton component
  const SkeletonCard = () => (
    <Card className="overflow-hidden border-gray-200 shadow-sm">
      <Skeleton className="h-64 w-full" />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Featured Collection</h2>
              <p className="text-lg text-gray-600">Discover our premium vehicles</p>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: carsPerPage }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button
              onClick={getFeaturedCars}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!featuredCars.length) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Featured Vehicles</h2>
            <p className="text-gray-600 mb-8">Check back soon for our latest featured vehicles.</p>
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-full"
            >
              <Link href="/cars">Browse All Vehicles</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              Featured Collection
            </span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Handpicked vehicles that represent the pinnacle of automotive excellence
          </p>
        </motion.div>

        {/* Navigation Controls */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-4 mb-12"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={prevPage}
              className="h-12 w-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-emerald-100 hover:border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
              disabled={totalPages <= 1}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Page Indicators */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`transition-all duration-300 ${
                    currentPage === index
                      ? "w-8 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      : "w-2 h-2 bg-gray-300 hover:bg-emerald-300 rounded-full"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextPage}
              className="h-12 w-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-emerald-100 hover:border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
              disabled={totalPages <= 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </motion.div>
        )}

        {/* Cars Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {displayedCars.map((car, index) => {
              const primaryImage = car.images?.find((img) => img.isPrimary)
              const fallbackImage = car.images?.[0]
              const imageUrl = primaryImage?.url || fallbackImage?.url || "/placeholder.svg?height=600&width=800"
              const imageAlt = primaryImage?.alt || fallbackImage?.alt || car.name

              return (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={imageAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Featured Badge */}
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg border-0">
                        Featured
                      </Badge>

                      {/* View Details Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Button
                          asChild
                          size="sm"
                          className="bg-white/90 text-emerald-700 hover:bg-white rounded-full px-6 shadow-lg backdrop-blur-sm"
                        >
                          <Link href={`/cars/${car._id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Title and Price */}
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors duration-300">
                          {car.name}
                        </h3>
                        <p className="text-lg font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text ml-2 whitespace-nowrap">
                          ৳{car.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Car Details */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-emerald-50 rounded-xl">
                          <Calendar className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Year</p>
                          <p className="text-sm font-bold text-gray-900">{car.year}</p>
                        </div>
                        <div className="text-center p-3 bg-teal-50 rounded-xl">
                          <Gauge className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                          <p className="text-xs font-medium text-teal-700 uppercase tracking-wide">Miles</p>
                          <p className="text-sm font-bold text-gray-900">{car.mileage.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-emerald-50 rounded-xl">
                          <Settings className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Trans</p>
                          <p className="text-sm font-bold text-gray-900">{car.transmission}</p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        asChild
                        variant="outline"
                        className="w-full font-semibold transition-all duration-300 group-hover:scale-105 border-emerald-500 hover:border-teal-500 text-emerald-600 hover:text-teal-600 shadow-sm hover:shadow-md"
                      >
                        <Link href={`/cars/${getSlug(car)}`}>Explore Vehicle</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <Link href="/cars" className="flex items-center gap-2">
              View Complete Collection
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}


function getSlug(car) {
  return `${car.name}-${car.year}-${car._id}`.toLowerCase().replace(/\s+/g, "-")
}
