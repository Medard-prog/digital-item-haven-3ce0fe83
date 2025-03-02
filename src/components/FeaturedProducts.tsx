
import React from 'react';
import { useStore } from '@/lib/store';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const { state } = useStore();
  const featuredProducts = state.products.filter(product => product.featured);
  
  return (
    <section className="section-padding bg-gradient-to-b from-white to-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Featured Resources</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular trading guides and resources to elevate your trading knowledge and skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              featured={index === 0} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
