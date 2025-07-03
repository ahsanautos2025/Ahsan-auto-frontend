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
  Play,
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

export default function CarDetails({ slugAndId }) {
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

  // Create gallery array with video first if it exists
  const createGallery = () => {
    const images = currentCar?.images || []
    const primaryImage = images.find((img) => img.isPrimary)
    const otherImages = images.filter((img) => !img.isPrimary)
    const imageGallery = primaryImage ? [primaryImage, ...otherImages] : images

    // If video exists, add it as the first item
    if (currentCar?.videoUrl) {
      return [
        {
          type: "video",
          url: currentCar.videoUrl,
          alt: `${currentCar.name} video`,
          isVideo: true,
        },
        ...imageGallery.map((img) => ({ ...img, type: "image", isVideo: false })),
      ]
    }

    return imageGallery.length > 0
      ? imageGallery.map((img) => ({ ...img, type: "image", isVideo: false }))
      : [{ type: "image", url: "/placeholder.svg?height=600&width=800", alt: "Placeholder", isVideo: false }]
  }

  const gallery = createGallery()

  // Auto-slide through gallery (only for images, stop on video)
  useEffect(() => {
    if (!gallery || gallery.length <= 1) return

    // Check if current active item is a video
    const currentItem = gallery[activeImage]
    const isCurrentVideo = currentItem?.isVideo || currentItem?.type === "video"

    // Only auto-slide if current item is not a video
    if (isCurrentVideo) {
      return // Don't set interval for videos
    }

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % gallery.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [gallery, activeImage]) // Updated dependency array

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

  const navigateMain = (direction) => {
    if (direction === "prev") {
      setActiveImage((prev) => (prev - 1 + gallery.length) % gallery.length)
    } else {
      setActiveImage((prev) => (prev + 1) % gallery.length)
    }
  }

  if (loading || settingsLoading) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-48 mx-auto animate-pulse" />
            <Car className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
          </div>
        </div>
      </main>
    )
  }

  if (error || settingsError) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <p className="text-red-600 font-medium">Error: {error || settingsError}</p>
          </div>
        </div>
      </main>
    )
  }

  const currentItem = gallery[activeImage]
  const visibleThumbnails = gallery.slice(0, 4)
  const hasMoreImages = gallery.length > 4

  const companyPhone = settings?.companyInfo?.phone
  const companyWhatsapp = settings?.companyInfo?.whatsapp

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/cars"
            className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to all cars
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className="hover:border-emerald-300"
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard!")
              }}
              className="hover:border-emerald-300"
            >
              <Share2 className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Car Images/Video */}
          <div className="xl:col-span-2 space-y-6">
            <div className="relative h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden bg-white shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {currentItem?.isVideo ? (
                    <video
                      key={`video-${activeImage}`}
                      className="w-full h-full object-cover cursor-pointer"
                      autoPlay
                      loop
                      muted
                      playsInline
                      onClick={() => openGallery(activeImage)}
                    >
                      <source src={currentItem.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={currentItem?.url || "/placeholder.svg"}
                      alt={currentItem?.alt || `${currentCar?.name} view`}
                      fill
                      className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => openGallery(activeImage)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90">
                  {currentCar?.year}
                </Badge>
              </div>

              <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-600 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>

              {currentItem?.isVideo && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    <Play className="h-3 w-3 mr-1" />
                    Video
                  </Badge>
                </div>
              )}

              <div className="absolute bottom-4 right-4">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {activeImage + 1} / {gallery.length}
                </Badge>
              </div>

              {/* Navigation arrows */}
              {gallery.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={() => navigateMain("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={() => navigateMain("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex items-center gap-3">
              <div className="grid grid-cols-4 gap-3 flex-1">
                {visibleThumbnails.map((item, index) => (
                  <div
                    key={index}
                    className={`relative h-20 md:h-24 cursor-pointer rounded-lg overflow-hidden transition-all ${
                      activeImage === index
                        ? "ring-2 ring-emerald-500 shadow-md"
                        : "hover:shadow-md ring-1 ring-gray-200 hover:ring-emerald-300"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    {item.isVideo ? (
                      <div className="relative w-full h-full bg-black flex items-center justify-center">
                        <video className="w-full h-full object-cover" muted>
                          <source src={item.url} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={item.url || "/placeholder.svg"}
                        alt={item.alt || `${currentCar?.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {hasMoreImages && (
                <Button
                  variant="outline"
                  className="h-20 md:h-24 px-4 flex-col gap-1 bg-transparent"
                  onClick={() => openGallery(0)}
                >
                  <Images className="h-5 w-5" />
                  <span className="text-xs font-semibold">+{gallery.length - 4}</span>
                  <span className="text-xs">More</span>
                </Button>
              )}
            </div>
          </div>

          {/* Car Details and Contact */}
          <div className="space-y-6">
            {/* Main Details Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{currentCar?.name}</h1>
                  <div className="text-3xl font-bold text-emerald-600 mb-6">৳ {currentCar?.price.toLocaleString()}</div>
                </div>

                {/* Key Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-semibold">{currentCar?.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Speedometer className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Mileage</p>
                      <p className="font-semibold">{currentCar?.mileage.toLocaleString()} mi</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Fuel className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Fuel Type</p>
                      <p className="font-semibold">{currentCar?.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Settings className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Transmission</p>
                      <p className="font-semibold">{currentCar?.transmission}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button asChild className="w-full h-12 bg-emerald-600 hover:bg-emerald-700">
                    <a href={`tel:${companyPhone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                  >
                    <a href={`https://wa.me/${companyWhatsapp}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email Enquiry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Enquire About {currentCar?.name}</DialogTitle>
                        <DialogDescription>
                          Fill out the form below and we'll get back to you as soon as possible.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleFormChange} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleFormChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleFormChange}
                            placeholder={`I'm interested in the ${currentCar?.name}...`}
                            className="min-h-[100px] resize-none"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          disabled={enquiryLoading}
                        >
                          {enquiryLoading ? "Sending..." : "Send Enquiry"}
                        </Button>
                        {enquiryError && <p className="text-red-500 text-sm text-center">{enquiryError}</p>}
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                <Shield className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">Certified</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                <Award className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">Premium</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Car Details Tabs */}
        <div className="mt-12">
          <Card className="shadow-lg">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Specifications
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {currentCar?.description || "No description available."}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="features" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentCar?.features?.length ? (
                    currentCar?.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Check className="h-4 w-4 text-emerald-600 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-2 text-center py-8">No features listed.</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="p-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="engine" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-emerald-600" />
                        Engine & Performance
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Engine</p>
                          <p className="font-semibold">{currentCar?.engine || "N/A"}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Horsepower</p>
                          <p className="font-semibold">
                            {currentCar?.horsepower ? `${currentCar?.horsepower} hp` : "N/A"}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Transmission</p>
                          <p className="font-semibold">{currentCar?.transmission}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Fuel Type</p>
                          <p className="font-semibold">{currentCar?.fuelType}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="dimensions" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 mr-2 text-emerald-600" />
                        Dimensions & Details
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Body Type</p>
                          <p className="font-semibold">{currentCar?.bodyType}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Color</p>
                          <p className="font-semibold">{currentCar?.color}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Full Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogTitle className="sr-only">Gallery for {currentCar?.name}</DialogTitle>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black overflow-hidden border-0">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full"
              onClick={() => setIsGalleryOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-black/70 text-white">
                {galleryActiveImage + 1} / {gallery.length}
              </Badge>
            </div>

            {/* Main content */}
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
                  {gallery[galleryActiveImage]?.isVideo ? (
                    <video
                      key={`gallery-video-${galleryActiveImage}`}
                      className="w-full h-full object-contain max-h-full"
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                    >
                      <source src={gallery[galleryActiveImage].url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={gallery[galleryActiveImage]?.url || "/placeholder.svg"}
                      alt={gallery[galleryActiveImage]?.alt || `${currentCar?.name} view ${galleryActiveImage + 1}`}
                      fill
                      className="object-contain max-h-full"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            {gallery.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full h-12 w-12"
                  onClick={() => navigateGallery("prev")}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full h-12 w-12"
                  onClick={() => navigateGallery("next")}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Thumbnail strip at bottom */}
            <div className="absolute bottom-0 w-full bg-black/80 p-2 flex justify-center overflow-x-auto">
              {gallery.map((item, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-16 mx-1 cursor-pointer rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    galleryActiveImage === index ? "ring-2 ring-emerald-400" : "opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => setGalleryActiveImage(index)}
                >
                  {item.isVideo ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <video className="w-full h-full object-cover" muted>
                        <source src={item.url} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={item.url || "/placeholder.svg"}
                      alt={item.alt || `Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
