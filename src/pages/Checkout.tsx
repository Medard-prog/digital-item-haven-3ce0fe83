
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import CheckoutForm from '@/components/CheckoutForm';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
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
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center py-12">
          <div className="mb-6">
            <CheckCircle2 className="mx-auto h-20 w-20 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Thank You for Your Purchase!</h1>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Your order has been successfully processed. You'll receive download links for your products in your email shortly.
          </p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
            <CheckoutForm onSubmit={handleSubmit} isProcessing={isProcessing} />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-4">
              {cartWithDetails.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium truncate">{item.product?.title}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
