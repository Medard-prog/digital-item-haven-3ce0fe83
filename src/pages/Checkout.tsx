import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/lib/store';
import { Product } from '@/lib/store';
import CheckoutForm from '@/components/CheckoutForm';

const Checkout = () => {
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    { id: string; quantity: number; product?: Product; variantName?: string; price: number }[]
  >([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Calculate cart item details
    const calculateCartDetails = () => {
      const detailedItems = state.cart.items.map((cartItem: CartItem) => {
        const product = state.products.find((p: Product) => p.id === cartItem.id);
        let variantName = '';
        let price = product?.price || 0;

        if (cartItem.variantId && product?.variants) {
          const variant = product.variants.find(v => v.id === cartItem.variantId);
          if (variant) {
            variantName = variant.name;
            price = variant.price !== undefined ? variant.price : price;
          }
        }

        return {
          id: cartItem.id,
          quantity: cartItem.quantity,
          product,
          variantName,
          price
        };
      });

      setCartItemsWithDetails(detailedItems);
    };

    calculateCartDetails();
  }, [state.cart.items, state.products]);

  useEffect(() => {
    // Calculate subtotal, taxes, and total
    const calculateTotals = () => {
      let newSubtotal = 0;
      cartItemsWithDetails.forEach(item => {
        newSubtotal += (item.price || 0) * item.quantity;
      });

      const newTaxes = newSubtotal * 0.05; // Assuming 5% tax
      const newTotal = newSubtotal + newTaxes;

      setSubtotal(newSubtotal);
      setTaxes(newTaxes);
      setTotal(newTotal);
    };

    calculateTotals();
  }, [cartItemsWithDetails]);

  const handleCheckoutComplete = async () => {
    setIsLoading(true);
    try {
      // Mock order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear the cart
      dispatch({ type: 'CLEAR_CART' });

      toast({
        title: "Order confirmed",
        description: "Thank you for your purchase!",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "There was an error processing your order. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function at the component level for formatting currency
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// In the return statement, update the form styling
return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {cartItemsWithDetails.length > 0 ? (
                <div className="space-y-4 mb-4">
                  {cartItemsWithDetails.map((item) => (
                    <div key={item.id} className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                        <img
                          src={item.product?.image || '/placeholder.svg'}
                          alt={item.product?.title || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium">{item.product?.title}</h3>
                        {item.variantName && (
                          <p className="text-xs text-muted-foreground">Variant: {item.variantName}</p>
                        )}
                        <div className="flex justify-between mt-1">
                          <p className="text-sm">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button variant="link" asChild>
                    <Link to="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>{formatCurrency(taxes)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <CheckoutForm 
                  subtotal={subtotal}
                  taxes={taxes}
                  total={total}
                  cartItemsWithDetails={cartItemsWithDetails}
                  onCheckoutComplete={handleCheckoutComplete}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
);
};

export default Checkout;
