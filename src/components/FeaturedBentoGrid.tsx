
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Clock, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  image, 
  link,
  delay = 0,
  className = '',
  highlight = false,
  position = 'left'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-800/20 ${highlight ? 'col-span-2' : 'col-span-1'} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/10 dark:from-gray-900/50 dark:to-gray-900/10 z-0" />
      <div className="absolute inset-0 bg-white/5 dark:bg-black/5 z-0" />
      <div className="absolute inset-[-1px] border border-black/5 dark:border-white/5 rounded-xl z-10" />
      
      <div className="relative h-full w-full p-6 flex flex-col justify-between z-20">
        <div className="flex items-start justify-between mb-4">
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Icon className="w-6 h-6" />
            </div>
          )}
          {position === 'right' && image && (
            <div className="ml-auto">
              <img src={image} alt={title} className="w-32 h-32 object-contain" />
            </div>
          )}
        </div>
        
        <div className={position === 'right' ? 'max-w-[60%]' : ''}>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-3">{description}</p>
          
          {link && (
            <Link to={link} className="text-primary inline-flex items-center hover:underline font-medium">
              Learn more
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          )}
        </div>
        
        {position === 'left' && image && (
          <div className="absolute bottom-0 right-0 transition-transform duration-500 group-hover:scale-105 group-hover:translate-x-[-5px] group-hover:translate-y-[-5px]">
            <img src={image} alt={title} className="w-36 h-36 object-contain" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FeaturedBentoGrid = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent z-10" />
      
      <div className="container px-4 mx-auto relative z-20">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Trading Solutions for Every Level
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            From comprehensive market analysis to institutional trading methods, our resources help you navigate the complexity of financial markets.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            title="Reduce Losing Trades" 
            description="Lower your trading losses by 40% by identifying true market structure and institutional price levels."
            icon={Zap}
            image="/lovable-uploads/44425acd-faa0-4cf7-b7a6-017048ca1c9f.png"
            link="/products"
            delay={1}
            className="lg:col-span-2 min-h-[300px] bg-blue-50/30 dark:bg-blue-900/10"
            highlight={true}
            position="right"
          />
          
          <FeatureCard 
            title="Smart Money Concepts" 
            description="Learn to identify institutional order flow and price manipulation patterns that drive market movements."
            icon={BarChart3}
            image="/placeholder.svg"
            link="/products"
            delay={2}
            className="min-h-[300px] bg-amber-50/30 dark:bg-amber-900/10"
          />
          
          <FeatureCard 
            title="Order Block Strategy" 
            description="Master the technique of identifying and trading order blocks - the areas where smart money enters the market."
            icon={ShieldCheck}
            image="/placeholder.svg"
            link="/products"
            delay={3}
            className="min-h-[300px] bg-green-50/30 dark:bg-green-900/10"
          />
          
          <FeatureCard 
            title="Risk Management" 
            description="Implement proven risk management strategies to protect your capital and ensure consistent profitability."
            icon={ShieldCheck}
            image="/placeholder.svg"
            link="/products"
            delay={4}
            className="min-h-[240px] bg-purple-50/30 dark:bg-purple-900/10"
          />
          
          <FeatureCard 
            title="Market Analysis Tools" 
            description="Access advanced analytical tools that reveal hidden market patterns and generate high-probability trading opportunities."
            icon={BarChart3}
            image="/placeholder.svg"
            link="/products"
            delay={5}
            className="min-h-[240px] bg-pink-50/30 dark:bg-pink-900/10 lg:col-span-2"
            highlight={true}
            position="left"
          />
          
          <FeatureCard 
            title="24/7 Trading Support" 
            description="Join our community of traders and get access to round-the-clock support via Discord and Telegram."
            icon={Clock}
            image="/placeholder.svg"
            link="/products"
            delay={6}
            className="min-h-[240px] bg-orange-50/30 dark:bg-orange-900/10"
          />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default FeaturedBentoGrid;
