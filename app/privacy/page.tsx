"use client"

import { motion } from "framer-motion"
import { Shield, Eye, Lock, Database, UserCheck, AlertCircle } from "lucide-react"

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Information We Collect",
      content: [
        "Personal identification information (Name, email address, phone number)",
        "Vehicle preferences and search history",
        "Communication records and inquiries",
        "Website usage data and analytics",
        "Location data when you visit our showroom",
      ],
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our automotive services",
        "To communicate about vehicles and appointments",
        "To personalize your browsing experience",
        "To send promotional materials (with your consent)",
        "To comply with legal obligations",
      ],
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Data Protection",
      content: [
        "We use industry-standard encryption to protect your data",
        "Access to personal information is restricted to authorized personnel",
        "Regular security audits and updates are performed",
        "We never sell your personal information to third parties",
        "Secure payment processing through certified providers",
      ],
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Your Rights",
      content: [
        "Right to access your personal data",
        "Right to correct inaccurate information",
        "Right to delete your data (subject to legal requirements)",
        "Right to restrict processing of your data",
        "Right to data portability",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Header */}
      <section className="relative py-24 bg-gradient-to-r from-emerald-900 to-teal-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.2),transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Shield className="h-8 w-8 text-emerald-300" />
              </div>
              <span className="px-4 py-2 bg-emerald-500/20 text-emerald-200 rounded-full text-sm font-medium border border-emerald-400/30">
                Privacy Policy
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Your Privacy
              <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
                Matters to Us
              </span>
            </h1>

            <p className="text-xl text-emerald-100 leading-relaxed">
              We are committed to protecting your personal information and being transparent about how we collect, use,
              and safeguard your data.
            </p>

            <div className="mt-8 text-sm text-emerald-200">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
                  <p className="text-gray-600 leading-relaxed">
                    At our luxury automotive dealership, we understand that your privacy is paramount. This Privacy
                    Policy explains how we collect, use, protect, and share information about you when you use our
                    services, visit our website, or interact with us in person.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Privacy Sections */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-white">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>

                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-16"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
              <p className="text-emerald-100 mb-6 leading-relaxed">
                If you have any questions about this Privacy Policy or how we handle your personal information, please
                don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:privacy@yourcompany.com"
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 font-medium"
                >
                  privacy@yourcompany.com
                </a>
                <a
                  href="tel:+1234567890"
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 font-medium"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
