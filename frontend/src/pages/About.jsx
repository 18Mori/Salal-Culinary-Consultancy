import { useNavigate } from 'react-router-dom';
import HomeNav from "../components/homeNav";
import { ACCESS_TOKEN } from '../constants';


const About = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <HomeNav />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <img
          src="https://media.istockphoto.com/id/1165063882/photo/restaurant-healthy-food-delivery-in-take-away-boxes.jpg?s=612x612&w=0&k=20&c=IOC4sN-T-cCobmHE13NY_ml27Us6VK81SdTpdoFO2uw="
          alt="Professional kitchen environment"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
            About Salal Culinary
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            We’re passionate about elevating food service operations through expert consultancy.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-semibold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                To empower culinary businesses with actionable insights, proven strategies, and hands-on support that drive profitability, compliance, and excellence.
              </p>
              <p className="text-lg text-muted-foreground">
                From fine dining restaurants to large-scale catering operations, we partner with clients to overcome operational inefficiencies and scale sustainably.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="https://www.slowfood.com/wp-content/uploads/2023/07/cooker_SF0225160.jpg"
                alt="Chef consulting in kitchen"
                className="rounded-lg shadow-md w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-semibold text-foreground mb-12">
            Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We hold ourselves to the highest standards — because your business deserves nothing less.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">Integrity</h3>
              <p className="text-muted-foreground">
                Honest advice, transparent pricing, and long-term partnerships built on trust.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m82-120 258-360h202l298-348v708H82Zm70-233-64-46 172-241h202l188-219 60 52-212 247H300L152-353Zm86 153h522v-412L578-400H380L238-200Zm522 0Z"/></svg>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">Growth</h3>
              <p className="text-muted-foreground">
                We don't just fix problems — we help you grow into a stronger, more resilient business.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-semibold text-foreground">
              Industry-Leading Expertise
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              With over 50+ years of combined experience across hospitality, food safety, and operations,
              our consultants bring real-world knowledge to every engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div key={index} className="text-center group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-xl font-medium text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground italic">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Schedule a free consultation today and discover how our expertise can elevate your operation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <button
                variant="default"
                size="lg"
                onClick={() => navigate('/client_index')}
                className="px-8 py-3 bg-white text-primary hover:bg-gray-100 border-b-2 transition-colors"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                variant="default"
                size="lg"
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-white text-primary hover:bg-gray-500 border-b-2 transition-colors"
              >
                Login to Get Started
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Salal Culinary Consultancy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
