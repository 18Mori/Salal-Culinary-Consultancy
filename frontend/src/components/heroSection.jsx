import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="bg-[url('/patterns/subtle-stripe.png')] bg-repeat bg-center absolute inset-0 opacity-5"></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-cream leading-tight animate-fade-in-up">
            Elevating Culinary Standards –
            <span className="text-terracotta">Proficiency</span>,{' '}
            <span className="text-sage">Compliance</span> &{' '}
            <span className="text-brass">Excellence</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-sage/60 max-w-2xl mx-auto leading-relaxed">
            Transform your culinary business with expert consultancy services. From restaurant operations to food safety compliance, we deliver results that matter.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button
              onClick={() => navigate('/client_index')}
              className="px-8 py-4 bg-brass text-charcoal rounded-lg hover:bg-terracotta transition-colors shadow-lg"
            >
              Book a Consultation
            </button>

            <button
              onClick={() => navigate('/about')}
              className="px-8 py-4 border border-sage-300 text-charcoal rounded-lg hover:bg-sage-50 transition-colors"
            >
              Learn More
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-sage/60">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-terracotta rounded-full"></div>
              <span>Expert Consultants</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-terracotta rounded-full"></div>
              <span>10+ Years Experience</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-terracotta rounded-full"></div>
              <span>Personalized Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;