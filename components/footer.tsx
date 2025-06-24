"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";
import { useSettings } from "@/Context/SettingsContext";
import { SOCIAL_LINKS } from "@/lib/social-urls";
import { formatPhone } from "@/lib/formatPhone";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";


export default function Footer() {
  const { settings } = useSettings();
  const router = useRouter();
  const socialLinks = SOCIAL_LINKS(settings);
  const company = settings?.companyInfo;

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Vehicles" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const legalLinks = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookie-policy", label: "Cookie Policy" },
  ];

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      content: company?.address,
      href: company?.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            company.address
          )}`
        : null,
      external: true,
    },
    {
      icon: <Phone className="h-5 w-5" />,
      content: company?.phone ? formatPhone(company.phone) : null,
      href: company?.phone ? `tel:${company.phone}` : null,
    },
    {
      icon: <Mail className="h-5 w-5" />,
      content: company?.email,
      href: company?.email ? `mailto:${company.email}` : null,
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      content: "WhatsApp",
      href: company?.whatsapp ? `https://wa.me/${company.whatsapp}` : null,
      external: true,
    },
  ];

  return (
    <footer className="relative bg-black/50 backdrop-blur-md p-8 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #059669 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.1),transparent_50%)]" />

      <div className="container mx-auto px-10 py-16 relative z-10 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="mb-6">
              {settings?.logo?.url ? (
                <Image
                  src={settings.logo.url || "/placeholder.svg"}
                  alt={company?.name || "Company Logo"}
                  width={160}
                  height={80}
                  className="h-12 w-auto cursor-pointer"
                  onClick={() => router.push("/")}
                />
              ) : (
                <Image
                  src="/images/backup_logo_white.png"
                  alt="Backup Logo"
                  width={160}
                  height={80}
                  className="h-12 w-auto"
                />
              )}
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {company?.description ||
                "Premium luxury vehicles for discerning drivers. Experience excellence in quality, luxury, and exceptional service."}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/30 transition-all duration-300 group"
                >
                  <item.Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="sr-only">{item.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white mb-6 relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white mb-6 relative">
              Legal
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white mb-6 relative">
              Contact Us
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => {
                if (!item.content) return null;

                const content = (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start group cursor-pointer"
                  >
                    <div className="p-2 bg-emerald-500/20 rounded-lg mr-3 group-hover:bg-emerald-500/30 transition-colors duration-300">
                      <div className="text-emerald-300 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-gray-300 group-hover:text-emerald-300 transition-colors duration-300 leading-relaxed">
                      {item.content}
                    </span>
                  </motion.div>
                );

                return (
                  <li key={index}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} {company?.name || "Your Company"}.
              All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
