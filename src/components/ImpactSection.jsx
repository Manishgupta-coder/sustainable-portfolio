import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Leaf, Droplets, FileCheck, Map, TrendingUp, Wind,
  ChevronDown, Mail, Phone, MapPin, Send, Users,
  Target, Award, Building, Recycle, CheckCircle
} from 'lucide-react';
function ImpactSection() {
  const impacts = [
    { value: '150+', label: 'Projects Completed' },
    { value: '45', label: 'Cities Covered' },
    { value: '2M tons', label: 'Waste Processed' },
    { value: '50M liters', label: 'Water Treated Daily' }
  ];

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="impact" ref={ref} className="py-24 bg-gradient-to-br from-blue-700 via-blue-600 to-green-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl text-blue-100">Making a measurable difference in environmental sustainability</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold mb-2">{impact.value}</div>
              <div className="text-xl text-blue-100">{impact.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactSection