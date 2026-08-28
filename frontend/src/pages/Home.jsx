import React from "react";
import HomeNav from "../components/homeNav";
import { ACCESS_TOKEN } from "../constants";

function Home() {
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <HomeNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Typographic Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Michelin-Star Consultancy
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
                Elevating Culinary <br />
                <span className="font-serif italic font-normal text-amber-200">Standards.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 max-w-xl font-light leading-relaxed">
                Transform your restaurant operations, optimize kitchen performance, and engineer unforgettable dining experiences with expert culinary leadership.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => (window.location.href = "/booking")}
                  className="px-8 py-4 rounded-xl bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition-all duration-300 shadow-lg shadow-amber-400/20 active:scale-[0.98]"
                >
                  Book a Consultation
                </button>
                <button
                  onClick={() => (window.location.href = "/about")}
                  className="px-8 py-4 rounded-xl border border-slate-800 text-slate-300 font-medium hover:bg-slate-900 hover:text-white hover:border-slate-700 transition-all duration-300"
                >
                  Explore Practice
                </button>
              </div>

              {isAuthenticated && (
                <div className="pt-2">
                  <button
                    onClick={() => (window.location.href = "/client_dashboard")}
                    className="inline-flex items-center text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors gap-2"
                  >
                    Go to Client Portal &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Imagery with Clean Framing */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
                  alt="Gourmet culinary art"
                  className="w-full h-[500px] lg:h-[580px] object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80">
                  <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">Standard of Excellence</p>
                  <p className="text-sm text-slate-300">Precision workflow and bespoke menu development tailored for world-class venues.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-slate-900/50 border-y border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                Our Philosophy
              </span>
              <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight leading-tight">
                Crafting Culinary <span className="font-serif italic text-slate-300">Excellence</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-light">
                At Salal Culinary Consultancy, we believe exceptional guest experiences rest on engineered kitchen precision. We marry time-honored techniques with contemporary operational design.
              </p>

              <blockquote className="mt-8 p-6 rounded-2xl bg-slate-950 border border-slate-800 relative">
                <p className="text-xl font-serif italic text-slate-200 leading-snug">
                  "The details are not the details. They make the design."
                </p>
                <cite className="block text-sm font-sans not-italic text-slate-500 mt-3">— Charles Eames</cite>
              </blockquote>
            </div>

            <div className="lg:col-span-5">
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden space-y-6">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-serif text-2xl">
                  ✦
                </div>
                <h3 className="text-xl font-medium text-white">Modern Culinary Science</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our team brings multi-decade Michelin-star experience directly to your kitchen, streamlining operations while preserving culinary integrity.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">Core Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-light text-white">Tailored Culinary Solutions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group rounded-2xl p-8 bg-slate-900/40 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center font-semibold">01</div>
                <h3 className="text-xl font-medium text-white group-hover:text-amber-300 transition-colors">Menu Research & R&D</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  Signature menus crafted to establish market identity, balance seasonal availability, and optimize margin performance.
                </p>
              </div>
              <a href="/services" className="inline-flex items-center text-xs font-semibold tracking-wider text-amber-400 uppercase mt-8 gap-2">
                Learn More <span>&rarr;</span>
              </a>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl p-8 bg-slate-900/40 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center font-semibold">02</div>
                <h3 className="text-xl font-medium text-white group-hover:text-amber-300 transition-colors">Workflow Optimization</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  Kitchen floorplan and operational re-engineering to minimize bottlenecking, cut kitchen waste, and elevate output speed.
                </p>
              </div>
              <a href="/services" className="inline-flex items-center text-xs font-semibold tracking-wider text-amber-400 uppercase mt-8 gap-2">
                Learn More <span>&rarr;</span>
              </a>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl p-8 bg-slate-900/40 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center font-semibold">03</div>
                <h3 className="text-xl font-medium text-white group-hover:text-amber-300 transition-colors">Brand & Strategy</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  Positioning and identity alignment to ensure every touchpoint conveys luxury, precision, and culinary excellence.
                </p>
              </div>
              <a href="/services" className="inline-flex items-center text-xs font-semibold tracking-wider text-amber-400 uppercase mt-8 gap-2">
                Learn More <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 border-r last:border-r-0 border-slate-800/80">
              <div className="text-4xl sm:text-5xl font-light text-white mb-2">10+</div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Years Industry Leadership</p>
            </div>
            <div className="text-center p-6 border-r last:border-r-0 border-slate-800/80">
              <div className="text-4xl sm:text-5xl font-light text-white mb-2">50+</div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Engagements Completed</p>
            </div>
            <div className="text-center p-6 border-r last:border-r-0 border-slate-800/80">
              <div className="text-4xl sm:text-5xl font-light text-white mb-2">30+</div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Published Feature Studies</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl sm:text-5xl font-light text-amber-400 mb-2">100%</div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Client Confidentiality</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-6xl font-light text-white tracking-tight">
            Ready to Transform Your <span className="font-serif italic text-amber-200">Operation?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-light">
            Schedule a private consultation to review your current setup and explore tailored growth strategies.
          </p>
          <div>
            <button
              onClick={() => (window.location.href = isAuthenticated ? "/client_dashboard" : "/login")}
              className="px-10 py-4 rounded-xl bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition-all duration-300 shadow-xl shadow-amber-400/10"
            >
              {isAuthenticated ? "Access Client Dashboard" : "Schedule Consultation"}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-serif">
              S
            </div>
            <span className="font-medium text-slate-200 tracking-wide">Salal Culinary Consultancy</span>
          </div>
          <div className="flex space-x-8">
            <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
            <a href="/about" className="hover:text-amber-400 transition-colors">About</a>
            <a href="/services" className="hover:text-amber-400 transition-colors">Services</a>
            <a href="/portfolio" className="hover:text-amber-400 transition-colors">Portfolio</a>
          </div>
          <p>© {new Date().getFullYear()} Salal Culinary Consultancy.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;