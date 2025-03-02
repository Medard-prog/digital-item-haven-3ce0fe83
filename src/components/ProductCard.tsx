
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore, Product, formatCurrency } from '@/lib/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const { dispatch } = useStore();
  
  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          id: product.id,
          quantity: 1
        }
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative flex flex-col rounded-xl overflow-hidden bg-white border border-border transition-all duration-300 hover:shadow-md",
        featured && "md:col-span-2 lg:flex-row"
      )}
    >
      <div 
        className={cn(
          "relative overflow-hidden",
          featured ? "lg:w-1/2" : "aspect-[4/3]"
        )}
      >
        <img 
          src={product.image || '/placeholder.svg'} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <Badge 
            className="absolute top-3 left-3 bg-primary text-white font-medium shadow-md"
            variant="secondary"
          >
            Featured
          </Badge>
        )}
      </div>
      
      <div className={cn(
        "flex flex-col p-4",
        featured && "lg:w-1/2 lg:p-6"
      )}>
        <div className="flex-1">
          <div className="flex gap-2 mb-1">
            {product.categories && product.categories.map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
          <h3 className="text-lg font-semibold leading-tight mb-2">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
          <p className="font-semibold text-lg mb-4">
            {formatCurrency(product.price)}
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button 
            asChild
            size="sm" 
            className="flex-1"
          >
            <Link to={`/products/${product.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
