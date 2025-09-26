// src/components/HeroSection.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-transparent to-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Professional chef preparing gourmet dish"
          className="w-full h-full object-cover opacity-80"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight animate-fade-in-up">
            Elevating Culinary Standards –{' '}
            <span className="text-emerald-400">Profitability</span>,{' '}
            <span className="text-blue-400">Compliance</span> &{' '}
            <span className="text-yellow-300">Excellence</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Transform your culinary business with expert consultancy services. From restaurant operations to food safety compliance, we deliver results that matter.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button
              onClick={() => navigate('/client_index')}
              className="px-8 py-4 bg-white text-black rounded-md hover:bg-gray-100 transition-colors shadow-lg"
            >
              Book a Consultation
            </button>

            <button
              onClick={() => navigate('/about')}
              className="px-8 py-4 border border-white text-white rounded-md hover:bg-white/10 transition-colors"
            >
              Learn More
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm md:text-base text-white/80">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Certified Consultants</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>100+ Successful Projects</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Industry Expertise</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;