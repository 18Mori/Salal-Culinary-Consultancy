import React from "react";
import HomeNav from "../components/homeNav";

function Services() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <HomeNav />

      {/* Page Header */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-4">
            Consulting Packages
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight">
            Tailored Culinary <span className="font-serif italic text-amber-200">Practices</span>
          </h1>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Package 1 */}
            <div className="rounded-2xl p-8 bg-slate-900/40 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Continuous Guidance</span>
                <h3 className="text-2xl font-light text-white">Monthly Retainer</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  Dedicated operational support and advisory for growing restaurant groups and luxury operations.
                </p>
                <ul className="space-y-3 text-slate-300 text-sm font-light pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><span className="text-amber-400">✦</span> Monthly on-site consultations</li>
                  <li className="flex items-center gap-2"><span className="text-amber-400">✦</span> Seasonal menu development</li>
                  <li className="flex items-center gap-2"><span className="text-amber-400">✦</span> Staff training & compliance</li>
                  <li className="flex items-center gap-2"><span className="text-amber-400">✦</span> KPI tracking & reporting</li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Retainer Rate</p>
                <p className="text-3xl font-light text-amber-400">$8,000 <span className="text-sm text-slate-400">/ mo</span></p>
              </div>
            </div>

            {/* Package 2 */}
            <div className="rounded-2xl p-8 bg-slate-900/40 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Project Based</span>
                <h3 className="text-2xl font-light text-white">Menu Research & R&D</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  Engineering signature offerings, establishing margin efficiency, and capturing culinary identities.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Duration</p>
                    <p className="text-lg text-white font-light">8-12 weeks</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Investment</p>
                    <p className="text-lg text-amber-400 font-light">$15,000</p>
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full py-3.5 bg-amber-400 text-slate-950 font-semibold rounded-xl hover:bg-amber-300 transition-colors">
                Start Project
              </button>
            </div>

            {/* Package 3 */}
            <div className="rounded-2xl p-8 bg-slate-900/40 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Strategic Identity</span>
                <h3 className="text-2xl font-light text-white">Brand & Positioning</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  Refining brand narrative, visual touchpoints, and audience messaging for maximum market impact.
                </p>
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Focus Areas</p>
                  <p className="text-sm text-slate-300 font-light">Market positioning, culinary story development, and competitive analysis.</p>
                </div>
              </div>
              <button className="mt-8 w-full py-3.5 border border-slate-700 text-slate-200 font-medium rounded-xl hover:bg-slate-800 transition-colors">
                Book Strategy Session
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Start Your Culinary <span className="font-serif italic text-amber-200">Transformation</span>
          </h2>
          <p className="text-slate-400 text-lg font-light max-w-xl mx-auto">
            Schedule a private audit and discover how our expertise can optimize your kitchen.
          </p>
          <div className="pt-4">
            <button
              onClick={() => window.location.href = '/book'}
              className="px-8 py-4 bg-amber-400 text-slate-950 rounded-xl font-semibold hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/10"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-sm text-slate-500 text-center">
        <p>© {new Date().getFullYear()} Salal Culinary Consultancy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Services;