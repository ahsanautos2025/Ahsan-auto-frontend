"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Mail,
  MessageCircle,
  Phone,
  GaugeIcon as Speedometer,
  Check,
  Star,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  Car,
  Zap,
  Settings,
  Award,
  Shield,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCars } from "@/Context/CarContext"
import { useEnquiry } from "@/Context/EnquiryContext"
import { useSettings } from "@/Context/SettingsContext"
import { toast } from "sonner"

export default function CarDetails({slugAndId}) {
  const id = slugAndId.split("-").pop()
  const { currentCar, getCarById, loading, error } = useCars()
  const { createEnquiry, loading: enquiryLoading, error: enquiryError } = useEnquiry()
  const { settings, loading: settingsLoading, error: settingsError } = useSettings()
  const [activeImage, setActiveImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryActiveImage, setGalleryActiveImage] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  // Fetch car by ID on mount
  useEffect(() => {
    if (id) {
      getCarById(id)
    }
  }, [id])

  // Auto-slide images
  useEffect(() => {
    if (!currentCar?.images?.length || currentCar.images.length <= 1) return

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % currentCar.images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentCar?.images?.length])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const enquiryData = {
      carId: id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      enquiryType: "general",
    }
    const result = await createEnquiry(enquiryData)
    if (result.success) {
      toast.success("Enquiry submitted successfully! We will get back to you soon.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
    } else {
      toast.error(`Failed to submit enquiry: ${result.error}`)
    }
  }

  const openGallery = (imageIndex = 0) => {
    setGalleryActiveImage(imageIndex)
    setIsGalleryOpen(true)
  }

  const navigateGallery = (direction) => {
    if (direction === "prev") {
      setGalleryActiveImage((prev) => (prev - 1 + gallery.length) % gallery.length)
    } else {
      setGalleryActiveImage((prev) => (prev + 1) % gallery.length)
    }
  }

  if (loading || settingsLoading) {
    return (
      <main className="flex-1 bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="h-8 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-lg w-64 mx-auto animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded w-48 mx-auto animate-pulse" />
            <div className="flex justify-center">
              <Car className="h-12 w-12 text-emerald-500 animate-bounce" />
            </div>
          </motion.div>
        </div>
      </main>
    )
  }

  if (error || settingsError) {
    return (
      <main className="flex-1 bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-8 backdrop-blur-sm"
          >
            <p className="text-red-600 font-medium">Error: {error || settingsError}</p>
          </motion.div>
        </div>
      </main>
    )
  }

  // Use images array for gallery, fallback to placeholder
  const primaryImage = currentCar?.images?.find((img) => img.isPrimary)
  const otherImages = currentCar?.images?.filter((img) => !img.isPrimary) || []
  const gallery = primaryImage
    ? [primaryImage, ...otherImages]
    : currentCar?.images?.length
      ? currentCar.images
      : [{ url: "/placeholder.svg?height=600&width=800", alt: "Placeholder" }]

  const mainImage = gallery[activeImage]?.url
  const mainImageAlt = gallery[activeImage]?.alt || currentCar?.name || "Car image"

  // Show only first 4 thumbnails
  const visibleThumbnails = gallery.slice(0, 4)
  const hasMoreImages = gallery.length > 4

  // Assuming settings includes logo and contact info
  const companyLogo = settings?.logo?.url || "/placeholder-logo.svg"
  const companyEmail = settings?.contact?.email || "contact@company.com"
  const companyPhone = settings?.contact?.phone || "+1234567890"

  return (
    <main className="flex-1 bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/10 to-emerald-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-300/5 to-teal-300/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/cars"
            className="inline-flex items-center text-emerald-700 hover:text-emerald-900 transition-all duration-300 group bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200/50 hover:border-emerald-300 hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to all cars
          </Link>

          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className="bg-white/70 backdrop-blur-sm border-emerald-200/50 hover:border-emerald-300 hover:bg-emerald-50/70 transition-all duration-300"
              >
                <Heart
                  className={`h-4 w-4 transition-colors duration-300 ${
                    isLiked ? "fill-red-500 text-red-500" : "text-emerald-600"
                  }`}
                />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
                className="bg-white/70 backdrop-blur-sm border-emerald-200/50 hover:border-emerald-300 hover:bg-emerald-50/70 transition-all duration-300"
              >
                <Share2 className="h-4 w-4 text-emerald-600" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Car Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-2"
          >
            <div className="relative h-[400px] md:h-[500px] w-full mb-6 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-100 to-teal-100 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={mainImage || "/placeholder.svg"}
                    alt={mainImageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                    onClick={() => openGallery(activeImage)}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10" />

              <div className="absolute top-4 left-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="bg-white/90 backdrop-blur-sm text-emerald-800 hover:bg-white border border-emerald-200/50 font-semibold">
                    {currentCar?.year}
                  </Badge>
                </motion.div>
              </div>
              <div className="absolute top-4 right-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 font-semibold shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </motion.div>
              </div>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4">
                <Badge className="bg-black/70 backdrop-blur-sm text-white border-0">
                  {activeImage + 1} / {gallery.length}
                </Badge>
              </div>

              {/* Navigation arrows for main image */}
              {gallery.length > 1 && (
                <>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm hover:bg-white border-emerald-200/50 hover:border-emerald-300 shadow-lg"
                      onClick={() => setActiveImage((prev) => (prev - 1 + gallery.length) % gallery.length)}
                    >
                      <ChevronLeft className="h-4 w-4 text-emerald-600" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm hover:bg-white border-emerald-200/50 hover:border-emerald-300 shadow-lg"
                      onClick={() => setActiveImage((prev) => (prev + 1) % gallery.length)}
                    >
                      <ChevronRight className="h-4 w-4 text-emerald-600" />
                    </Button>
                  </motion.div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="grid grid-cols-4 gap-3 flex-1">
                {visibleThumbnails.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative h-20 md:h-24 cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                      activeImage === index
                        ? "ring-3 ring-emerald-500 shadow-xl"
                        : "hover:shadow-lg ring-2 ring-transparent hover:ring-emerald-300"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt || `${currentCar?.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {activeImage === index && (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  </motion.div>
                ))}
              </div>

              {/* Show More Button */}
              {hasMoreImages && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="h-20 md:h-24 px-4 flex-col gap-1 bg-white/70 backdrop-blur-sm border-emerald-200/50 hover:border-emerald-300 hover:bg-emerald-50/70 transition-all duration-300"
                    onClick={() => openGallery(0)}
                  >
                    <Images className="h-5 w-5 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">+{gallery.length - 4}</span>
                    <span className="text-xs text-emerald-600">More</span>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Car Details and Contact */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Main Details Card */}
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/30 to-transparent rounded-bl-full" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent mb-2 leading-tight"
                      >
                        {currentCar?.name}
                      </motion.h1>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                  >
                    ৳ {currentCar?.price.toLocaleString()}
                  </motion.div>

                  {/* Key Specs Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 gap-4 mb-8"
                  >
                    <div className="flex items-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-all duration-300 group">
                      <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-sm text-emerald-600 font-medium mb-1">Year</p>
                        <p className="font-bold text-emerald-900 text-lg">{currentCar?.year}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-all duration-300 group">
                      <div className="p-3 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <Speedometer className="h-5 w-5 text-teal-700" />
                      </div>
                      <div>
                        <p className="text-sm text-teal-600 font-medium mb-1">Mileage</p>
                        <p className="font-bold text-teal-900 text-lg">{currentCar?.mileage.toLocaleString()} mi</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-all duration-300 group">
                      <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <Fuel className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-sm text-emerald-600 font-medium mb-1">Fuel Type</p>
                        <p className="font-bold text-emerald-900 text-lg">{currentCar?.fuelType}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-all duration-300 group">
                      <div className="p-3 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <Settings className="h-5 w-5 text-teal-700" />
                      </div>
                      <div>
                        <p className="text-sm text-teal-600 font-medium mb-1">Transmission</p>
                        <p className="font-bold text-teal-900 text-lg">{currentCar?.transmission}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-3"
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        asChild
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 text-white"
                      >
                        <a href={`tel:${companyPhone}`}>
                          <Phone className="h-5 w-5 mr-3" />
                          Call Now
                        </a>
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full h-12 font-semibold border-2 border-emerald-300 text-emerald-700 bg-white/70 backdrop-blur-sm hover:bg-emerald-50 hover:shadow-lg transition-all duration-300"
                      >
                        <a href={`https://wa.me/${companyPhone}`}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    </motion.div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="outline"
                            className="w-full h-12 font-semibold border-2 border-emerald-300 text-emerald-700 bg-white/70 backdrop-blur-sm hover:bg-emerald-50 hover:shadow-lg transition-all duration-300"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Email Enquiry
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl">
                        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20" />
                          <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full" />
                          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/10 rounded-full" />
                          <DialogHeader className="relative z-10">
                            <DialogTitle className="text-2xl text-white font-bold">
                              Enquire About {currentCar?.name}
                            </DialogTitle>
                            <DialogDescription className="text-emerald-100">
                              Fill out the form below and we'll get back to you as soon as possible.
                            </DialogDescription>
                          </DialogHeader>
                        </div>
                        <form
                          onSubmit={handleSubmit}
                          className="p-6 space-y-6 bg-gradient-to-br from-white to-emerald-50/30"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-sm font-medium text-emerald-800">
                                Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-sm font-medium text-emerald-800">
                                Phone
                              </Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormChange}
                                className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-emerald-800">
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              className="h-11 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm font-medium text-emerald-800">
                              Message
                            </Label>
                            <Textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleFormChange}
                              placeholder={`I'm interested in the ${currentCar?.name}...`}
                              className="min-h-[100px] resize-none border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg border-0 text-white"
                            disabled={enquiryLoading}
                          >
                            {enquiryLoading ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                />
                                Sending...
                              </>
                            ) : (
                              "Send Enquiry"
                            )}
                          </Button>
                          {enquiryError && <p className="text-red-500 text-sm text-center">{enquiryError}</p>}
                        </form>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-3"
            >
              <div className="text-center p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-emerald-100/50">
                <Shield className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-emerald-800">Certified</p>
              </div>
              <div className="text-center p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-emerald-100/50">
                <Award className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-emerald-800">Premium</p>
              </div>
              <div className="text-center p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-emerald-100/50">
                <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-emerald-800">24/7 Support</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Car Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12"
        >
          <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-16 p-1 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-t-3xl">
                <TabsTrigger
                  value="description"
                  className="h-14 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 rounded-2xl"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="h-14 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 rounded-2xl"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="h-14 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 rounded-2xl"
                >
                  Specifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="p-8 bg-gradient-to-br from-white to-emerald-50/30">
                <div className="prose prose-lg max-w-none">
                  <p className="text-emerald-800 leading-relaxed text-lg">
                    {currentCar?.description || "No description available."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="features" className="p-8 bg-gradient-to-br from-white to-emerald-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCar?.features?.length ? (
                    currentCar?.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                          <Check className="h-4 w-4 text-emerald-700" />
                        </div>
                        <span className="font-medium text-emerald-900">{feature}</span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-emerald-600 col-span-2 text-center py-8">No features listed.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="p-8 bg-gradient-to-br from-white to-emerald-50/30">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem
                    value="engine"
                    className="border border-emerald-200/50 rounded-2xl px-6 shadow-sm bg-white/70 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6 text-emerald-800">
                      <div className="flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-emerald-600" />
                        Engine & Performance
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                          <p className="text-sm text-emerald-600 font-medium mb-1">Engine</p>
                          <p className="font-bold text-emerald-900 text-lg">{currentCar?.engine || "N/A"}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                          <p className="text-sm text-teal-600 font-medium mb-1">Horsepower</p>
                          <p className="font-bold text-teal-900 text-lg">
                            {currentCar?.horsepower ? `${currentCar?.horsepower} hp` : "N/A"}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                          <p className="text-sm text-emerald-600 font-medium mb-1">Transmission</p>
                          <p className="font-bold text-emerald-900 text-lg">{currentCar?.transmission}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                          <p className="text-sm text-teal-600 font-medium mb-1">Fuel Type</p>
                          <p className="font-bold text-teal-900 text-lg">{currentCar?.fuelType}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="dimensions"
                    className="border border-emerald-200/50 rounded-2xl px-6 shadow-sm bg-white/70 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6 text-emerald-800">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 mr-2 text-emerald-600" />
                        Dimensions & Details
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                          <p className="text-sm text-emerald-600 font-medium mb-1">Body Type</p>
                          <p className="font-bold text-emerald-900 text-lg">{currentCar?.bodyType}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                          <p className="text-sm text-teal-600 font-medium mb-1">Color</p>
                          <p className="font-bold text-teal-900 text-lg">{currentCar?.color}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>

      {/* Full Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogTitle className="sr-only">Image Gallery for {currentCar?.name}</DialogTitle>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black overflow-hidden border-0">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Close button */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 z-10"
            >
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                onClick={() => setIsGalleryOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-black/70 backdrop-blur-sm text-white text-sm">
                {galleryActiveImage + 1} / {gallery.length}
              </Badge>
            </div>

            {/* Main image */}
            <div className="relative w-full h-[calc(90vh-100px)] flex items-center justify-center bg-black">
              <AnimatePresence mode="wait">
                <motion.div
                  key={galleryActiveImage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={gallery[galleryActiveImage]?.url || "/placeholder.svg"}
                    alt={gallery[galleryActiveImage]?.alt || `${currentCar?.name} view ${galleryActiveImage + 1}`}
                    fill
                    className="object-contain max-h-full"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            {gallery.length > 1 && (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/30 hover:bg-white/50 text-white rounded-full h-12 w-12 backdrop-blur-sm"
                    onClick={() => navigateGallery("prev")}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/30 hover:bg-white/50 text-white rounded-full h-12 w-12 backdrop-blur-sm"
                    onClick={() => navigateGallery("next")}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </motion.div>
              </>
            )}

            {/* Thumbnail strip at bottom */}
            <div className="absolute bottom-0 w-full bg-black/80 p-2 flex justify-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {gallery.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative w-20 h-16 mx-1 cursor-pointer rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    galleryActiveImage === index ? "ring-2 ring-emerald-400" : "opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => setGalleryActiveImage(index)}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
