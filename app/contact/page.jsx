"use client"

import { Mail, MapPin, MessageCircle, Phone, Clock, Send, User, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useState } from "react"
import { toast } from "sonner"
import { useEnquiry } from "@/Context/EnquiryContext"
import { useSettings } from "@/Context/SettingsContext"
import { formatPhone } from "@/lib/formatPhone"
import { motion } from "framer-motion"

export default function ContactPage() {
  const { createEnquiry, loading: enquiryLoading, error: enquiryError } = useEnquiry()
  const { settings, loading: settingsLoading, error: settingsError } = useSettings()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    enquiryType: "general",
    carId: null,
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const submissionData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      message: formData.message,
      enquiryType: formData.enquiryType,
      carId: formData.carId || undefined,
    }

    const result = await createEnquiry(submissionData)

    if (result.success) {
      toast.success("Enquiry submitted successfully! We will get back to you soon.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        enquiryType: "general",
        carId: null,
      })
    } else {
      toast.error(`Failed to submit enquiry: ${result.error || "Unknown error"}`)
    }
  }

  if (settingsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </div>
    )
  }

  if (settingsError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
        <div className="text-center">
          <p className="text-red-600">Error: {settingsError}</p>
        </div>
      </div>
    )
  }

  const { companyInfo, businessHours } = settings || {}

  const contactMethods = [
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Call Us",
      description: `Available ${businessHours?.days || "Mon-Sat"}: ${businessHours?.open || "9:00 AM"} - ${
        businessHours?.close || "6:00 PM"
      }`,
      action: companyInfo?.phone ? formatPhone(companyInfo.phone) : "+1 (234) 567-890",
      href: `tel:${companyInfo?.phone || "+1234567890"}`,
      color: "from-emerald-500 to-teal-500",
      delay: 0.1,
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email Us",
      description: "We'll respond within 24 hours",
      action: companyInfo?.email || "info@luxurycars.com",
      href: `mailto:${companyInfo?.email || "info@luxurycars.com"}`,
      color: "from-emerald-600 to-emerald-700",
      delay: 0.2,
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "WhatsApp",
      description: "Chat with our sales team",
      action: "Message Us",
      href: `https://wa.me/${companyInfo?.whatsapp || "1234567890"}`,
      color: "from-teal-500 to-emerald-600",
      delay: 0.3,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 mt-[120px]">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-r from-emerald-900 to-teal-900 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.2),transparent_50%)]" />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-emerald-500/20 text-emerald-200 rounded-full text-sm font-medium border border-emerald-400/30">
                  Get In Touch
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Contact Our
                <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
                  Expert Team
                </span>
              </h1>

              <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                Have questions about our premium vehicles or services? We're here to provide personalized assistance and
                expert guidance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: method.delay }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100 overflow-hidden">
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    />

                    {/* Icon */}
                    <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${method.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {method.icon}
                    </div>

                    {/* Content */}
                    <div className="space-y-4 relative z-10">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{method.description}</p>
                      <div className="pt-2">
                        <a
                          href={method.href}
                          target={method.title === "WhatsApp" ? "_blank" : undefined}
                          rel={method.title === "WhatsApp" ? "noopener noreferrer" : undefined}
                          className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${method.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                        >
                          {method.action}
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Full Name *
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="pl-10 h-12 rounded-xl border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="pl-10 h-12 rounded-xl border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (234) 567-890"
                            className="pl-10 h-12 rounded-xl border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Vehicle Enquiry"
                          className="h-12 rounded-xl border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you? Please provide details about your inquiry..."
                        rows={6}
                        className="rounded-xl border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={enquiryLoading}
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      {enquiryLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                          Send Message
                        </div>
                      )}
                    </Button>

                    {enquiryError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm">{enquiryError}</p>
                      </div>
                    )}
                  </form>
                </div>
              </motion.div>

              {/* Showroom Information */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Showroom Details */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Visit Our Showroom</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {companyInfo?.name || "LuxuryCars Showroom"}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {companyInfo?.address || "123 Luxury Lane, Prestige City, PC 12345, United States"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Clock className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                        <p className="text-gray-600">
                          {businessHours?.days || "Monday - Friday"}: {businessHours?.open || "9:00 AM"} -{" "}
                          {businessHours?.close || "6:00 PM"}
                        </p>
                        <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                        <p className="text-gray-600">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Find Us</h3>
                  <div className="relative h-[300px] w-full rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                      <p className="text-emerald-700 font-medium">Interactive Map</p>
                      <p className="text-emerald-600 text-sm">Coming Soon</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                {/* <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-6">Why Choose Us?</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-200 mb-1">24/7</div>
                      <div className="text-sm text-emerald-100">Customer Support</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-200 mb-1">500+</div>
                      <div className="text-sm text-emerald-100">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-200 mb-1">50+</div>
                      <div className="text-sm text-emerald-100">Premium Vehicles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-200 mb-1">10+</div>
                      <div className="text-sm text-emerald-100">Years Experience</div>
                    </div>
                  </div>
                </div> */}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
