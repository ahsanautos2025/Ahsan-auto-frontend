"use client";

import { Shield, Award, Users, Zap, Heart, Star } from 'lucide-react';
import { motion } from "framer-motion";
import { useSettings } from '@/Context/SettingsContext';

export default function WhyChooseUs() {
  const { settings } = useSettings();

  const features = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Premium Selection",
      description: "Handpicked luxury vehicles that exceed the highest quality standards and expectations.",
      color: "from-emerald-500 to-teal-500",
      delay: 0.1
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Transparent Process",
      description: "Complete transparency in pricing and documentation. No hidden fees, no surprises.",
      color: "from-emerald-600 to-emerald-700",
      delay: 0.2
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Exceptional Service",
      description: "Dedicated support team committed to delivering an unparalleled customer experience.",
      color: "from-teal-500 to-emerald-600",
      delay: 0.3
    }
  ];

  const stats = settings?.stats || [];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.1),transparent_50%)]" />
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
            <span className="px-4 py-2 bg-emerald-500/20 text-black rounded-full text-sm font-medium border border-emerald-400/30">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Excellence in Every
            <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
              Detail
            </span>
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto leading-relaxed">
            Discover what sets us apart in the luxury automotive industry
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-400/30 transition-all duration-500 hover:bg-white/10">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-black mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-xl font-bold text-black group-hover:text-black/90 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-black leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <Star className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat._id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-bold text-black mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-black font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
