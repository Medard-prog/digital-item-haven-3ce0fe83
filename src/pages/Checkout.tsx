
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, CheckCircle2, ArrowLeft, ChevronRight } from 'lucide-react';
import CheckoutForm from '@/components/CheckoutForm';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const cartItems = state.cart.items;
  const products = state.products;
  
  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (cartItems.length === 0 && !isComplete) {
    navigate('/cart');
    return null;
  }
  
  const handleSubmit = async (formData: any) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful purchase
    setIsProcessing(false);
    setIsComplete(true);
    
    // Clear cart after successful purchase
    dispatch({ type: 'CLEAR_CART' });
    
    toast({
      title: "Order Completed!",
      description: "Your order has been successfully processed.",
    });
  };
  
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="content-container py-12 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
          >
            <div className="mb-6">
              <CheckCircle2 className="mx-auto h-20 w-20 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Thank You for Your Purchase!</h1>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Your order has been successfully processed. You'll receive download links for your products in your email shortly.
            </p>
            <Button size="lg" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="content-container py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => navigate('/cart')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-6">Billing Details</h2>
              <CheckoutForm onSubmit={handleSubmit} isProcessing={isProcessing} />
            </motion.div>
          </div>
          
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm sticky top-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-sm text-primary font-normal cursor-pointer" onClick={() => navigate('/cart')}>
                  Edit Cart
                </span>
              </h2>
              
              <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
                {cartWithDetails.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-md bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                        <img src={item.product?.image || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium truncate">{item.product?.title}</p>
                        <p className="text-xs text-muted-foreground">Digital Product • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
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
              
              <div className="flex items-center justify-center text-sm text-muted-foreground mb-2">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Secure checkout with Stripe</span>
              </div>
              
              {/* Order steps progress */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center mb-4">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</div>
                  <div className="ml-2 text-sm font-medium">Cart</div>
                  <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">2</div>
                  <div className="ml-2 text-sm font-medium">Information</div>
                  <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
                  <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 text-muted-foreground flex items-center justify-center text-xs">3</div>
                  <div className="ml-2 text-sm text-muted-foreground">Confirmation</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
