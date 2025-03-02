
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore, Product } from '@/lib/store';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.3 } 
  }
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        quantity: 1
      }
    });
    
    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart.`,
    });
  };
  
  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFavorite = state.favorites.includes(product.id);
    
    if (isFavorite) {
      dispatch({
        type: 'REMOVE_FROM_FAVORITES',
        payload: product.id
      });
      
      toast({
        title: 'Removed from favorites',
        description: `${product.title} has been removed from your favorites.`,
      });
    } else {
      dispatch({
        type: 'ADD_TO_FAVORITES',
        payload: product.id
      });
      
      toast({
        title: 'Added to favorites',
        description: `${product.title} has been added to your favorites.`,
      });
    }
  };
  
  // Get first category for badge if product has categories
  const firstCategory = product.categories && product.categories.length > 0 
    ? product.categories[0] 
    : null;
  
  // Check if product is in favorites
  const isFavorite = state.favorites.includes(product.id);
  
  return (
    <motion.div 
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="group h-full"
    >
      <Link 
        to={`/product/${product.id}`}
        className="glass-card flex flex-col h-full overflow-hidden group-hover:shadow-md transition-shadow rounded-lg"
      >
        {/* Product Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={product.image || '/placeholder.svg'} 
            alt={product.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" className="bg-primary">Featured</Badge>
            </div>
          )}
          
          {/* Category Badge */}
          {firstCategory && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary">{firstCategory}</Badge>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-3 bg-gradient-to-t from-gray-900/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
            <Button 
              size="icon" 
              variant="ghost" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full h-9 w-9" 
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full h-9 w-9" 
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              onClick={handleAddToFavorites}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full h-9 w-9" 
              title="Add to cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Product Content */}
        <div className="flex flex-col flex-1 p-4">
          <div className="mb-2 flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs text-muted-foreground ml-1">(5.0)</span>
          </div>
          
          <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{product.description}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleAddToCart}
              className="group-hover:bg-primary group-hover:text-white transition-colors"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
