
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import CartItem from '@/components/CartItem';

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
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <ShoppingBag className="mr-3 h-8 w-8" />
        Your Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products">
            <Button>
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="text-destructive hover:text-destructive"
                onClick={handleClearCart}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 sticky top-6">
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
                className="w-full" 
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Secure checkout with Stripe</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
