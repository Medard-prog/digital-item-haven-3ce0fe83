
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck } from 'lucide-react';
import CartItem from '@/components/CartItem';
import { motion } from 'framer-motion';

const Cart = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  
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
  
  const handleRemoveItem = (id: string) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id }
    });
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_CART_QUANTITY',
      payload: { id, quantity }
    });
  };
  
  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="content-container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <ShoppingBag className="mr-3 h-8 w-8" />
            Your Cart
          </h1>
        </motion.div>
        
        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
          >
            <div className="mb-6">
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products">
              <Button>
                Browse Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={itemAnimation} className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <div className="space-y-1 mb-6">
                  <h2 className="text-xl font-semibold">Cart Items</h2>
                  <p className="text-sm text-muted-foreground">{cartItems.length} items in your cart</p>
                </div>
                
                <div className="space-y-6">
                  {cartWithDetails.map(item => (
                    <CartItem 
                      key={item.id}
                      item={item}
                      onRemove={() => handleRemoveItem(item.id)}
                      onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
                    />
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    className="text-destructive hover:text-destructive"
                    onClick={handleClearCart}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                  
                  <Link to="/products">
                    <Button variant="ghost">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemAnimation} className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Digital Delivery</span>
                    <span>Free</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full py-6" 
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center">
                    <ShieldCheck className="mr-1 h-4 w-4" />
                    <p>Secure checkout with Stripe</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">We Accept</h3>
                  <div className="flex space-x-2">
                    <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
