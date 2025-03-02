
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutFormProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckoutForm = ({ setIsLoading }: CheckoutFormProps) => {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Calculate total
      const subtotal = state.cart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;
      
      // Create order in database if user is authenticated
      if (user) {
        // Insert order first
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([
            { 
              user_id: user.id,
              total: total,
              status: 'processing'
            }
          ])
          .select();
        
        if (orderError) throw orderError;
        
        if (orderData && orderData[0]) {
          const orderId = orderData[0].id;
          
          // Insert order items
          const orderItems = state.cart.items.map(item => ({
            order_id: orderId,
            product_id: item.id,
            variant_id: item.variantId || null,
            quantity: item.quantity,
            price: item.price
          }));
          
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);
          
          if (itemsError) throw itemsError;
        }
      }
      
      // Show success message
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase.",
      });
      
      // Clear cart
      dispatch({ type: 'CLEAR_CART' });
      
      // Redirect to success page or dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: error.message || "There was an error processing your order.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Shipping Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="rounded-md"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="rounded-md"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="postalCode">ZIP/Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
              className="rounded-md"
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Details</h3>
        
        <div className="space-y-2">
          <Label htmlFor="cardName">Name on Card</Label>
          <Input
            id="cardName"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            required
            className="rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            placeholder="•••• •••• •••• ••••"
            className="rounded-md"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              placeholder="MM/YY"
              className="rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              required
              placeholder="•••"
              className="rounded-md"
            />
          </div>
        </div>
      </div>
      
      <Button type="submit" size="lg" className="w-full">
        Place Order
      </Button>
    </form>
  );
};

export default CheckoutForm;
