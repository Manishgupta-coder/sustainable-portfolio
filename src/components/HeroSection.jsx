import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&h=1080&fit=crop',
      title: 'Driving Sustainable Solutions',
      subtitle: 'for a Greener Future',
      description: 'Delivering data-driven environmental consultancy for urban ecosystems.'
    },
    {
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&h=1080&fit=crop',
      title: 'Environmental Impact Assessment',
      subtitle: 'with Precision & Care',
      description: 'Comprehensive analysis for sustainable industrial development.'
    },
    {
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&h=1080&fit=crop',
      title: "Building Tomorrow's Ecosystem",
      subtitle: 'Today',
      description: 'Innovative strategies for environmental conservation and restoration.'
    }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Slides Container */}
      <div className="relative w-full h-screen overflow-hidden">
        <motion.div
          className="flex w-full h-full"
          animate={{ x: `-${currentSlide * 100}%` }}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.8 }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 h-screen relative flex items-center justify-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-green-900/60 to-blue-900/70"></div>

              {/* Slide content */}
              <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 text-white max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-300">
                    {slide.subtitle}
                  </span>
                </h1>
                <p className="text-lg md:text-xl">{slide.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 flex justify-center w-full gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {/* <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button> */}
    </section>
  );
}

export default HeroSection;
