import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, CheckCircle
} from 'lucide-react';

function ProjectsSection() {
  const projects = [
    { title: 'Smart City Waste Management', desc: 'Implemented IoT-based waste collection system for a tier-2 city, reducing collection costs by 30%.' },
    { title: 'Industrial Wastewater Treatment', desc: 'Designed and commissioned advanced wastewater treatment plant for manufacturing facility.' },
    { title: 'Coastal Zone EIA Study', desc: 'Comprehensive environmental impact assessment for coastal development project spanning 50km.' },
    { title: 'Urban Green Spaces Mapping', desc: 'GIS-based analysis and planning for urban green infrastructure across metropolitan area.' },
    { title: 'Corporate Carbon Neutrality', desc: 'Developed roadmap for Fortune 500 company to achieve net-zero emissions by 2030.' },
    { title: 'River Rejuvenation Project', desc: 'Holistic river restoration plan integrating community participation and scientific monitoring.' }
  ];

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, projects.length - slidesPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <section id="projects" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-700">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforming communities through sustainable environmental solutions
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-blue-700" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-blue-700" />
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
              {projects.map((project, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{
                    minWidth: `calc(${100 / slidesPerView}% - ${(slidesPerView - 1) * 2 / slidesPerView}rem)`
                  }}
                  className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="bg-gradient-to-r from-blue-700 to-green-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{project.desc}</p>
                  <button className="text-blue-700 font-semibold hover:text-green-500 transition-colors">
                    Learn More →
                  </button>
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
                    ? 'w-8 bg-blue-700' 
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

export default ProjectsSection;