
import { supabase } from '@/integrations/supabase/client';

interface OrderDetails {
  name: string;
  email: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  subtotal: number;
  taxes: number;
  total: number;
  cartItemsWithDetails: any[];
}

export const createOrder = async (orderDetails: OrderDetails) => {
  try {
    // Only store the last 4 digits of the card number for security reasons
    const lastFourDigits = orderDetails.cardNumber.slice(-4);
    const maskedCardNumber = `xxxx-xxxx-xxxx-${lastFourDigits}`;

    // Create the order in the database
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_email: orderDetails.email,
        customer_name: orderDetails.name,
        payment_method: `Card ending in ${lastFourDigits}`,
        subtotal: orderDetails.subtotal,
        taxes: orderDetails.taxes,
        total: orderDetails.total,
        status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;

    // Create order items for each product in the cart
    if (order) {
      const orderItems = orderDetails.cartItemsWithDetails.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.product?.title || 'Unknown Product',
        variant_name: item.variantName || null,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
