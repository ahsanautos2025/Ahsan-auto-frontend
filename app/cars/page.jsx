"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useCars } from "@/Context/CarContext";
import debounce from "lodash/debounce";

const ITEMS_PER_PAGE = 20;

export default function CarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filter states from URL query parameters
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [searchYear, setSearchYear] = useState(
    searchParams.get("yearSearch") || ""
  );
  const [yearFilter, setYearFilter] = useState(searchParams.get("year") || "");
  const [bodyTypeFilter, setBodyTypeFilter] = useState(
    searchParams.get("bodyType")?.split(",") || []
  );
  const [fuelTypeFilter, setFuelTypeFilter] = useState(
    searchParams.get("fuelType")?.split(",") || []
  );
  const [colorFilter, setColorFilter] = useState(
    searchParams.get("color")?.split(",") || []
  );
  const [sortOption, setSortOption] = useState(
    searchParams.get("sort") || "createdAt"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [availabilityFilter, setAvailabilityFilter] = useState(
    searchParams.get("filter") || "available"
  );

  const { cars, getCars, loading, error } = useCars();

  // Predefined filter options
  const uniqueYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018];
  const uniqueBodyTypes = ["Sedan", "SUV", "Coupe", "Hatchback", "Convertible"];
  const uniqueFuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];
  const uniqueColors = [
    "Black",
    "White",
    "Silver",
    "Red",
    "Blue",
    "Green",
    "Gray",
  ];

  // Update URL with filter parameters
  const updateURL = useCallback(
    debounce(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (searchYear) params.set("yearSearch", searchYear);
      // Comment out price params
      // if (priceRange[0] > 0) params.set("priceMin", priceRange[0].toString());
      // if (priceRange[1] < 50000000) params.set("priceMax", priceRange[1].toString());
      if (yearFilter) params.set("year", yearFilter);
      if (bodyTypeFilter.length)
        params.set("bodyType", bodyTypeFilter.join(","));
      if (fuelTypeFilter.length)
        params.set("fuelType", fuelTypeFilter.join(","));
      if (colorFilter.length) params.set("color", colorFilter.join(","));
      if (sortOption !== "createdAt") params.set("sort", sortOption);
      if (currentPage !== 1) params.set("page", currentPage.toString());
      if (availabilityFilter) params.set("filter", availabilityFilter);

      router.push(`/cars?${params.toString()}`, { scroll: false });
    }, 300),
    [
      searchTerm,
      searchYear,
      // Remove priceRange from dependencies
      // priceRange,
      yearFilter,
      bodyTypeFilter,
      fuelTypeFilter,
      colorFilter,
      sortOption,
      currentPage,
      availabilityFilter,
    ]
  );

  // Enhanced search and filtering logic
  const filteredAndSearchedCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesName = searchTerm
        ? car.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesSearchYear = searchYear
        ? car.year.toString().includes(searchYear)
        : true;
      // const matchesPrice =
      //   car.price >= priceRange[0] && car.price <= priceRange[1];
      const matchesYear = yearFilter
        ? car.year.toString() === yearFilter
        : true;
      const matchesBodyType = bodyTypeFilter.length
        ? bodyTypeFilter.includes(car.bodyType)
        : true;
      const matchesFuelType = fuelTypeFilter.length
        ? fuelTypeFilter.includes(car.fuelType)
        : true;
      const matchesColor = colorFilter.length
        ? colorFilter.includes(car.color)
        : true;
      const matchesAvailability = availabilityFilter
        ? car.availability === availabilityFilter
        : true;

      return (
        matchesName &&
        matchesSearchYear &&
        // matchesPrice &&
        matchesYear &&
        matchesBodyType &&
        matchesFuelType &&
        matchesColor &&
        matchesAvailability
      );
    });
  }, [
    cars,
    searchTerm,
    searchYear,
    // priceRange,
    yearFilter,
    bodyTypeFilter,
    fuelTypeFilter,
    colorFilter,
    availabilityFilter,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSearchedCars.length / ITEMS_PER_PAGE);
  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSearchedCars.slice(startIndex, endIndex);
  }, [filteredAndSearchedCars, currentPage]);

  // Fetch cars with filters
  useEffect(() => {
    const filters = {};
    // if (priceRange[0] > 0 || priceRange[1] < 50000000) {
    //   filters.price = { min: priceRange[0], max: priceRange[1] };
    // }
    if (yearFilter) {
      filters.year = {
        min: Number.parseInt(yearFilter),
        max: Number.parseInt(yearFilter),
      };
    }
    if (bodyTypeFilter.length) {
      filters.bodyType = bodyTypeFilter.join(",");
    }
    if (fuelTypeFilter.length) {
      filters.fuelType = fuelTypeFilter.join(",");
    }
    if (colorFilter.length) {
      filters.color = colorFilter.join(",");
    }
    if (availabilityFilter) {
      filters.availability = availabilityFilter;
    }

    getCars({ page: 1, limit: 100, sort: sortOption, filters });
  }, [
    // priceRange,
    yearFilter,
    bodyTypeFilter,
    fuelTypeFilter,
    colorFilter,
    sortOption,
    availabilityFilter,
  ]);

  // Update URL when filters change
  useEffect(() => {
    updateURL();
  }, [
    searchTerm,
    searchYear,
    // priceRange,
    yearFilter,
    bodyTypeFilter,
    fuelTypeFilter,
    colorFilter,
    sortOption,
    currentPage,
    availabilityFilter,
    updateURL,
  ]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    searchYear,
    // priceRange,
    yearFilter,
    bodyTypeFilter,
    fuelTypeFilter,
    colorFilter,
    availabilityFilter,
  ]);

  // Toggle filter functions
  const toggleBodyTypeFilter = (value) => {
    setBodyTypeFilter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleFuelTypeFilter = (value) => {
    setFuelTypeFilter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleColorFilter = (value) => {
    setColorFilter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSearchYear("");
    // setPriceRange([0, 50000000]);
    setYearFilter("");
    setBodyTypeFilter([]);
    setFuelTypeFilter([]);
    setColorFilter([]);
    setSortOption("createdAt");
    setCurrentPage(1);
    setAvailabilityFilter("available");
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
      </CardContent>
    </Card>
  );

  // Active filters count
  const activeFiltersCount = [
    searchTerm,
    searchYear,
    yearFilter,
    ...bodyTypeFilter,
    ...fuelTypeFilter,
    ...colorFilter,
    // priceRange[0] > 0 || priceRange[1] < 50000000 ? "price" : null,
    availabilityFilter !== "available" ? "availability" : null,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 mt-10 md:mt-0">
      {/* Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  Car Collection
                </h1>
                <div className="h-1 w-20 bg-emerald-500 rounded-full" />
              </div>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed mb-4">
                Discover our curated selection of exceptional vehicles, each one
                carefully chosen for quality, performance, and luxury.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 bg-gray-100 rounded-full">
                  <span className="text-sm font-semibold text-gray-700">
                    {filteredAndSearchedCars.length} Vehicles Available
                  </span>
                </div>
                {activeFiltersCount > 0 && (
                  <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium">
                    {activeFiltersCount} Filter
                    {activeFiltersCount > 1 ? "s" : ""} Active
                  </div>
                )}
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="w-full lg:w-auto flex flex-col gap-4 lg:min-w-[400px] xl:min-w-[500px]">
              {/* Search Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search vehicles..."
                    className="pl-10 h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-32">
                  <Input
                    type="text"
                    placeholder="Year..."
                    className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-center"
                    value={searchYear}
                    onChange={(e) => setSearchYear(e.target.value)}
                  />
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="flex-1 h-12 border-gray-300">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Newest Arrivals</SelectItem>
                    <SelectItem value="price">Price: Low to High</SelectItem>
                    <SelectItem value="-price">Price: High to Low</SelectItem>
                    <SelectItem value="-year">Latest Models</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 px-4 sm:px-6 border-gray-300 hover:bg-gray-50 bg-transparent"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Advanced Filters</span>
                      <span className="sm:hidden">Filters</span>
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 bg-emerald-500 hover:bg-emerald-600">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto w-80 sm:w-96">
                    <SheetHeader className="pb-6">
                      <SheetTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Advanced Filters
                      </SheetTitle>
                    </SheetHeader>

                    <div className="space-y-6">
                      <Accordion
                        type="multiple"
                        className="w-full"
                        defaultValue={["price"]}
                      >
                        {/* Price Range Filter */}
                        {/* <AccordionItem value="price">
                          <AccordionTrigger className="text-base font-medium">
                            💰 Price Range
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <div className="space-y-4">
                              <div className="flex justify-between text-sm font-medium text-gray-600">
                                <span>৳{priceRange[0].toLocaleString()}</span>
                                <span>৳{priceRange[1].toLocaleString()}</span>
                              </div>
                              <Slider
                                defaultValue={[0, 50000000]}
                                max={50000000}
                                step={5000}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-500"
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem> */}

                        {/* Year Filter */}
                        <AccordionItem value="year">
                          <AccordionTrigger className="text-base font-medium">
                            <Calendar className="h-4 w-4 mr-2" />
                            Model Year
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <Select
                              value={yearFilter}
                              onValueChange={(val) =>
                                setYearFilter(val === "any" ? "" : val)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any Year</SelectItem>
                                {uniqueYears.map((year) => (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Body Type Filter */}
                        <AccordionItem value="bodyType">
                          <AccordionTrigger className="text-base font-medium">
                            <Car className="h-4 w-4 mr-2" />
                            Body Type
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <div className="space-y-3">
                              {uniqueBodyTypes.map((type) => (
                                <div
                                  key={type}
                                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                                >
                                  <Checkbox
                                    id={`body-${type}`}
                                    checked={bodyTypeFilter.includes(type)}
                                    onCheckedChange={() =>
                                      toggleBodyTypeFilter(type)
                                    }
                                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                  />
                                  <Label
                                    htmlFor={`body-${type}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {type}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Fuel Type Filter */}
                        <AccordionItem value="fuelType">
                          <AccordionTrigger className="text-base font-medium">
                            <Fuel className="h-4 w-4 mr-2" />
                            Fuel Type
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <div className="space-y-3">
                              {uniqueFuelTypes.map((type) => (
                                <div
                                  key={type}
                                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                                >
                                  <Checkbox
                                    id={`fuel-${type}`}
                                    checked={fuelTypeFilter.includes(type)}
                                    onCheckedChange={() =>
                                      toggleFuelTypeFilter(type)
                                    }
                                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                  />
                                  <Label
                                    htmlFor={`fuel-${type}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {type}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Color Filter */}
                        <AccordionItem value="color">
                          <AccordionTrigger className="text-base font-medium">
                            <Palette className="h-4 w-4 mr-2" />
                            Color
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <div className="space-y-3">
                              {uniqueColors.map((color) => (
                                <div
                                  key={color}
                                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                                >
                                  <Checkbox
                                    id={`color-${color}`}
                                    checked={colorFilter.includes(color)}
                                    onCheckedChange={() =>
                                      toggleColorFilter(color)
                                    }
                                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                  />
                                  <Label
                                    htmlFor={`color-${color}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {color}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Button
                        variant="outline"
                        className="w-full mt-8 h-11 bg-transparent"
                        onClick={resetFilters}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reset All Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    className="h-12 px-4 text-gray-500 hover:bg-gray-50"
                    onClick={resetFilters}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Availability Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {["available", "upcoming", "sold"].map((status) => (
                  <Button
                    key={status}
                    variant={
                      availabilityFilter === status ? "default" : "outline"
                    }
                    className={`h-10 px-4 capitalize ${
                      availabilityFilter === status
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => setAvailabilityFilter(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto bg-white rounded-lg p-8 shadow-lg border">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() =>
                  getCars({ page: 1, limit: 100, sort: sortOption })
                }
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : paginatedCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto bg-white rounded-lg p-8 shadow-lg border">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No vehicles found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters to discover our
                car collection.
              </p>
              <Button
                onClick={resetFilters}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {paginatedCars.map((car, index) => {
                  const image =
                    car.images?.find((img) => img.isPrimary)?.url ||
                    car.images?.[0]?.url ||
                    "/placeholder.svg?height=600&width=800";

                  // Determine badge color based on availability
                  const availabilityBadgeClass =
                    car.availability === "available"
                      ? "bg-green-500 hover:bg-green-600"
                      : car.availability === "upcoming"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-red-500 hover:bg-red-600";

                  return (
                    <motion.div
                      key={car._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                      className="group"
                    >
                      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-emerald-300">
                        <div className="relative h-48 sm:h-56 lg:h-64 w-full overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={car.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {car.featured && (
                            <Badge className="absolute top-3 right-3 bg-emerald-600 text-white font-medium">
                              ✨ Featured
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-4 sm:p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                              {car.name}
                            </h3>
                            {/* <p className="text-lg font-bold text-emerald-600 ml-2 flex-shrink-0">
                              ৳{car.price.toLocaleString()}
                            </p> */}
                          </div>

                          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Year
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {car.year}
                              </p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Mileage
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {car.mileage.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Fuel
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {car.fuelType}
                              </p>
                            </div>
                          </div>

                          <Badge
                            className={`text-center mb-3 capitalize ${availabilityBadgeClass} text-white font-medium`}
                          >
                            {car.availability}
                          </Badge>

                          <Button
                            asChild
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-11 transition-all duration-300"
                          >
                            <Link href={`/cars/${getSlug(car)}`}>
                              View Details
                              <span className="ml-2">→</span>
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-gray-200">
                <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredAndSearchedCars.length
                  )}{" "}
                  of {filteredAndSearchedCars.length} vehicles
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "border-gray-300 hover:bg-gray-50"
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
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getSlug(car) {
  return `${car.name}-${car.year}-${car._id}`
    .toLowerCase()
    .replace(/\s+/g, "-");
}
