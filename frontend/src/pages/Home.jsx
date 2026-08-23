import React from "react";
import HomeNav from "../components/homeNav";
import { ACCESS_TOKEN } from "../constants";

function Home() {
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN);

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Hero Section - Asymmetrical Grid */}
      <section className="relative py-24 md:py-32 lg:py-48 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left Side - Imagery */}
          <div className="lg:block lg:w-1/2">
            <img
              src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
              alt="Gourmet culinary art"
              className="w-full h-[600px] lg:h-full object-cover lg:aspect-[4/3] rounded-lg opacity-90 transition-opacity duration-500 hover:opacity-100"
              loading="lazy"
            />
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-black/40 rounded-lg opacity-80 hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Right Side - Typographic Hero */}
          <div className="lg:block lg:w-1/2 lg:pl-8 lg:pt-20">
            <span
              className="inline-block mb-6 px-4 py-2 bg-brass text-charcoal text-sm font-bold rounded-full tracking-tighter"
            >
              Michelin-Star Consultancy
            </span>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-charcoal leading-tight mb-6 tracking-tight"
            >
              Elevating Culinary Standards
            </h1>
            <p
              className="text-2xl md:text-3xl lg:text-4xl text-sage/80 max-w-xl mb-8 leading-relaxed"
            >
              Transform your culinary business with expert consultancy services. From restaurant operations to food safety compliance, we deliver results that matter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => window.location.href = '/book'}
                className="px-8 py-4 bg-brass text-charcoal rounded-lg font-medium hover:bg-terracotta transition-colors shadow-lg"
              >
                Book a Consultation
              </button>
              <button
                onClick={() => window.location.href = '/about'}
                className="px-8 py-4 border border-sage-300 text-charcoal rounded-lg hover:bg-sage-50 transition-colors"
              >
                Learn More
              </button>
            </div>

            {/* Auth CTA for authenticated users */}
            {isAuthenticated ? (
              <button
                onClick={() => window.location.href = '/client_index'}
                className="mt-4 px-8 py-3 bg-cream text-terracotta rounded-lg font-medium hover:bg-sage-50 transition-colors"
              >
                Go to Dashboard
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Philosophy Highlight Section */}
      <section className="py-24 md:py-32 lg:py-48 bg-cream">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 lg:gap-16 items-center">
            {/* Text Content */}
            <div>
              <span
                className="inline-block mb-4 px-4 py-2 bg-brass text-charcoal text-sm font-bold rounded-full tracking-tighter"
              >
                Our Philosophy
              </span>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-charcoal leading-tight mb-6 tracking-tighter"
              >
                Crafting Culinary Excellence
              </h2>
              <p
                className="text-lg md:text-xl text-sage/80 mb-8 leading-relaxed"
              >
                At Salal Culinary Consultancy, we believe that great food starts with great operations. Our
                approach combines time-honored techniques with modern innovation, ensuring every kitchen we
                touch operates with precision, creativity, and purpose.
              </p>

              {/* Pull Quote */}
              <blockquote
                className="bg-white p-8 rounded-xl border border-sage-200 border-opacity-50 mt-8 ml-12 max-w-xl text-2xl md:text-2.5xl font-display italic text-charcoal/90 relative before:content-[''] before:absolute before:-top-4 before:left-6 before:w-12 before:h-12 before:bg-brass before:rounded-before before:after:content-[''] before:after:block before:after:w-[] before:after:h-[2] before:after:bg-before:after:before:after:before:after:before:after:before:after:before:after"
              >
                "The details are not the details. They make the design."
                <cite className="text-sage/80 font-medium mt-4 block">— Charles Eames</cite>
              </blockquote>
            </div>

            {/* Visual Element - Abstract Culinary Pattern */}
            <div className="lg:mt-0 lg:ml-16">
              <div
                className="relative h-64 lg:h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-terracotta/20 to-brass/20"
              >
                <div
                  className="absolute -top-6 -left-6 w-32 h-32 bg-brass rounded-full opacity-50 blur-xl"
                  aria-hidden="true"
                />
                <div
                  className="absolute bottom-0 right-0 w-40 h-40 bg-terracotta rounded-full opacity-50 blur-xl"
                  aria-hidden="true"
                />
              </div>
              <p
                className="text-center text-sage/60 text-sm mt-6"
              >
                Our team combines decades of Michelin-star experience with innovative culinary science.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Solutions Grid */}
      <section className="py-24 md:py-32 lg:py-48">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Solution 1: Menu R&D */}
            <article
              className="group rounded-2xl overflow-hidden bg-white hover-shadow-xl transition-shadow duration-300 border border-sage-200"
            >
              <div
                className="relative h-64 lg:h-80 bg-terracotta/20 group-hover:bg-terracotta/30 transition-colors duration-500"
              >
                <svg
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brass"
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
              <div className="p-6">
                <h3
                  className="text-2xl font-display font-bold text-charcoal mb-2 group-hover:text-brass transition-colors"
                >
                  Menu Research & Development
                </h3>
                <p
                  className="text-sage/80 leading-relaxed mb-4"
                >
                  We craft signature menus that define culinary identities, blending seasonal ingredients
                  with market positioning strategies that captivate diners and drive revenue.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sage/60">Learn More</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>
            </article>

            {/* Solution 2: Kitchen Workflow Optimization */}
            <article
              className="group rounded-2xl overflow-hidden bg-white hover-shadow-xl transition-shadow duration-300 border border-sage-200"
            >
              <div
                className="relative h-64 lg:h-80 bg-sage/20 group-hover:bg-sage/30 transition-colors duration-500"
              >
                <svg
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brass"
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
              <div className="p-6">
                <h3
                  className="text-2xl font-display font-bold text-charcoal mb-2 group-hover:text-brass transition-colors"
                >
                  Kitchen Workflow Optimization
                </h3>
                <p
                  className="text-sage/80 leading-relaxed mb-4"
                >
                  We analyze and redesign kitchen operations to eliminate bottlenecks, reduce waste, and
                  increase throughput—transforming chaotic workflows into seamless, profitable processes.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sage/60">Learn More</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>
            </article>

            {/* Solution 3: Brand Positioning */}
            <article
              className="group rounded-2xl overflow-hidden bg-white hover-shadow-xl transition-shadow duration-300 border border-sage-200"
            >
              <div
                className="relative h-64 lg:h-80 bg-primary/20 group-hover:bg-primary/30 transition-colors duration-500"
              >
                <svg
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brass"
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
              <div className="p-6">
                <h3
                  className="text-2xl font-display font-bold text-charcoal mb-2 group-hover:text-brass transition-colors"
                >
                  Brand Positioning & Strategy
                </h3>
                <p
                  className="text-sage/80 leading-relaxed mb-4"
                >
                  We help culinary establishments define and communicate their unique value proposition,
                  ensuring every touchpoint reflects sophistication, authenticity, and market leadership.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sage/60">Learn More</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="py-24 md:py-32 lg:py-48 bg-charcoal">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="bg-cream p-8 rounded-xl text-center border border-sage-200"
            >
              <div className="w-12 h-12 bg-brass rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-6 h-6 text-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10L7 7m3-3v12m-2-3h10a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2m6 7v7m-3-3H13" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal mb-3">10+ Years</h3>
              <p className="text-sage/60">of Michelin-starred excellence</p>
            </div>
            <div
              className="bg-cream p-8 rounded-xl text-center border border-sage-200"
            >
              <div className="w-12 h-12 bg-brass rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-6 h-6 text-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10L7 7m3-3v12m-2-3h10a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2m6 7v7m-3-3H13" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal mb-3">50+</h3>
              <p className="text-sage/60">successful engagements</p>
            </div>
            <div
              className="bg-cream p-8 rounded-xl text-center border border-sage-200"
            >
              <div className="w-12 h-12 bg-brass rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-6 h-6 text-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10L7 7m3-3v12m-2-3h10a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2m6 7v7m-3-3H13" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal mb-3">30+</h3>
              <p className="text-sage/60">published publications</p>
            </div>
            <div
              className="bg-cream p-8 rounded-xl text-center border border-sage-200"
            >
              <div className="w-12 h-12 bg-brass rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-6 h-6 text-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10L7 7m3-3v12m-2-3h10a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2m6 7v7m-3-3H13" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal mb-3">Available</h3>
              <p className="text-sage/60">for consultation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width */}
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
              Ready to Transform Your Kitchen?
            </span>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-charcoal mb-6 tracking-tight"
            >
              Let's Create Culinary Excellence Together
            </h2>
            <p
              className="text-2xl md:text-xl text-cream/80 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Schedule a free consultation and discover how our expertise can elevate your culinary operation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <button
                  onClick={() => window.location.href = '/client_index'}
                  className="px-8 py-3 bg-cream text-terracotta rounded-lg font-medium hover:bg-sage-50 transition-colors"
                >
                  Access Dashboard
                </button>
              ) : (
                <button
                  onClick={() => window.location.href = '/login'}
                  className="px-8 py-3 bg-cream text-terracotta rounded-lg font-medium hover:bg-sage-50 transition-colors"
                >
                  Schedule Consultation
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Nav CTA */}
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
              <span
                className="font-display font-semibold text-xl text-cream"
              >
                Salal Culinary
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-sage/60 hover:text-brass transition-colors"
              >
                Home
              </a>
              <a
                href="/about"
                className="text-sage/60 hover:text-brass transition-colors"
              >
                About
              </a>
              <a
                href="/services"
                className="text-sage/60 hover:text-brass transition-colors"
              >
                Services
              </a>
              <a
                href="/portfolio"
                className="text-sage/60 hover:text-brass transition-colors"
              >
                Portfolio
              </a>
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

export default Home;