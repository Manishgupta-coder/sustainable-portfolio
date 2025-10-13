import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Leaf, Droplets, FileCheck, Map, TrendingUp, Wind,
  ChevronDown, Mail, Phone, MapPin, Send, Users,
  Target, Award, Building, Recycle, CheckCircle
} from 'lucide-react';
function TeamSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Team & <span className="text-green-500">Approach</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A diverse team of environmental experts, engineers, and sustainability professionals committed to creating lasting positive impact through participatory and research-oriented methodologies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-gray-100 to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="bg-gradient-to-r from-blue-700 to-green-500 w-24 h-24 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Expert Team Member</h3>
              <p className="text-gray-600 text-center">Environmental Specialist</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection