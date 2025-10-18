import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Building } from 'lucide-react';
import { supabase } from '../supabase/supabase'; // ✅ adjust path if needed

function ClientsSection() {
  const [clients, setClients] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(6);
  const [loading, setLoading] = useState(true);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // ✅ Fetch clients (name + logo) from Supabase
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('name, logo')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error.message);
      } else {
        setClients(data || []);
      }
      setLoading(false);
    };
    fetchClients();
  }, []);

  // ✅ Responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSlidesPerView(2);
      else if (window.innerWidth < 768) setSlidesPerView(3);
      else if (window.innerWidth < 1024) setSlidesPerView(4);
      else setSlidesPerView(6);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, clients.length - slidesPerView);
  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  // ✅ Auto slide only when in view
  useEffect(() => {
    if (!isInView) return; // Start auto-slide only when in view

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView, maxIndex]);

  return (
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Clients & <span className="text-green-500">Partners</span>
          </h2>
          <p className="text-xl text-gray-600">
            Trusted by leading organizations worldwide
          </p>
        </motion.div>

        {/* Loading / Empty / Slider */}
        {loading ? (
          <div className="text-center text-gray-500 text-lg py-16">
            Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-16">
            No clients available at the moment.
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 hover:bg-green-50"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-green-500" />
            </button>

            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 hover:bg-green-50"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-green-500" />
            </button>

            {/* Slider Container */}
            <div className="overflow-hidden px-[10px] py-[20px]">
              <motion.div
                className="flex gap-8"
                animate={{
                  x: `calc(-${currentIndex * (100 / slidesPerView)}% - ${
                    currentIndex * (2 / slidesPerView)
                  }rem)`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {clients.map((client, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      minWidth: `calc(${100 / slidesPerView}% - ${
                        (slidesPerView - 1) * 2 / slidesPerView
                      }rem)`,
                    }}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center cursor-pointer"
                  >
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="w-20 h-20 object-contain mb-3"
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg mb-3">
                        <Building className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <p className="text-gray-700 font-medium text-center">
                      {client.name}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-8 bg-green-500'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ClientsSection;
