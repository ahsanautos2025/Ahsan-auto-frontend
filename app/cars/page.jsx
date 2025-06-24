"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Car,
  Fuel,
  Calendar,
  Palette,
  Settings,
  X,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useCars } from "@/Context/CarContext"
import debounce from "lodash/debounce"

const ITEMS_PER_PAGE = 20

export default function CarsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filter states from URL query parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [searchYear, setSearchYear] = useState(searchParams.get("yearSearch") || "")
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("priceMin")) || 0,
    Number(searchParams.get("priceMax")) || 50000000,
  ])
  const [yearFilter, setYearFilter] = useState(searchParams.get("year") || "")
  const [bodyTypeFilter, setBodyTypeFilter] = useState(searchParams.get("bodyType")?.split(",") || [])
  const [fuelTypeFilter, setFuelTypeFilter] = useState(searchParams.get("fuelType")?.split(",") || [])
  const [colorFilter, setColorFilter] = useState(searchParams.get("color")?.split(",") || [])
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "createdAt")
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)

  const { cars, getCars, loading, error } = useCars()

  // Predefined filter options
  const uniqueYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018]
  const uniqueBodyTypes = ["Sedan", "SUV", "Coupe", "Hatchback", "Convertible"]
  const uniqueFuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"]
  const uniqueColors = ["Black", "White", "Silver", "Red", "Blue", "Green", "Gray"]

  // Update URL with filter parameters
  const updateURL = useCallback(
    debounce(() => {
      const params = new URLSearchParams()

      if (searchTerm) params.set("search", searchTerm)
      if (searchYear) params.set("yearSearch", searchYear)
      if (priceRange[0] > 0) params.set("priceMin", priceRange[0].toString())
      if (priceRange[1] < 50000000) params.set("priceMax", priceRange[1].toString())
      if (yearFilter) params.set("year", yearFilter)
      if (bodyTypeFilter.length) params.set("bodyType", bodyTypeFilter.join(","))
      if (fuelTypeFilter.length) params.set("fuelType", fuelTypeFilter.join(","))
      if (colorFilter.length) params.set("color", colorFilter.join(","))
      if (sortOption !== "createdAt") params.set("sort", sortOption)
      if (currentPage !== 1) params.set("page", currentPage.toString())

      router.push(`/cars?${params.toString()}`, { scroll: false })
    }, 300),
    [
      searchTerm,
      searchYear,
      priceRange,
      yearFilter,
      bodyTypeFilter,
      fuelTypeFilter,
      colorFilter,
      sortOption,
      currentPage,
    ],
  )

  // Enhanced search and filtering logic
  const filteredAndSearchedCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesName = searchTerm ? car.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
      const matchesSearchYear = searchYear ? car.year.toString().includes(searchYear) : true
      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1]
      const matchesYear = yearFilter ? car.year.toString() === yearFilter : true
      const matchesBodyType = bodyTypeFilter.length ? bodyTypeFilter.includes(car.bodyType) : true
      const matchesFuelType = fuelTypeFilter.length ? fuelTypeFilter.includes(car.fuelType) : true
      const matchesColor = colorFilter.length ? colorFilter.includes(car.color) : true

      return (
        matchesName &&
        matchesSearchYear &&
        matchesPrice &&
        matchesYear &&
        matchesBodyType &&
        matchesFuelType &&
        matchesColor
      )
    })
  }, [cars, searchTerm, searchYear, priceRange, yearFilter, bodyTypeFilter, fuelTypeFilter, colorFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSearchedCars.length / ITEMS_PER_PAGE)
  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredAndSearchedCars.slice(startIndex, endIndex)
  }, [filteredAndSearchedCars, currentPage])

  // Fetch cars with filters
  useEffect(() => {
    const filters = {}
    if (priceRange[0] > 0 || priceRange[1] < 50000000) {
      filters.price = { min: priceRange[0], max: priceRange[1] }
    }
    if (yearFilter) {
      filters.year = {
        min: Number.parseInt(yearFilter),
        max: Number.parseInt(yearFilter),
      }
    }
    if (bodyTypeFilter.length) {
      filters.bodyType = bodyTypeFilter.join(",")
    }
    if (fuelTypeFilter.length) {
      filters.fuelType = fuelTypeFilter.join(",")
    }
    if (colorFilter.length) {
      filters.color = colorFilter.join(",")
    }

    getCars({ page: 1, limit: 100, sort: sortOption, filters })
  }, [priceRange, yearFilter, bodyTypeFilter, fuelTypeFilter, colorFilter, sortOption])

  // Update URL when filters change
  useEffect(() => {
    updateURL()
  }, [
    searchTerm,
    searchYear,
    priceRange,
    yearFilter,
    bodyTypeFilter,
    fuelTypeFilter,
    colorFilter,
    sortOption,
    currentPage,
    updateURL,
  ])

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, searchYear, priceRange, yearFilter, bodyTypeFilter, fuelTypeFilter, colorFilter])

  // Toggle filter functions
  const toggleBodyTypeFilter = (value) => {
    setBodyTypeFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const toggleFuelTypeFilter = (value) => {
    setFuelTypeFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const toggleColorFilter = (value) => {
    setColorFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setSearchYear("")
    setPriceRange([0, 50000000])
    setYearFilter("")
    setBodyTypeFilter([])
    setFuelTypeFilter([])
    setColorFilter([])
    setSortOption("createdAt")
    setCurrentPage(1)
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    return pages
  }

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <Card className="overflow-hidden border-emerald-100 shadow-lg bg-white/80 backdrop-blur-sm">
      <Skeleton className="h-64 w-full bg-gradient-to-br from-emerald-100 to-teal-100" />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-6 w-2/3 bg-gradient-to-r from-emerald-200 to-teal-200" />
          <Skeleton className="h-6 w-1/4 bg-gradient-to-r from-emerald-300 to-teal-300" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Skeleton className="h-4 w-full bg-emerald-100" />
          <Skeleton className="h-4 w-full bg-emerald-100" />
          <Skeleton className="h-4 w-full bg-emerald-100" />
        </div>
        <Skeleton className="h-11 w-full bg-gradient-to-r from-emerald-200 to-teal-200" />
      </CardContent>
    </Card>
  )

  // Active filters count
  const activeFiltersCount = [
    searchTerm,
    searchYear,
    yearFilter,
    ...bodyTypeFilter,
    ...fuelTypeFilter,
    ...colorFilter,
    priceRange[0] > 0 || priceRange[1] < 50000000 ? "price" : null,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-lg"
      >
        <div className="container mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Car Collection
                  </h1>
                  <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-2" />
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                Discover our curated selection of exceptional vehicles, each one carefully chosen for quality,
                performance, and luxury.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex items-center gap-4"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full">
                  <span className="text-sm font-semibold text-emerald-700">
                    {filteredAndSearchedCars.length} Vehicles Available
                  </span>
                </div>
                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium"
                  >
                    {activeFiltersCount} Filter{activeFiltersCount > 1 ? "s" : ""} Active
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Search and Filter Controls */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full lg:w-auto flex flex-col gap-4 lg:min-w-[500px]"
            >
              {/* Search Row */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-900 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search vehicles..."
                    className="pl-12 h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="text"
                    placeholder="Year..."
                    className="h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg text-center"
                    value={searchYear}
                    onChange={(e) => setSearchYear(e.target.value)}
                  />
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex gap-3">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="flex-1 h-12 border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-emerald-200">
                    <SelectItem value="createdAt"> Newest Arrivals</SelectItem>
                    <SelectItem value="price"> Price: Low to High</SelectItem>
                    <SelectItem value="-price"> Price: High to Low</SelectItem>
                    <SelectItem value="-year"> Latest Models</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 px-6 border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                    >
                      <Filter className="h-4 w-4 mr-2 text-emerald-500" />
                      Advanced Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 bg-emerald-500 hover:bg-emerald-600">{activeFiltersCount}</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto w-80 bg-white/95 backdrop-blur-md border-emerald-200">
                    <SheetHeader className="pb-6">
                      <SheetTitle className="text-xl font-semibold text-emerald-800 flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Advanced Filters
                      </SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6">
                      <Accordion type="multiple" className="w-full" defaultValue={["price"]}>
                        {/* Price Range Filter */}
                        <AccordionItem value="price" className="border-emerald-200">
                          <AccordionTrigger className="text-base font-medium text-emerald-800 hover:text-emerald-600">
                            💰 Price Range
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <div className="space-y-4">
                              <div className="flex justify-between text-sm font-medium text-emerald-700">
                                <span>৳{priceRange[0].toLocaleString()}</span>
                                <span>৳{priceRange[1].toLocaleString()}</span>
                              </div>
                              <Slider
                                defaultValue={[0, 50000000]}
                                max={50000000}
                                step={5000}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-500 [&_.slider-track]:bg-emerald-200 [&_.slider-range]:bg-emerald-500"
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Year Filter */}
                        <AccordionItem value="year" className="border-emerald-200">
                          <AccordionTrigger className="text-base font-medium text-emerald-800 hover:text-emerald-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Model Year
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <Select value={yearFilter} onValueChange={(val) => setYearFilter(val === "any" ? "" : val)}>
                              <SelectTrigger className="border-emerald-200 bg-white/80">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 backdrop-blur-md">
                                <SelectItem value="any">Any Year</SelectItem>
                                {uniqueYears.map((year) => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Body Type Filter */}
                        <AccordionItem value="bodyType" className="border-emerald-200">
                          <AccordionTrigger className="text-base font-medium text-emerald-800 hover:text-emerald-600">
                            <Car className="h-4 w-4 mr-2" />
                            Body Type
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <div className="space-y-3">
                              {uniqueBodyTypes.map((type) => (
                                <motion.div
                                  key={type}
                                  whileHover={{ scale: 1.02 }}
                                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                                >
                                  <Checkbox
                                    id={`body-${type}`}
                                    checked={bodyTypeFilter.includes(type)}
                                    onCheckedChange={() => toggleBodyTypeFilter(type)}
                                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                  />
                                  <Label
                                    htmlFor={`body-${type}`}
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    {type}
                                  </Label>
                                </motion.div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Fuel Type Filter */}
                        <AccordionItem value="fuelType" className="border-emerald-200">
                          <AccordionTrigger className="text-base font-medium text-emerald-800 hover:text-emerald-600">
                            <Fuel className="h-4 w-4 mr-2" />
                            Fuel Type
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <div className="space-y-3">
                              {uniqueFuelTypes.map((type) => (
                                <motion.div
                                  key={type}
                                  whileHover={{ scale: 1.02 }}
                                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                                >
                                  <Checkbox
                                    id={`fuel-${type}`}
                                    checked={fuelTypeFilter.includes(type)}
                                    onCheckedChange={() => toggleFuelTypeFilter(type)}
                                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                  />
                                  <Label
                                    htmlFor={`fuel-${type}`}
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    {type}
                                  </Label>
                                </motion.div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Color Filter */}
                        <AccordionItem value="color" className="border-emerald-200">
                          <AccordionTrigger className="text-base font-medium text-emerald-800 hover:text-emerald-600">
                            <Palette className="h-4 w-4 mr-2" />
                            Color
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <div className="space-y-3">
                              {uniqueColors.map((color) => (
                                <motion.div
                                  key={color}
                                  whileHover={{ scale: 1.02 }}
                                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                                >
                                  <Checkbox
                                    id={`color-${color}`}
                                    checked={colorFilter.includes(color)}
                                    onCheckedChange={() => toggleColorFilter(color)}
                                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                  />
                                  <Label
                                    htmlFor={`color-${color}`}
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    {color}
                                  </Label>
                                </motion.div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Button
                        variant="outline"
                        className="w-full mt-8 h-11 border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-medium"
                        onClick={resetFilters}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reset All Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                {(searchTerm || searchYear || priceRange[0] !== 0 || priceRange[1] !== 50000000 || yearFilter || bodyTypeFilter.length || fuelTypeFilter.length || colorFilter.length || sortOption !== "createdAt") && (
                  <Button
                    variant="ghost"
                    className="h-12 px-4 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={resetFilters}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-12 relative">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {[...Array(12)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SkeletonCard />
              </motion.div>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => getCars({ page: 1, limit: 100, sort: sortOption })}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 shadow-lg"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        ) : paginatedCars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters to discover our Car collection.
              </p>
              <Button
                onClick={resetFilters}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 shadow-lg"
              >
                Clear All Filters
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Cars Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {paginatedCars.map((car, index) => {
                  const image =
                    car.images?.find((img) => img.isPrimary)?.url ||
                    car.images?.[0]?.url ||
                    "/placeholder.svg?height=600&width=800"

                  return (
                    <motion.div
                      key={car._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-emerald-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-emerald-200">
                        <div className="relative h-64 w-full overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={car.name}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {car.featured && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium shadow-lg">
                                ✨ Featured
                              </Badge>
                            </motion.div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>

                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                              {car.name}
                            </h3>
                            <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent ml-2">
                              ৳{car.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="text-center p-2 bg-emerald-50 rounded-lg">
                              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Year</p>
                              <p className="text-sm font-semibold text-gray-900">{car.year}</p>
                            </div>
                            <div className="text-center p-2 bg-teal-50 rounded-lg">
                              <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">Mileage</p>
                              <p className="text-sm font-semibold text-gray-900">{car.mileage.toLocaleString()}</p>
                            </div>
                            <div className="text-center p-2 bg-emerald-50 rounded-lg">
                              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Fuel</p>
                              <p className="text-sm font-semibold text-gray-900">{car.fuelType}</p>
                            </div>
                          </div>

                          <Button
                            asChild
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium h-12 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
                          >
                            <Link href={`/cars/${getSlug(car)}`}>
                              View Details
                              <motion.div
                                className="ml-2"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                              >
                                →
                              </motion.div>
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-16 pt-8 border-t border-emerald-200"
              >
                <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSearchedCars.length)} of{" "}
                  {filteredAndSearchedCars.length} Carvehicles
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 bg-white/80 backdrop-blur-sm shadow-lg"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
                            : "border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 bg-white/80 backdrop-blur-sm shadow-lg"
                        }
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 bg-white/80 backdrop-blur-sm shadow-lg"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function getSlug(car) {
  return `${car.name}-${car.year}-${car._id}`.toLowerCase().replace(/\s+/g, "-")
}
