import React, { useState } from "react";
import HomeNav from "../components/homeNav";

function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all');
  const filters = ['all', 'fine-dining', 'catering', 'compliance', 'branding'];

  const projects = [
    {
      id: 1,
      title: "The Savoy Group",
      category: "fine-dining",
      location: "London, UK",
      challenge: "Elevating kitchen operations to reduce waste while maintaining Michelin star metrics.",
      solution: "Comprehensive workflow audit, menu re-engineering, and staff precision training.",
      result: "25% waste reduction, 15% cost savings, maintained Michelin star rating.",
      metrics: ["30% waste reduction", "15% cost savings", "Michelin star maintained"],
      image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "La Dolce Vita Catering",
      category: "catering",
      location: "Los Angeles, CA",
      challenge: "Streamlining large scale event catering for 500+ guests with speed and quality.",
      solution: "Standardized preparation recipes, logistics optimization, and QA protocols.",
      result: "40% faster setup times, consistent top-tier dining across 200+ events.",
      metrics: ["40% faster setup", "200+ events delivered", "Quality score 9.8/10"],
      image: "https://images.pexels.com/photos/2611659/pexels-photo-2611659.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      id: 3,
      title: "La Petite Maison",
      category: "compliance",
      location: "New York, NY",
      challenge: "Achieving full food safety compliance across multi-kitchen setups.",
      solution: "HACCP implementation, protocol enforcement, and leadership certifications.",
      result: "100% compliance score, 0 health violations across 3 years.",
      metrics: ["100% compliance", "0 health violations", "3-year certification"],
      image: "https://images.pexels.com/photos/7040552/pexels-photo-7040552.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
    {
      id: 4,
      title: "Urban Harbor Group",
      category: "branding",
      location: "Miami, FL",
      challenge: "Rebranding a collection of 5 dining venues with disjointed positioning.",
      solution: "Brand architecture, custom visual identities, and refined operational strategy.",
      result: "35% increase in reservations within two quarters across all sites.",
      metrics: ["35% reservation increase", "Unified brand identity", "5 locations refreshed"],
      image: "https://images.pexels.com/photos/1043477/pexels-photo-1043477.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <HomeNav />

      {/* Header */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-4">
            Case Studies
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
            Selected <span className="font-serif italic text-amber-200">Engagements</span>
          </h1>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/10'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {filter === 'all' ? 'All Case Studies' : filter.replace('-', ' ')}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects
              .filter((p) => activeFilter === 'all' || p.category === activeFilter)
              .map((project) => (
                <article
                  key={project.id}
                  className="rounded-2xl overflow-hidden bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden border-b border-slate-800">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">{project.category.replace('-', ' ')}</span>
                      <span className="text-xs text-slate-500">{project.location}</span>
                    </div>
                    <h3 className="text-2xl font-light text-white">{project.title}</h3>
                    
                    <div className="space-y-2 pt-2 border-t border-slate-800/80 text-sm text-slate-400 font-light">
                      <p><strong className="text-slate-200 font-normal">Challenge:</strong> {project.challenge}</p>
                      <p><strong className="text-slate-200 font-normal">Result:</strong> {project.result}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                      {project.metrics.map((metric, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-sm text-slate-500 text-center">
        <p>© {new Date().getFullYear()} Salal Culinary Consultancy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Portfolio;