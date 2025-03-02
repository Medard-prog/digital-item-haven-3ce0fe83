
import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, AlertTriangle, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CartItem from './CartItem';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useStore();
  const cartItems = state.cart.items;
  const products = state.products;
  
  const cartWithDetails = cartItems.map(item => {
    const product = products.find(p => p.id === item.id);
    return {
      ...item,
      product
    };
  });
  
  const subtotal = cartWithDetails.reduce((total, item) => {
    return total + ((item.product?.price || 0) * item.quantity);
  }, 0);
  
  // Close when clicking outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle quantity changes
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: id
      });
    } else {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: {
          id,
          quantity
        }
      });
    }
  };
  
  // Remove item from cart
  const removeItem = (id: string) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: id
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="cart-overlay" onClick={handleOutsideClick} />
      <div className={`cart-sidebar animated-element ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-medium flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Your Cart {cartItems.length > 0 && `(${cartItems.length})`}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Button onClick={onClose} asChild>
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {cartWithDetails.map(item => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t dark:border-gray-800 p-4 bg-background">
              <div className="space-y-4">
                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Digital Delivery</span>
                    <span>Free</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <Button size="lg" className="w-full" asChild>
                  <Link to="/checkout" onClick={onClose}>
                    Checkout
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>Secure digital checkout powered by Stripe</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
