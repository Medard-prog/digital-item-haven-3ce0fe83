
import React from 'react';
import { useStore, formatCurrency } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product?: {
      id: string;
      title: string;
      price: number;
      image?: string;
    };
  };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
  if (!item.product) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row gap-4 items-start border-b border-border py-6"
    >
      <div className="rounded-md overflow-hidden w-full sm:w-24 h-24 bg-muted flex-shrink-0">
        <img 
          src={item.product.image || '/placeholder.svg'} 
          alt={item.product.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium mb-1">{item.product.title}</h3>
        
        <p className="font-medium">
          {formatCurrency(item.product.price)}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-r-none"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <div className="px-3 h-8 flex items-center justify-center border-y border-border">
              {item.quantity}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-l-none"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
      
      <div className="text-right font-semibold">
        {formatCurrency(item.product.price * item.quantity)}
      </div>
    </motion.div>
  );
};

export default CartItem;
