import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "../supabase/supabase";

function ContactSection() {
  const [contactInfo, setContactInfo] = useState([]);
  const [sectionData, setSectionData] = useState({
    heading: "Connect With Us",
    subheading: "We'd love to hear from you — whether it's about sustainability, collaboration, or a new project idea."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    setLoading(true);
    
    try {
      // Fetch section data (type = 'section')
      const { data: sectionData, error: sectionError } = await supabase
        .from('contact_management')
        .select('*')
        .eq('type', 'section')
        .single();

      // Fetch contact information (type = 'contact') ordered by display_order
      const { data: contactData, error: contactError } = await supabase
        .from('contact_management')
        .select('*')
        .eq('type', 'contact')
        .order('display_order', { ascending: true });

      if (!contactError && contactData) {
        const formattedContactData = contactData.map(item => ({
          icon: getIconComponent(item.icon),
          title: item.title,
          detail: item.detail,
          description: item.description,
        }));
        setContactInfo(formattedContactData);
      }

      if (!sectionError && sectionData) {
        setSectionData({
          heading: sectionData.title,
          subheading: sectionData.detail
        });
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    }

    setLoading(false);
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      Mail: <Mail className="w-10 h-10 text-green-400" />,
      Phone: <Phone className="w-10 h-10 text-green-400" />,
      MapPin: <MapPin className="w-10 h-10 text-green-400" />
    };
    return iconMap[iconName] || <Mail className="w-10 h-10 text-green-400" />;
  };

  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden"
    >
      {/* Decorative gradient circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-300">
            {sectionData.heading}
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            {sectionData.subheading}
          </p>
        </motion.div>

        {/* Contact Cards */}
        {loading ? (
          <div className="text-center text-blue-100 text-lg py-16">
            Loading contact information...
          </div>
        ) : contactInfo.length === 0 ? (
          <div className="text-center text-blue-100 text-lg py-16">
            No contact information available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 border border-white/10 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-md"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {info.icon}
                </motion.div>
                <h4 className="text-2xl font-semibold">{info.title}</h4>
                <p className="text-green-300 text-lg font-medium">{info.detail}</p>
                <p className="text-blue-100 text-sm">{info.description}</p>
              </div>
            </motion.div>
          ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/20 text-center text-blue-100">
          <p>
            &copy; 2025 SustainEco Systems & Services. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
