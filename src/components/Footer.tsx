
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneCall, 
  Mail, 
  MessageCircle, 
  Clock, 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook, 
  Shield, 
  CreditCard, 
  LifeBuoy,
  ArrowRight,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      {/* Support Section */}
      <div id="support" className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">24/7 Support</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Our team of trading experts is available around the clock to assist you with any questions or concerns
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 text-center flex flex-col items-center hover:scale-105 transition-transform">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <PhoneCall className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Call Us</h3>
            <p className="text-muted-foreground mb-4">Speak directly with our support team</p>
            <a href="tel:+123456789" className="text-primary font-medium">+1 (234) 567-8900</a>
          </div>
          
          <div className="glass-card p-6 text-center flex flex-col items-center hover:scale-105 transition-transform">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Email Support</h3>
            <p className="text-muted-foreground mb-4">Send us a message anytime</p>
            <a href="mailto:support@smcinsider.com" className="text-primary font-medium">support@smcinsider.com</a>
          </div>
          
          <div className="glass-card p-6 text-center flex flex-col items-center hover:scale-105 transition-transform">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Live Chat</h3>
            <p className="text-muted-foreground mb-4">Chat with our support agents</p>
            <Button variant="link" className="text-primary font-medium">Start Chat</Button>
          </div>
          
          <div className="glass-card p-6 text-center flex flex-col items-center hover:scale-105 transition-transform">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">24/7 Availability</h3>
            <p className="text-muted-foreground mb-4">We're here for you anytime</p>
            <span className="text-primary font-medium">Always Available</span>
          </div>
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-primary text-white">
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-white/80 max-w-md">
                Subscribe to our newsletter for trading tips, market analysis, and exclusive offers.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-r-none focus-visible:ring-white"
                />
                <Button type="submit" variant="secondary" className="rounded-l-none">
                  <Send className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo-smc.png" alt="SMCInsider" className="h-8 w-auto mr-2" />
              <span className="font-bold text-lg">SMCInsider</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Premium trading resources for serious traders. Learn ICT and SMC methodologies from expert traders.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Products
                </Link>
              </li>
              <li>
                <a href="#support" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Support
                </a>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=SMC" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  SMC Trading
                </Link>
              </li>
              <li>
                <Link to="/products?category=ICT" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  ICT Methodology
                </Link>
              </li>
              <li>
                <Link to="/products?category=Psychology" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Trading Psychology
                </Link>
              </li>
              <li>
                <Link to="/products?category=Advanced" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Advanced Strategies
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fundamentals" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Trading Fundamentals
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Legal & Info</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SMCInsider. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-muted-foreground text-sm">
                <Shield className="h-4 w-4 mr-1" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <CreditCard className="h-4 w-4 mr-1" />
                <span>Powered by Stripe</span>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <LifeBuoy className="h-4 w-4 mr-1" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
