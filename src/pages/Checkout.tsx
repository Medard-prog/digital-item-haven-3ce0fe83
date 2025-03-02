
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/CheckoutForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the formatCurrency function since it's missing from utils
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

const Checkout = () => {
  const { state } = useStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get products to access product details
  const products = state.products;
  
  // Map cart items to include product information
  const cartItemsWithDetails = state.cart.items.map(item => {
    const product = products.find(p => p.id === item.id);
    return {
      ...item,
      product
    };
  });
  
  const subtotal = cartItemsWithDetails.reduce(
    (sum, item) => sum + ((item.product?.price || 0) * item.quantity), 
    0
  );
  
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  useEffect(() => {
    // Redirect if cart is empty
    if (state.cart.items.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
      });
      // We could redirect here, but for now let's just show a toast
    }
  }, [state.cart.items.length, toast]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p className="text-lg">Processing your order...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Order Summary */}
            <Card className="lg:w-1/3 h-fit sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {state.cart.items.length} {state.cart.items.length === 1 ? 'item' : 'items'} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItemsWithDetails.map((item) => (
                  <div key={`${item.id}-${item.variantId || 'default'}`} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.product?.title || 'Unknown Product'}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} {item.product?.variants?.find(v => v.id === item.variantId)?.name ? 
                          `(${item.product.variants.find(v => v.id === item.variantId)?.name})` : ''}
                      </p>
                    </div>
                    <p>{formatCurrency((item.product?.price || 0) * item.quantity)}</p>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>{formatCurrency(subtotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Tax (10%)</p>
                    <p>{formatCurrency(tax)}</p>
                  </div>
                  <div className="flex justify-between font-bold">
                    <p>Total</p>
                    <p>{formatCurrency(total)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Checkout Form */}
            <div className="lg:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>
                    Complete your purchase by providing your payment details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CheckoutForm setIsLoading={setIsLoading} cartItemsWithDetails={cartItemsWithDetails} />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 border-t pt-6">
                  <p className="text-sm text-muted-foreground">
                    By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
