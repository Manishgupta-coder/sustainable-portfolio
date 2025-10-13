import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Leaf, Droplets, FileCheck, Map, TrendingUp, Wind,
  ChevronDown, Mail, Phone, MapPin, Send, Users,
  Target, Award, Building, Recycle, CheckCircle
} from 'lucide-react';
function AboutSection() {
     const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="about" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-green-500">SustainEco</span> Systems & Services
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              SustainEco Systems & Services (S³) is a multidisciplinary environmental consultancy dedicated to delivering sustainable, technology-driven solutions for urban and industrial development challenges.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We specialize in solid waste management, wastewater management, environmental impact assessments, GIS-based monitoring systems, and sustainability advisory services.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our approach combines cutting-edge technology, participatory methods, and research-oriented strategies to create lasting environmental impact.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <Leaf className="w-12 h-12 text-green-500 mb-3" />
                  <h4 className="font-semibold text-gray-900">Sustainable</h4>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <Target className="w-12 h-12 text-blue-700 mb-3" />
                  <h4 className="font-semibold text-gray-900">Data-Driven</h4>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <Users className="w-12 h-12 text-green-500 mb-3" />
                  <h4 className="font-semibold text-gray-900">Participatory</h4>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <Award className="w-12 h-12 text-blue-700 mb-3" />
                  <h4 className="font-semibold text-gray-900">Excellence</h4>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection