"use client"

import { motion } from "framer-motion"
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Users } from "lucide-react"

export default function TermsAndConditions() {
  const sections = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Acceptance of Terms",
      content: [
        "By accessing our website or services, you agree to these terms",
        "These terms apply to all visitors, users, and customers",
        "We reserve the right to update these terms at any time",
        "Continued use constitutes acceptance of modified terms",
      ],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Use of Services",
      content: [
        "Services are provided for legitimate automotive purposes only",
        "You must provide accurate information when making inquiries",
        "Prohibited uses include fraud, spam, or illegal activities",
        "We reserve the right to refuse service to anyone",
      ],
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Vehicle Sales & Warranties",
      content: [
        "All vehicle information is provided in good faith",
        "Prices and availability subject to change without notice",
        "Vehicle condition reports are based on professional inspection",
        "Warranty terms vary by vehicle and will be clearly disclosed",
        "All sales are subject to financing approval where applicable",
      ],
    },
    {
      icon: <XCircle className="h-6 w-6" />,
      title: "Limitations & Liability",
      content: [
        "Services provided 'as is' without warranties of any kind",
        "We are not liable for indirect or consequential damages",
        "Maximum liability limited to the amount paid for services",
        "Some jurisdictions may not allow certain limitations",
      ],
    },
  ]

  const additionalTerms = [
    {
      title: "Intellectual Property",
      content:
        "All content, trademarks, and intellectual property on this website are owned by us or our licensors. You may not use, reproduce, or distribute any content without written permission.",
    },
    {
      title: "Privacy & Data Protection",
      content:
        "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.",
    },
    {
      title: "Dispute Resolution",
      content:
        "Any disputes arising from these terms will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.",
    },
    {
      title: "Governing Law",
      content:
        "These terms are governed by the laws of [Your State/Country]. Any legal proceedings must be brought in the courts of [Your Jurisdiction].",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Header */}
      <section className="relative py-24 bg-gradient-to-r from-emerald-900 to-teal-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.2),transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <FileText className="h-8 w-8 text-emerald-300" />
              </div>
              <span className="px-4 py-2 bg-emerald-500/20 text-emerald-200 rounded-full text-sm font-medium border border-emerald-400/30">
                Terms & Conditions
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Terms &
              <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
                Conditions
              </span>
            </h1>

            <p className="text-xl text-emerald-100 leading-relaxed">
              Please read these terms carefully before using our services. These terms govern your relationship with our
              automotive dealership.
            </p>

            <div className="mt-8 text-sm text-emerald-200">
              Effective date:{" "}
              {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
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
                <div className="p-3 bg-amber-100 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notice</h2>
                  <p className="text-gray-600 leading-relaxed">
                    These Terms and Conditions constitute a legally binding agreement between you and our automotive
                    dealership. By using our website, services, or visiting our showroom, you acknowledge that you have
                    read, understood, and agree to be bound by these terms.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Terms Sections */}
          <div className="max-w-6xl mx-auto mb-16">
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

          {/* Additional Terms */}
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              Additional Terms
            </motion.h2>

            <div className="space-y-6">
              {additionalTerms.map((term, index) => (
                <motion.div
                  key={term.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-emerald-100"
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{term.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{term.content}</p>
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
              <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
              <p className="text-emerald-100 mb-6 leading-relaxed">
                If you have any questions about these Terms and Conditions or need clarification on any point, our legal
                team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:legal@yourcompany.com"
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 font-medium"
                >
                  legal@yourcompany.com
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 font-medium"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
