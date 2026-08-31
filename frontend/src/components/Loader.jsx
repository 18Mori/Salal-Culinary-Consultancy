import React from 'react';

// Culinary Loader Keyframes & Styles
const CulinaryStyles = () => (
  <style>{`
    @keyframes liftCloche {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-16px) rotate(-5deg); }
    }
    @keyframes steamRise {
      0% { transform: translateY(0) scaleX(1); opacity: 0; }
      50% { opacity: 0.8; }
      100% { transform: translateY(-22px) scaleX(1.5); opacity: 0; }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.35; filter: drop-shadow(0 0 12px rgba(234, 179, 8, 0.25)); }
      50% { opacity: 0.9; filter: drop-shadow(0 0 24px rgba(234, 179, 8, 0.6)); }
    }
    .cloche-bounce {
      animation: liftCloche 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
    }
    .steam-1 { animation: steamRise 1.8s ease-out infinite; }
    .steam-2 { animation: steamRise 1.8s ease-out 0.6s infinite; }
    .steam-3 { animation: steamRise 1.8s ease-out 1.2s infinite; }
    .glow-gold { animation: pulseGlow 2s ease-in-out infinite; }
  `}</style>
);

// Fullscreen Culinary Overlay Loader Component
export const CulinaryLoader = ({ message = "Crafting your culinary experience" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xl p-4">
      <CulinaryStyles />
      
      {/* Centered Glass Card Modal */}
      <div className="flex flex-col items-center justify-center p-20 min-w-[300px] max-w-md bg-charcoal/60 border border-white/10 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center">
        
        {/* Animated Culinary Icon Container */}
        <div className="relative flex items-center justify-center w-28 h-28 mb-5">
          
          {/* Steam Micro-Animations */}
          <div className="absolute -top-4 flex justify-between w-12 px-1 z-10">
            <span className="steam-1 w-1.5 h-5 bg-amber-400/80 rounded-full blur-[1px]" />
            <span className="steam-2 w-1.5 h-6 bg-amber-300 rounded-full blur-[1px]" />
            <span className="steam-3 w-1.5 h-5 bg-amber-400/80 rounded-full blur-[1px]" />
          </div>

          {/* Glowing Outer Aura */}
          <div className="absolute inset-0 rounded-full bg-amber-500/15 blur-2xl glow-gold" />

          {/* SVG Cloche & Serving Platter Icon */}
          <svg 
            className="w-20 h-20 text-amber-400 relative z-20 drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)]" 
            viewBox="0 0 64 64" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Animated Cloche Dome */}
            <g className="cloche-bounce origin-bottom">
              <circle cx="32" cy="16" r="3.5" className="fill-amber-400" />
              <path d="M 14 38 A 18 18 0 0 1 50 38 Z" fill="rgba(251, 191, 36, 0.18)" />
              <path d="M 12 38 L 52 38" strokeWidth="3.5" />
            </g>

            {/* Base Serving Tray */}
            <path d="M 8 44 C 8 44 14 48 32 48 C 50 48 56 44 56 44" strokeWidth="3.5" />
            <path d="M 4 44 L 60 44" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Status Message & Bouncing Dots */}
        <div className="flex items-center space-x-2 text-amber-100/90 font-medium tracking-wide text-base">
          <span>{message}</span>
          <span className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
          </span>
        </div>
      </div>
    </div>
  );
};

// Compatible Wrapper Object matching your exact original export keys
const SkeletonLoader = {
  Card: () => <CulinaryLoader message="Preparing menu analytics" />,
  Avatar: () => <CulinaryLoader message="Loading chef profile" />,
  Paragraph: () => <CulinaryLoader message="Plating content" />,
  Text: () => <CulinaryLoader message="Consulting recipes" />,
  TableRow: () => <CulinaryLoader message="Fetching bookings" />,
  Image: () => <CulinaryLoader message="Loading culinary media" />,
  Section: () => <CulinaryLoader message="Setting up consultancy suite" />,
  Heading: () => <CulinaryLoader message="Preparing section" />,
};

export default SkeletonLoader;