
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, BarChart3, BookOpen, ShieldCheck, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 lg:py-32 bg-gradient-to-b from-white to-secondary/30 relative overflow-hidden">
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 max-w-2xl"
              >
                <div className="inline-block mb-4">
                  <div className="flex items-center space-x-2 bg-secondary px-3 py-1 rounded-full">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-sm font-medium">Premium Trading Knowledge</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Master the Markets with <span className="text-primary">Professional</span> Trading Guides
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                  Elevate your trading skills with our premium collection of SMC and ICT methodology guides, crafted by professional traders for serious market participants.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/products')}
                    className="gap-2"
                  >
                    Browse Products
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/products?category=Featured')}
                  >
                    View Featured Resources
                  </Button>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 w-full lg:max-w-[550px]"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=1000" 
                    alt="Trading charts and analysis" 
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-white font-medium text-lg mb-2">Join thousands of traders</p>
                    <p className="text-white/80 text-sm max-w-sm">
                      Our comprehensive guides have helped traders from over 40 countries master professional trading techniques
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Background Elements */}
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/40 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our Trading Resources?</h2>
              <p className="text-muted-foreground">
                Our digital products are created by active professional traders with years of market experience, designed to transfer real-world knowledge effectively.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl border border-border"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Proven Strategies</h3>
                <p className="text-muted-foreground">
                  All methods and strategies are battle-tested in real market conditions across various timeframes.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl border border-border"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Comprehensive Detail</h3>
                <p className="text-muted-foreground">
                  Our guides dive deep into SMC and ICT concepts with clear examples and practical applications.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl border border-border"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
                <p className="text-muted-foreground">
                  All materials undergo rigorous review to ensure accuracy, clarity, and educational value.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl border border-border"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Trader First Approach</h3>
                <p className="text-muted-foreground">
                  Created by traders for traders with a focus on practical implementation rather than theory.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Featured Products Section */}
        <FeaturedProducts />
        
        {/* Testimonials Section */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-muted-foreground">
                Thousands of traders have transformed their approach to the markets with our premium resources.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl border border-border"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                      JD
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <p className="text-sm text-muted-foreground">Forex Trader</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  "The SMC Trading Fundamentals guide completely changed my approach to market analysis. The clarity of explanation is unmatched."
                </p>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl border border-border"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                      MS
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Mary Smith</h4>
                    <p className="text-sm text-muted-foreground">Crypto Trader</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  "The ICT Strategy Blueprint is worth every penny. I've been trading for 5 years and still found numerous insights I hadn't considered."
                </p>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl border border-border"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                      RJ
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Robert Johnson</h4>
                    <p className="text-sm text-muted-foreground">Stock Trader</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  "The Advanced Price Action Analysis guide has concepts I've never seen explained so clearly elsewhere. Truly exceptional value."
                </p>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="container px-4 mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Trading?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Discover our complete collection of premium trading resources and take your market analysis to the next level.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/products')}
                  className="gap-2"
                >
                  Explore All Products
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
                <svg width="350" height="350" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 6H3M18 12H6M15 18H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
