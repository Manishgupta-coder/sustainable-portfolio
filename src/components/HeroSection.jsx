import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase/supabase';

function HeroSection() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    const { data, error } = await supabase.from('hero_section').select('*').limit(1).single();
    if (!error && data) setHero(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading...
      </section>
    );
  }

  if (!hero) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        No hero data found
      </section>
    );
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${hero.image_url})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-green-900/60 to-blue-900/70"></div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 text-white max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {hero.title} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-300">
            {hero.subtitle}
          </span>
        </h1>
        <p className="text-lg md:text-xl">{hero.description}</p>
      </motion.div>
    </section>
  );
}

export default HeroSection;
