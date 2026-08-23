import React from "react";
import HomeNav from "../components/homeNav";

function Services() {
  const [showRetainers, setShowRetainers] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Page Header */}
      <section className="py-24 md:py-32 lg:py-48 bg-cream">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span
            className="inline-block mb-4 px-4 py-2 bg-brass text-charcoal text-sm font-bold rounded-full tracking-tighter"
          >
            Our Services
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-charcoal leading-tight tracking-tighter"
          >
            Culinary Consulting Packages
          </h1>
        </div>
      </section>

      {/* Service Packages Grid */}
      <section className="py-24 md:py-32 lg:py-48">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Monthly Retainer */}
            <article
              className="group rounded-2xl overflow-hidden bg-white border border-sage-200 hover:border-brass transition-colors duration-300"
            >
              <div
                className="relative h-80 bg-terracotta/10 group-hover:bg-terracotta/20 transition-colors duration-300"
              >
                <svg
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-brass"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-terracotta/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-terracotta"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-4h.01L9 5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-medium text-charcoal">Monthly Retainer</h3>
                    <p className="text-sage/70 text-sm">Ongoing culinary partnership</p>
                  </div>
                </div>
                <h3
                  className="text-2xl font-display font-bold text-charcoal mb-4 group-hover:text-brass transition-colors"
                >
                  Comprehensive Support
                </h3>
                <ul className="space-y-3 text-sage/80 text-sm">
                  <li>Monthly on-site consultations</li>
                  <li>Seasonal menu development</li>
                  <li>Staff training & compliance</li>
                  <li>KPI tracking & reporting</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-sage-100">
                  <p className="text-sage/60 text-sm mb-2">Starting at</p>
                  <p className="text-3xl font-display font-bold text-terracotta">$8,000/month</p>
                </div>
              </div>
            </article>

            {/* Menu R&D Project */}
            <article
              className="group rounded-2xl overflow-hidden bg-white border border-sage-200 hover:border-brass transition-colors duration-300"
            >
              <div
                className="relative h-80 bg-sage/10 group-hover:bg-sage/20 transition-colors duration-300"
              >
                <svg
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-brass"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-sage"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v2m5-14v2m2 5h2a2 2 0 012 2v2a2 2 0 01-2 2h-2v-2a2 2 0 00-2-2h-2v-2a2 2 0 01-2-2h-2v-2a2 2 0 01-2-2h-2v-2a2 2 0 01-2-2h-2v-2a2 2 0 01-2-2h-2v-2a2 2 0 01-2-2h-2v-2a2 2 0 01-2-2h-2v-2a2 2 0 01-2-2h-2v-2a2 2 0 01-2-2h-2Z" />
                    </svg>
                  </div>
                </div>
                <h3
                  className="text-2xl font-display font-bold text-charcoal mb-4 group-hover:text-brass transition-colors"
                >
                  Menu Research & Development
                </h3>
                <p className="text-sage/80 leading-relaxed mb-6">
                  We craft signature menus that define culinary identities, blending seasonal ingredients
                  with market positioning strategies that captivate diners and drive revenue.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sage/60 text-sm mb-2">Duration</p>
                    <p className="text-2xl font-semibold text-charcoal">8-12 weeks</p>
                  </div>
                  <div>
                    <p className="text-sage/60 text-sm mb-2">Investment</p>
                    <p className="text-2xl font-semibold text-terracotta">$15,000</p>
                  </div>
                </div>
                <button
                  className="mt-6 w-full py-3 bg-brass text-charcoal rounded-lg font-medium hover:text-white transition-colors"
                >
                  Start Project
                </button>
              </div>
            </article>

            {/* Brand Positioning */}
            <article
              className="group rounded-2xl overflow-hidden bg-white border border-sage-200 hover:border-brass transition-colors duration-300"
            >
              <div
                className="relative h-80 bg-brass/10 group-hover:bg-brass/20 transition-colors duration-300"
              >
                <svg
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-brass"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div className="p-8">
                <h3
                  className="text-2xl font-display font-bold text-charcoal mb-4 group-hover:text-brass transition-colors"
                >
                  Brand Positioning & Strategy
                </h3>
                <p className="text-sage/80 leading-relaxed mb-6">
                  We help culinary establishments define and communicate their unique value proposition,
                  ensuring every touchpoint reflects sophistication, authenticity, and market leadership.
                </p>
                <div grid grid-cols-2 gap-4>
                  <div>
                    <p className="text-sage/60 text-sm mb-2">Focus Areas</p>
                    <ul className="space-y-1 text-sage/80 text-sm">
                      <li>Market positioning</li>
                      <li>Brand story development</li>
                      <li>Competitive analysis</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sage/60 text-sm mb-2">Investment</p>
                    <p className="text-2xl font-semibold text-terracotta">$12,000</p>
                  </div>
                </div>
                <button
                  className="mt-6 w-full py-3 bg-brass text-charcoal rounded-lg font-medium hover:text-white transition-colors"
                >
                  Strategy Session
                </button>
              </div>
            </article>
            
          </div>
        </div>
      </section>

      {/* Toggle Section */}
      <section className="py-24 md:py-32 lg:py-48 bg-charcoal">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-display font-bold text-cream tracking-tighter mb-6"
            >
              Flexible Engagement Models
            </h2>
            <p className="text-sage/60 max-w-xl mx-auto leading-relaxed">
              Choose the model that best fits your operational needs and growth objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Flat Rate Model */}
            <article
              className="group rounded-2xl overflow-hidden bg-white border border-sage-200 hover:border-brass transition-colors duration-300"
            >
              <div
                className="relative h-64 lg:h-80 bg-sage/10 group-hover:bg-sage/20 transition-colors duration-300"
              >
                <svg
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-brass"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div className="p-8">
                <h3
                  className="text-2xl font-display font-bold text-charcoal mb-4 group-hover:text-brass transition-colors"
                >
                  Flat Consulting Rates
                </h3>
                <p className="text-sage/80 leading-relaxed mb-6">
                  Project-based pricing for specific culinary initiatives and one-time engagements.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sage/60 text-sm mb-2">Typical Projects</p>
                    <ul className="space-y-1 text-sage/80 text-xs">
                      <li>Menu development</li>
                      <li>Kitchen audit</li>
                      <li>Brand refresh</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sage/60 text-sm mb-2">Typical Budget</p>
                    <p className="text-2xl font-semibold text-terracotta">$5,000-$15,000</p>
                  </div>
                </div>
                <button
                  className="w-full py-3 bg-brass text-charcoal rounded-lg font-medium hover:text-white transition-colors"
                >
                  Get Quote
                </button>
              </div>
            </article>

            {/* Monthly Retainer (Toggle) */}
            <article
              className={`group rounded-2xl overflow-hidden bg-white border-brass border-b-2 border-brass/20 hover:border-brass/30 transition-colors duration-300 ${
                showRetainers ? 'bg-brass/5' : 'bg-white'
              }`}
            >
              <div
                className="relative h-64 lg:h-80 bg-terracotta/10 group-hover:bg-terracotta/20 transition-colors duration-300"
              >
                <svg
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-brass"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div className="p-8">
                <h3
                  className="text-2xl font-display font-bold text-charcoal mb-4 group-hover:text-brass transition-colors"
                >
                  Monthly Retainer
                </h3>
                <p className="text-sage/80 leading-relaxed mb-6">
                  Ongoing partnership for sustained culinary excellence and continuous improvement.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sage/60 text-sm mb-2">Included</p>
                    <ul className="space-y-1 text-sage/80 text-xs">
                      <li>Monthly on-site visits</li>
                      <li>Continuous menu development</li>
                      <li>Staff training sessions</li>
                      <li>Quarterly KPI reports</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sage/60 text-sm mb-2">Investment</p>
                    <p className="text-2xl font-semibold text-terracotta">$25,000/month</p>
                  </div>
                </div>
                <button
                  className="w-full py-3 bg-terracotta text-charcoal rounded-lg font-medium hover:text-white transition-colors"
                >
                  Commit Today
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 lg:py-48 bg-terracotta">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="absolute inset-0 bg-black/30 blur-lg opacity-50"
            aria-hidden="true"
          />
          <div className="relative text-center">
            <span
              className="inline-block px-4 py-2 bg-charcoal text-cream text-sm font-bold rounded-full tracking-tighter mb-6"
            >
              Ready to Elevate Your Culinary Operation?
            </span>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-charcoal mb-6 tracking-tight"
            >
              Start Your Culinary Transformation
            </h2>
            <p
              className="text-2xl md:text-xl text-cream/80 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Schedule a free consultation and discover how our expertise can elevate your operation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/book'}
                className="px-8 py-3 bg-cream text-terracotta rounded-lg font-medium hover:bg-sage-50 transition-colors"
              >
                Schedule Consultation
              </button>
              <button
                onClick={() => window.location.href = '/about'}
                className="px-8 py-3 border border-charcoal text-charcoal rounded-lg font-medium hover:bg-charcoal/10 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Footer CTA */}
      <footer className="bg-charcoal py-8 md:py-12">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brass rounded-sm flex items-center justify-center">
                <img
                  src="chef-hat.png"
                  alt="Chef Hat"
                  className="w-5 h-5"
                />
              </div>
              <span className="font-display font-semibold text-xl text-cream">
                Salal Culinary
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/services" className="text-sage/60 hover:text-brass transition-colors">Services</a>
              <a href="/portfolio" className="text-sage/60 hover:text-brass transition-colors">Portfolio</a>
              <a href="/blog" className="text-sage/60 hover:text-brass transition-colors">Blog</a>
            </div>
          </div>
          <p className="mt-4 text-sage/60 text-center">
            © {new Date().getFullYear()} Salal Culinary Consultancy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Services;