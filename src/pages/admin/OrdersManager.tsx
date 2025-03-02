
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, FileDown, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const OrdersManager = () => {
  const [search, setSearch] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching orders...");
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            profiles (email, first_name, last_name)
          `)
          .order('created_at', { ascending: false });
        
        if (ordersError) throw ordersError;
        console.log("Orders data:", ordersData);
        
        const ordersWithItems = await Promise.all((ordersData || []).map(async (order) => {
          try {
            const { data: items, error: itemsError } = await supabase
              .from('order_items')
              .select(`
                *,
                products (title, price),
                product_variants (name)
              `)
              .eq('order_id', order.id);
            
            if (itemsError) throw itemsError;
            
            return {
              id: order.id,
              customer: order.profiles ? 
                `${order.profiles.first_name || ''} ${order.profiles.last_name || ''}`.trim() || 'Unknown' : 
                'Unknown',
              email: order.profiles?.email || 'No email',
              date: order.created_at,
              total: typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0,
              status: order.status || 'pending',
              items: (items || []).map((item: any) => ({
                id: item.id,
                title: item.products?.title || 'Unknown Product',
                price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
                quantity: item.quantity || 1
              }))
            };
          } catch (error) {
            console.error('Error fetching order items:', error);
            return {
              ...order,
              customer: 'Unknown',
              email: 'No email',
              items: []
            };
          }
        }));
        
        console.log("Processed orders:", ordersWithItems);
        setOrders(ordersWithItems);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Failed to load orders",
          description: error.message,
          variant: "destructive"
        });
        
        // For development, create some dummy orders
        if (process.env.NODE_ENV === 'development') {
          console.log("Development mode: setting mock orders");
          const mockOrders = [
            {
              id: 'mock-order-1',
              customer: 'John Doe',
              email: 'john@example.com',
              date: new Date().toISOString(),
              total: 199.99,
              status: 'completed',
              items: [
                {
                  id: 'mock-item-1',
                  title: 'SMC Trading Course Bundle',
                  price: 199.99,
                  quantity: 1
                }
              ]
            },
            {
              id: 'mock-order-2',
              customer: 'Jane Smith',
              email: 'jane@example.com',
              date: new Date().toISOString(),
              total: 149.99,
              status: 'processing',
              items: [
                {
                  id: 'mock-item-2',
                  title: 'ICT Mentorship Program',
                  price: 149.99,
                  quantity: 1
                }
              ]
            }
          ];
          setOrders(mockOrders);
        } else {
          setOrders([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  const filteredOrders = orders.filter(order => 
    (order.id && order.id.toString().toLowerCase().includes(search.toLowerCase())) ||
    (order.customer && order.customer.toLowerCase().includes(search.toLowerCase())) ||
    (order.email && order.email.toLowerCase().includes(search.toLowerCase()))
  );
  
  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-primary" />
          <h2 className="text-2xl font-bold mb-4">Loading Orders</h2>
          <p className="text-muted-foreground">Please wait while we fetch the order data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track your customer orders</p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0">
          <FileDown className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{typeof order.id === 'string' ? order.id.substring(0, 8) : order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>${typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id ? (typeof selectedOrder.id === 'string' ? selectedOrder.id.substring(0, 8) : selectedOrder.id) : 'Unknown'}</DialogTitle>
            <DialogDescription>
              {selectedOrder?.date ? new Date(selectedOrder.date).toLocaleDateString() : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer Information</h3>
              <div className="bg-secondary rounded-md p-3">
                <p className="font-medium">{selectedOrder?.customer || 'Unknown'}</p>
                <p className="text-sm">{selectedOrder?.email || 'No email'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
              <div className="bg-secondary rounded-md p-3 space-y-3">
                {selectedOrder?.items && selectedOrder.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.title || 'Unknown Product'}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity || 1}</p>
                    </div>
                    <p className="font-medium">${typeof item.price === 'number' && typeof item.quantity === 'number' ? (item.price * item.quantity).toFixed(2) : '0.00'}</p>
                  </div>
                ))}
                
                {(!selectedOrder?.items || selectedOrder.items.length === 0) && (
                  <p className="text-center text-muted-foreground py-2">No items found</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Summary</h3>
              <div className="bg-secondary rounded-md p-3">
                <div className="flex justify-between items-center py-1">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p>${typeof selectedOrder?.total === 'number' ? selectedOrder.total.toFixed(2) : '0.00'}</p>
                </div>
                <div className="flex justify-between items-center py-1">
                  <p className="text-muted-foreground">Digital Delivery</p>
                  <p>Free</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                  <p className="font-medium">Total</p>
                  <p className="font-bold">${typeof selectedOrder?.total === 'number' ? selectedOrder.total.toFixed(2) : '0.00'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <Badge className={getStatusColor(selectedOrder?.status || 'pending')}>
                  {selectedOrder?.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 'Pending'}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManager;
