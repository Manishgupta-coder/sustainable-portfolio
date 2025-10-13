import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Building
} from 'lucide-react';

function ClientsSection() {
  const clients = ['Client A', 'Client B', 'Client C', 'Client D', 'Client E', 'Client F','Client B', 'Client C', 'Client D', 'Client E', 'Client F'];

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(2);
      } else if (window.innerWidth < 768) {
        setSlidesPerView(3);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(4);
      } else {
        setSlidesPerView(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, clients.length - slidesPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Clients & <span className="text-green-500">Partners</span>
          </h2>
          <p className="text-xl text-gray-600">Trusted by leading organizations worldwide</p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-green-500" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-50"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-green-500" />
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden px-[10px] py-[20px]">
            <motion.div
              className="flex gap-8"
              animate={{
                x: `calc(-${currentIndex * (100 / slidesPerView)}% - ${currentIndex * (2 / slidesPerView)}rem)`
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {clients.map((client, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  style={{
                    minWidth: `calc(${100 / slidesPerView}% - ${(slidesPerView - 1) * 2 / slidesPerView}rem)`
                  }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all flex items-center justify-center cursor-pointer"
                >
                  <Building className="w-12 h-12 text-gray-400" />
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
      </div>
    </section>
  );
}

export default ClientsSection;