import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '../supabase/supabase';
import { Leaf, Target, Users, Award } from 'lucide-react';

function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [aboutData, setAboutData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutUs = async () => {
      const { data, error } = await supabase.from('about_us').select('*').single();
      if (error) {
        console.error('Error fetching About Us:', error.message);
      } else if (data) {
        setAboutData({ title: data.title, description: data.description });
      }
      setLoading(false);
    };
    fetchAboutUs();
  }, []);

  // ✅ Split the title and make the 2nd word green
  const renderColoredTitle = (title) => {
    if (!title) return null;
    const words = title.split(' ');
    return (
      <>
        {words.map((word, i) => (
          <span key={i} className={i === 1 ? 'text-green-500' : 'text-gray-900'}>
            {word}{' '}
          </span>
        ))}
      </>
    );
  };

  return (
    <section id="about" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center text-gray-500 text-lg py-20">
            Loading About Us...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* ✅ Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {renderColoredTitle(
                  aboutData.title || 'About SustainEco Systems & Services'
                )}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {aboutData.description ||
                  'SustainEco Systems & Services (S³) is a multidisciplinary environmental consultancy dedicated to delivering sustainable, technology-driven solutions for urban and industrial development challenges.'}
              </p>
            </motion.div>

            {/* ✅ Right Side */}
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
        )}
      </div>
    </section>
  );
}

export default AboutSection;
