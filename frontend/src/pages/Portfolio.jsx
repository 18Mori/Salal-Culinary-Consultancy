import React from "react";
import HomeNav from "../components/homeNav";

function Portfolio() {
  const [activeFilter, setActiveFilter] = React.useState('all');
  const filters = ['all', 'fine-dining', 'catering', 'compliance', 'branding'];

  const projects = [
    {
      id: 1,
      title: "The Savoy Group",
      category: "fine-dining",
      location: "London, UK",
      challenge: "Elevating a 3-Michelin-star restaurant's kitchen operations to reduce waste by 30%",
      solution: "Comprehensive workflow audit, menu engineering, staff training program",
      result: "25% waste reduction, 15% cost savings, maintained Michelin star rating",
      metrics: ["30% waste reduction", "15% cost savings", "Michelin star maintained"],
      image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "La Dolce Vita Catering",
      category: "catering",
      location: "Los Angeles, CA",
      challenge: "Streamlining large-scale event catering for 500+ guests while maintaining quality",
      solution: "Standardized recipes, logistics optimization, quality control protocols",
      result: "40% faster setup times, consistent quality across 200+ events",
      metrics: ["40% faster setup", "200+ events delivered", "Quality score 9.8/10"],
      image: "https://images.pexels.com/photos/2611659/pexels-photo-2611659.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      id: 3,
      title: "La Petite Maison",
      category: "compliance",
      location: "New York, NY",
      challenge: "Achieving full food safety compliance across multiple kitchen locations",
      solution: "HACCP implementation, safety protocols, staff certification programs",
      result: "100% compliance score, 0 violations, 3-year certification",
      metrics: ["100% compliance", "0 health violations", "3-year certification"],
      image: "https://images.pexels.com/photos/7040552/pexels-photo-7040552.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      id: 4,
      title: "Urban Harbor Group",
      category: "branding",
      location: "Miami, FL",
      challenge: "Rebranding a collection of 5 restaurants with inconsistent market positioning",
      solution: "Brand architecture, visual identity, marketing strategy, digital presence",
      result: "35% increase in reservations, unified brand across all locations",
      metrics: ["35% reservation increase", "Unified brand identity", "5 locations refreshed"],
      image: "https://images.pexels.com/photos/1043477/pexels-photo-1043477.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Page Header */}
      <section className="py-24 md:py-32 lg:py-48 bg-cream">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span
            className="inline-block mb-4 px-4 py-2 bg-brass text-charcoal text-sm font-bold rounded-full tracking-tighter"
          >
            Case Studies
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-charcoal leading-tight tracking-tighter"
          >
            Success Stories
          </h1>
          <p className="text-2xl md:text-xl text-sage/80 mt-6 leading-relaxed">
            Transformations achieved through expert culinary consultancy
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 md:py-12 bg-charcoal/10">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 grid-rows-2 gap-4 max-w-xl">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-brass text-charcoal'
                    : 'text-sage/70 hover:bg-charcoal/10 hover:text-brass'
                }`}
                aria-filter={filter}
              >
                {filter === 'all'
                  ? 'All Projects'
                  : filter.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 md:py-32 lg:py-48">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => {
              const show =
                activeFilter === 'all' || project.category === activeFilter;
              if (!show) return null;

              return (
                <article
                  key={project.id}
                  className="group rounded-2xl overflow-hidden bg-white border border-sage-200 hover-shadow-xl transition-shadow duration-300"
                >
                  <div
                    className="relative h-64 lg:h-80 overflow-hidden rounded-t-2xl bg-primary/20"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-2xl font-display font-bold text-charcoal mb-2"
                    >
                      {project.title}
                    </h3>
                    <p className="text-sage/70 text-sm mb-4">
                      {project.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sage/60 text-xs">{project.category.replace(
                        '-',
                        ' '
                      ).replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover:rotate-15"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-display font-semibold text-charcoal mb-3">
                      {project.challenge}
                    </h4>
                    <p className="text-sage/80 leading-relaxed mb-4">
                      {project.solution}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sage/80 text-sm">
                      <div>
                        <p className="font-medium mb-1">Challenge</p>
                        <p>{project.challenge}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Result</p>
                        <p>{project.result}</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-sage-100">
                      <p className="text-sage/60 text-sm mb-2">Key Metrics</p>
                      <div className="grid grid-cols-3 gap-2">
                        {project.metrics.map((metric, i) => (
                          <div key={i} className="bg-charcoal/10 rounded-lg p-3">
                            <p className="text-xs text-sage/60">{metric}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
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
              Discover More Transformations
            </span>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-charcoal mb-6 tracking-tight"
            >
              Partner with Excellence
            </h2>
            <p
              className="text-2xl md:text-xl text-cream/80 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              We've helped culinary establishments across five continents achieve operational
              excellence and sustain the highest standards of quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/book'}
                className="px-8 py-3 bg-cream text-terracotta rounded-lg font-medium hover:bg-sage-50 transition-colors"
              >
                Start Your Journey
              </button>
              <button
                onClick={() => window.location.href = '/about'}
                className="px-8 py-3 border border-charcoal text-charcoal rounded-lg font-medium hover:bg-charcoal/10 transition-colors"
              >
                About Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Footer */}
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

export default Portfolio;