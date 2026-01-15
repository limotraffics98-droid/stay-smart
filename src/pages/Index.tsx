import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchForm } from '@/components/search/SearchForm';
import { HotelCard } from '@/components/hotel/HotelCard';
import { DestinationCard } from '@/components/destination/DestinationCard';
import { hotels, popularDestinations } from '@/data/mockData';
import { Shield, Clock, CreditCard, Headphones, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const featuredHotels = hotels.filter((h) => h.featured);
  const trendingHotels = hotels.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar transparent />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
              ✨ Over 100,000+ Hotels Worldwide
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your Perfect
              <span className="text-gradient-gold block mt-2">Luxury Escape</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              From boutique hideaways to world-renowned resorts, find extraordinary stays that create memories for a lifetime.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <SearchForm variant="hero" />
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">100K+</p>
              <p className="text-white/60 text-sm mt-1">Hotels</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">50+</p>
              <p className="text-white/60 text-sm mt-1">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">2M+</p>
              <p className="text-white/60 text-sm mt-1">Happy Guests</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">4.9</p>
              <p className="text-white/60 text-sm mt-1">Avg. Rating</p>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(210 20% 98%)" />
          </svg>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Handpicked Selection</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Featured Hotels
              </h2>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link to="/search" className="gap-2">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Explore</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Discover the most sought-after destinations with exceptional accommodations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((destination) => (
              <DestinationCard key={destination.city} {...destination} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Hotels */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Most Popular</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Trending This Week
              </h2>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link to="/search" className="gap-2">
                Explore More <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Why StayBook</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              The Smart Way to Book
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Best Price Guarantee</h3>
              <p className="text-white/70 text-sm">
                Find a lower price? We'll match it and give you an extra 10% off.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Free Cancellation</h3>
              <p className="text-white/70 text-sm">
                Plans change. Get a full refund when you cancel up to 24 hours before check-in.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-white/70 text-sm">
                Your payment information is encrypted and secure. Book with confidence.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-white/70 text-sm">
                Our dedicated team is available around the clock to assist you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80"
              alt="Luxury hotel"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/50" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-lg">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                    Get Exclusive Member Deals
                  </h2>
                  <p className="text-white/80 mb-8">
                    Sign up today and unlock special rates, early access to sales, and personalized recommendations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="hero" size="xl" asChild>
                      <Link to="/register">Join Now — It's Free</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              What Our Guests Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Travel Blogger',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                quote: 'StayBook made our honeymoon unforgettable. The hotel recommendations were spot-on, and the booking process was seamless.',
              },
              {
                name: 'Michael Chen',
                role: 'Business Executive',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                quote: 'As a frequent traveler, I appreciate the consistency and quality of hotels on StayBook. Best booking platform hands down.',
              },
              {
                name: 'Emily Davis',
                role: 'Family Traveler',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
                quote: 'Finding family-friendly hotels has never been easier. The filters and reviews help us choose the perfect stay every time.',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 shadow-card">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
