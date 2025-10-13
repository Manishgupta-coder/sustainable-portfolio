import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Leaf, Droplets, FileCheck, Map, TrendingUp, Wind,
  ChevronDown, Mail, Phone, MapPin, Send, Users,
  Target, Award, Building, Recycle, CheckCircle
} from 'lucide-react';
function ContactSection() {
   const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = () => {
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl text-blue-100">Let's create a sustainable future together</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="5"
                  className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-green-400 transition-colors resize-none"
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-start space-x-4">
              <Mail className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Email</h4>
                <p className="text-blue-100">info@sustaineco.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Phone</h4>
                <p className="text-blue-100">+91 (123) 456-7890</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Location</h4>
                <p className="text-blue-100">Dehradun, Uttarakhand, India</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/20 text-center text-blue-100">
          <p>&copy; 2025 SustainEco Systems & Services. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}

export default ContactSection