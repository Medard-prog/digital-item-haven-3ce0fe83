import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BookOpen, 
  TrendingUp, 
  LineChart, 
  PieChart, 
  BarChart, 
  User, 
  Shield, 
  Clock, 
  MessageCircle, 
  CheckCircle2,
  Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const testimonials = [
  {
    id: 1,
    name: "Michael Thompson",
    title: "Professional Forex Trader",
    content: "The SMC course completely changed my approach to trading. I've been consistently profitable for 6 months now after struggling for years. The market structure concepts were a game-changer for me.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Day Trader",
    content: "I was skeptical at first, but the ICT methodology taught in these courses helped me identify high-probability setups I was missing before. My win rate has improved from 45% to nearly 70%.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "David Chen",
    title: "Swing Trader",
    content: "The trading psychology material alone is worth the price. Learning to manage my emotions and develop a proper mindset has been transformative. I no longer overtrade or chase losses.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/52.jpg"
  }
];

const Index = () => {
  const { state } = useStore();
  const featuredProducts = state.products.filter(product => product.featured);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 md:py-32">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 bg-clip-text text-transparent">
                Master Smart Money Concepts & ICT Trading
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Premium trading education resources that will transform your trading approach and help you understand how institutional traders move the markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" asChild>
                  <Link to="/products">
                    Explore Resources
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#testimonials">
                    Read Testimonials
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-3xl"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-3xl"></div>
        </section>
        
        {/* Features Bento Grid */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What You'll Learn</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our trading resources cover everything from market structure to advanced order flow concepts
              </p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Main Feature */}
              <motion.div 
                variants={itemVariants} 
                className="bento-item md:col-span-2 md:row-span-2 glass-card"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Money Concepts</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how institutional traders create liquidity and engineer price movements. Understand market structure, order blocks, liquidity grabs, fair value gaps, and imbalances - the concepts that drive price action.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Master FVG identification and exploitation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Understand how to locate premium and discount zones</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Learn to identify and trade liquidity grabs</span>
                  </li>
                </ul>
                <Button variant="outline" asChild className="mt-auto">
                  <Link to="/products?category=SMC">
                    Explore SMC Resources
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              
              {/* Other Features */}
              <motion.div variants={itemVariants} className="bento-item">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">ICT Methodology</h3>
                <p className="text-muted-foreground">
                  Master the Inner Circle Trader concepts, including breaker blocks, kill zones, and optimal trade entry techniques.
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="bento-item">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Advanced Price Action</h3>
                <p className="text-muted-foreground">
                  Learn to read raw price action like a professional and identify high-probability trade setups.
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="bento-item">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <PieChart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Psychology & Mindset</h3>
                <p className="text-muted-foreground">
                  Develop the mental fortitude needed to trade consistently and overcome emotional trading.
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="bento-item">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Risk Management</h3>
                <p className="text-muted-foreground">
                  Learn effective position sizing and risk management techniques to protect your capital.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Featured Products */}
        <section className="py-20 bg-gradient-to-t from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Resources</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our most popular trading courses and materials to accelerate your learning
              </p>
            </div>
            
            <FeaturedProducts products={featuredProducts} />
            
            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link to="/products">View All Resources</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Trader Testimonials</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from traders who have transformed their trading journey with our resources
              </p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {testimonials.map((testimonial) => (
                <motion.div 
                  key={testimonial.id}
                  variants={itemVariants}
                  className="glass-card p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Benefits */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose SMCInsider</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our resources are created by professional traders with years of experience
              </p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div variants={itemVariants} className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Expert Traders</h3>
                <p className="text-muted-foreground">
                  Learn from professional traders with proven track records and years of market experience
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Lifetime Access</h3>
                <p className="text-muted-foreground">
                  Purchase once and get lifetime access to the resources including all future updates
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Get answers to your questions anytime with our round-the-clock customer support
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Community Access</h3>
                <p className="text-muted-foreground">
                  Join our exclusive community of traders to share ideas and grow together
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Trading?</h2>
              <p className="text-white/80 mb-8 text-lg">
                Get access to premium trading resources and join thousands of successful traders who have mastered SMC and ICT concepts.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/products">
                  Explore All Resources
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
