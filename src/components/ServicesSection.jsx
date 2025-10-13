import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Leaf, Droplets, FileCheck, Map, TrendingUp, Wind,
  ChevronDown, Mail, Phone, MapPin, Send, Users,
  Target, Award, Building, Recycle, CheckCircle
} from 'lucide-react';
function ServicesSection() {
   const services = [
    { icon: Recycle, title: 'Solid Waste Management', desc: 'Comprehensive waste management solutions from collection to disposal, including recycling and waste-to-energy strategies.' },
    { icon: Droplets, title: 'Wastewater Management', desc: 'Advanced wastewater treatment systems and water quality monitoring for sustainable water resource management.' },
    { icon: FileCheck, title: 'Environmental Impact Assessment', desc: 'Thorough EIA studies ensuring compliance with environmental regulations and sustainable project development.' },
    { icon: Map, title: 'GIS-Based Monitoring', desc: 'Cutting-edge geographic information systems for real-time environmental monitoring and spatial analysis.' },
    { icon: TrendingUp, title: 'Sustainability Advisory', desc: 'Strategic guidance on sustainable practices, green certifications, and ESG compliance for organizations.' },
    { icon: Wind, title: 'Climate Change Mitigation', desc: 'Innovative solutions for carbon footprint reduction and climate resilience strategies.' }
  ];

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="services" ref={ref} className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-green-500">Expertise</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive environmental solutions tailored to your needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-100"
            >
              <service.icon className="w-14 h-14 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection