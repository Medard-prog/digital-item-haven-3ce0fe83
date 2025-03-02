
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, formatCurrency } from '@/lib/store';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LockIcon, CreditCard } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Please enter your complete address" }),
  city: z.string().min(2, { message: "Please enter a valid city" }),
  zipCode: z.string().min(3, { message: "Please enter a valid postal/zip code" }),
  country: z.string().min(2, { message: "Please select a country" }),
  cardName: z.string().min(2, { message: "Please enter the name on your card" }),
  cardNumber: z.string().min(15, { message: "Please enter a valid card number" }).max(19),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Please use MM/YY format" }),
  cvc: z.string().regex(/^[0-9]{3,4}$/, { message: "CVC must be 3 or 4 digits" }),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutForm = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate totals
  const subtotal = state.cart.reduce(
    (total, item) => total + item.variant.price * item.quantity, 
    0
  );
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    if (state.cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Success! Clear cart and redirect
      dispatch({ type: 'CLEAR_CART' });
      toast.success("Order completed successfully!");
      navigate('/');
    }, 2000);
  };
  
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip/Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <div className="bg-secondary/50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <LockIcon className="h-4 w-4" />
                    <span>Secure Payment Processing</span>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="4242 4242 4242 4242" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="expiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full md:w-auto md:px-8 mt-8"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Purchase
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutForm;
