import { useNavigate } from 'react-router-dom';
import HomeNav from "../components/homeNav";
import { ACCESS_TOKEN } from '../constants';

const About = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <HomeNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-4">
            Our Story & Heritage
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-4 tracking-tight">
            About Salal <span className="font-serif italic text-amber-200">Culinary</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed">
            Elevating food service operations worldwide through bespoke culinary consultancy, operational audits, and modern kitchen strategy.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                Purpose Driven
              </span>
              <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
                Our <span className="font-serif italic text-slate-300">Mission</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-light">
                To empower culinary businesses with actionable insights, proven strategies, and hands on support that drive profitability, compliance, and excellence.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed font-light">
                From fine dining venues to large scale catering operations, we partner with teams to eliminate inefficiencies and scale sustainably.
              </p>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src="https://www.slowfood.com/wp-content/uploads/2023/07/cooker_SF0225160.jpg"
                  alt="Chef consulting in kitchen"
                  className="w-full object-cover h-[400px] scale-105 hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">Guiding Philosophy</span>
            <h2 className="text-3xl sm:text-4xl font-light text-white mt-2">Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/40 rounded-2xl p-8 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center mb-6 text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Excellence</h3>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                We hold ourselves to the highest standards — because your business deserves nothing less.
              </p>
            </div>

            <div className="bg-slate-900/40 rounded-2xl p-8 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center mb-6 text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Integrity</h3>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Honest advice, transparent pricing, and long term partnerships built on trust.
              </p>
            </div>

            <div className="bg-slate-900/40 rounded-2xl p-8 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center mb-6 text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Growth</h3>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                We don't just solve immediate issues — we optimize structure so your kitchen thrives at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Expertise */}
      <section className="py-24 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">Industry Veterans</span>
            <h2 className="text-3xl sm:text-4xl font-light text-white mt-2">Executive Leadership</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Johnson",
                role: "Food Safety & Compliance Director",
                image: "https://m.media-amazon.com/images/S/amzn-author-media-prod/9vc1eji4dv9cgpq74tr4c67r04._SY600_.jpg",
                bio: "Ph.D. in Food Microbiology. Former FDA advisor."
              },
              {
                name: "Chef Max Chen",
                role: "Menu Development Lead",
                image: "https://www.foodbanknyc.org/wp-content/uploads/2025/07/fbnyc-man-in-front-of-food-distribution.jpg",
                bio: "Award-winning chef with global restaurant experience."
              },
              {
                name: "John Wilson",
                role: "Operations Strategist",
                image: "https://www.chicagosfoodbank.org/wp-content/uploads/2025/09/GCFD_081325_-19_900x600-490x320.jpg",
                bio: "Led turnaround of 30+ underperforming kitchens."
              }
            ].map((member, index) => (
              <div key={index} className="text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800/80">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-amber-400/30 shadow-xl"
                />
                <h3 className="text-xl font-medium text-white">{member.name}</h3>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider my-1">{member.role}</p>
                <p className="text-sm text-slate-400 font-light italic mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">
            Ready to Elevate Your <span className="font-serif italic text-amber-200">Operation?</span>
          </h2>
          <p className="text-slate-400 text-lg font-light max-w-xl mx-auto">
            Schedule a free consultation today and discover how our expertise can transform your business.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate(isAuthenticated ? '/client_dashboard' : '/login')}
              className="px-8 py-4 bg-amber-400 text-slate-950 rounded-xl font-semibold hover:bg-amber-300 transition-all duration-300 shadow-lg shadow-amber-400/10"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Login to Get Started'}
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center space-x-6">
            <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
            <a href="/about" className="hover:text-amber-400 transition-colors">About</a>
            <a href="/services" className="hover:text-amber-400 transition-colors">Services</a>
            <a href="/portfolio" className="hover:text-amber-400 transition-colors">Portfolio</a>
          </div>
          <p>© {new Date().getFullYear()} Salal Culinary Consultancy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;