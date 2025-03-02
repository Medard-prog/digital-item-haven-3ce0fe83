import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/lib/order-utils';
import { useStore } from '@/lib/store';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface CheckoutFormProps {
  subtotal: number;
  taxes: number;
  total: number;
  cartItemsWithDetails: any[];
  onCheckoutComplete: () => void;
}

// Add this function at the component level for formatting currency
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Update the component with cleaner, less "cringe" styling
const CheckoutForm = ({ subtotal, taxes, total, cartItemsWithDetails, onCheckoutComplete }: CheckoutFormProps) => {
  const { dispatch } = useStore();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !cardNumber || !expMonth || !expYear || !cvc) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all the required fields."
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in Supabase
      const order = await createOrder({
        name,
        email,
        cardNumber,
        expMonth,
        expYear,
        cvc,
        subtotal,
        taxes,
        total,
        cartItemsWithDetails
      });

      if (order && order.id) {
        toast({
          title: "Order successful",
          description: `Your order has been placed successfully. Order ID: ${order.id}`
        });

        // Clear cart
        dispatch({ type: 'CLEAR_CART' });

        // Call the callback function to indicate checkout is complete
        onCheckoutComplete();
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error.message || "An error occurred while processing your payment."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name" className="mb-1.5 block text-sm font-medium">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-md"
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cardNumber" className="mb-1.5 block text-sm font-medium">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            maxLength={19}
            className="rounded-md"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Label htmlFor="expMonth" className="mb-1.5 block text-sm font-medium">Month</Label>
            <Input
              id="expMonth"
              placeholder="MM"
              value={expMonth}
              onChange={(e) => setExpMonth(e.target.value)}
              required
              maxLength={2}
              className="rounded-md"
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="expYear" className="mb-1.5 block text-sm font-medium">Year</Label>
            <Input
              id="expYear"
              placeholder="YY"
              value={expYear}
              onChange={(e) => setExpYear(e.target.value)}
              required
              maxLength={2}
              className="rounded-md"
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="cvc" className="mb-1.5 block text-sm font-medium">CVC</Label>
            <Input
              id="cvc"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              required
              maxLength={4}
              className="rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-base font-medium mb-1">
          <p>Order total</p>
          <p>{formatCurrency(total)}</p>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          By completing your purchase you agree to our Terms of Service.
        </p>
        <Button type="submit" disabled={isProcessing} className="w-full rounded-md">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${formatCurrency(total)}`
          )}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
