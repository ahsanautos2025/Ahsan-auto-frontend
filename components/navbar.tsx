"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangle, LogOut, Map, Menu, X, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/Context/AuthContext"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSettings } from "@/Context/SettingsContext"
import Image from "next/image"
import { formatPhone } from "@/lib/formatPhone";
import { SOCIAL_LINKS } from "@/lib/social-urls"


export default function Navbar() {
  const { user, logout, verifyToken } = useAuth()
  const { settings } = useSettings()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showSubHeader, setShowSubHeader] = useState(true)
  const [scrolled, setScrolled] = useState(false);
const socialLinks = SOCIAL_LINKS(settings);

  useEffect(() => {
    const checkAuth = async () => {
      await verifyToken()
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setShowSubHeader(scrollPosition <= 100)
      setScrolled(scrollPosition > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const handleLogout = () => {
    logout()
    setShowLogoutModal(false)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Vehicles" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      {/* Top Header Bar */}
      <AnimatePresence>
        {showSubHeader && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full bg-gradient-to-r from-emerald-900 to-teal-900 z-50 text-sm"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                {/* Contact Info and Address (Inline on Mobile) */}
                <div className="flex flex-wrap items-center gap-4 text-emerald-100">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${settings?.companyInfo?.phone}`}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {formatPhone(settings?.companyInfo?.phone)}
                    </a>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a
                      href={`mailto:${settings?.companyInfo?.email}`}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {settings?.companyInfo?.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        settings?.companyInfo?.address || "",
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-200"
                    >
                      {settings?.companyInfo?.address}
                    </Link>
                  </div>
                </div>

                {/* Social Links (Desktop Only) */}
                <div className="hidden md:flex items-center gap-2">
                  {socialLinks.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-200 hover:text-white transition-colors duration-200 p-1"
                    >
                      <item.Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <header
        className={`fixed z-40 w-full transition-all duration-300 ${showSubHeader ? "top-20 md:top-12" : "top-0"} ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100"
            : "bg-white/90 backdrop-blur-sm border-b border-gray-200"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link href="/" className="flex items-center">
                {settings?.logo?.url ? (
                  <Image
                    src={settings.logo.url || "/placeholder.svg"}
                    alt={settings?.companyInfo?.name || "Site Logo"}
                    width={140}
                    height={70}
                    className="h-12 w-auto"
                  />
                ) : (
                  <Image
                    src="/images/backup_logo.png"
                    alt="Backup Logo"
                    width={140}
                    height={70}
                    className="h-12 w-auto"
                  />
                )}
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-base font-medium transition-colors duration-200 ${
                    pathname === link.href ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"
                    />
                  )}
                </Link>
              ))}

              {/* Desktop Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button
                  asChild
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/contact">Get Quote</Link>
                </Button>

                {user && (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-emerald-200 hover:border-emerald-300"
                    >
                      <Link href="/admin/dashboard">Dashboard</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowLogoutModal(true)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
            </nav>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-emerald-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-emerald-600" />
                ) : (
                  <Menu className="h-6 w-6 text-emerald-600" />
                )}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-emerald-100"
            >
              <div className="container mx-auto px-4 py-6">
                <nav className="space-y-4">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className={`block py-3 px-4 rounded-xl text-lg font-medium transition-all duration-200 ${
                          pathname === link.href
                            ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-l-4 border-emerald-500"
                            : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="pt-4 space-y-3"
                  >
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-3 shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/contact">Get Quote</Link>
                    </Button>

                    {user && (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-emerald-200 hover:border-emerald-300 rounded-xl py-3"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Link href="/admin/dashboard">Dashboard</Link>
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl py-3"
                          onClick={() => {
                            setShowLogoutModal(true)
                            setIsMenuOpen(false)
                          }}
                        >
                          <LogOut className="h-5 w-5 mr-2" />
                          Logout
                        </Button>
                      </>
                    )}
                  </motion.div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertTriangle className="text-yellow-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
              </div>
              <p className="mb-6 text-gray-600">Are you sure you want to logout from your account?</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowLogoutModal(false)} className="flex-1 rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleLogout} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl">
                  Logout
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
