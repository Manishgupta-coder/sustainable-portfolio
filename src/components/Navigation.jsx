import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Leaf, Droplets, FileCheck, Map, TrendingUp, Wind,
  ChevronDown, Mail, Phone, MapPin, Send, Users,
  Target, Award, Building, Recycle, CheckCircle
} from 'lucide-react';
import logo from "../assets/images/logo.png";


function Navigation() {
    const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S³</span>
          </div>
          <span className={`font-bold text-lg ${scrolled ? 'text-blue-900' : 'text-white'}`}>
            SustainEco Systems
          </span>
          {/* <img src={logo} alt="logo" /> */}
        </div>
        <div className="hidden md:flex space-x-8">
          {['About', 'Services', 'Projects', 'Impact', 'Contact'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`hover:text-green-500 transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navigation