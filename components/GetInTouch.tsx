"use client";

import { Mail, MessageCircle, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from "./ui/button";
import { useSettings } from "@/Context/SettingsContext";
import { formatPhone } from "@/lib/formatPhone";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GetInTouch() {
  const { settings } = useSettings();
  const company = settings?.companyInfo;

  const contactMethods = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email Us",
      description: "Get detailed information about our vehicles",
      detail: company?.email || "info@example.com",
      action: `mailto:${company?.email || "info@example.com"}`,
      color: "from-emerald-500 to-teal-500",
      delay: 0.1
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Call Direct",
      description: "Speak with our automotive experts",
      detail: company?.phone ? formatPhone(company.phone) : "+1 (234) 567-890",
      action: `tel:${company?.phone || "+1234567890"}`,
      color: "from-emerald-600 to-emerald-700",
      delay: 0.2
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "WhatsApp",
      description: "Quick chat with our sales team",
      detail: "Message instantly",
      action: `https://wa.me/${company?.whatsapp || "1234567890"}`,
      color: "from-teal-500 to-emerald-600",
      delay: 0.3
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Subtle Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50/50 to-slate-100">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #059669 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              Connect With Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Find Your
            <span className="block text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
              Perfect Vehicle?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our automotive experts are here to guide you through every step of your journey
          </p>
        </motion.div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: method.delay }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${method.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {method.icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {method.description}
                  </p>
                  <div className="pt-2">
                    <Button
                      asChild
                      className={`w-full bg-gradient-to-r ${method.color} hover:shadow-lg text-white font-semibold rounded-xl transition-all duration-300 group-hover:scale-105`}
                    >
                      <a
                        href={method.action}
                        target={method.title === "WhatsApp" ? "_blank" : undefined}
                        rel={method.title === "WhatsApp" ? "noopener noreferrer" : undefined}
                        className="flex items-center justify-center gap-2"
                      >
                        {method.detail}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-lg">Business Hours</h4>
                <p className="text-emerald-100">{settings?.businessHours.days} - {settings?.businessHours.open} to {settings?.businessHours.close}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-lg">Visit Our Showroom</h4>
                <p className="text-emerald-100">{company?.address}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
