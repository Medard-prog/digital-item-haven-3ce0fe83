
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

// Helper function to get status badge color
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
    case 'processing':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Processing</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Type for order with customer
interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  customer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Handle development mode with mock data
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Mock orders for development
  const mockOrders: Order[] = [
    {
      id: '1',
      created_at: new Date().toISOString(),
      total: 99.99,
      status: 'pending',
      customer: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com'
      }
    },
    {
      id: '2',
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      total: 149.99,
      status: 'completed',
      customer: {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com'
      }
    },
    {
      id: '3',
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      total: 199.99,
      status: 'processing',
      customer: {
        first_name: 'Mike',
        last_name: 'Johnson',
        email: 'mike@example.com'
      }
    }
  ];

  const fetchOrders = async () => {
    // For development mode, use mock data
    if (isDevelopment) {
      setOrders(mockOrders);
      setTotalPages(1);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // First, get count for pagination
      const { count, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / pageSize));
      }
      
      // Then fetch the orders with user info
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (error) throw error;
      
      // Transform the data to match our Order type
      const formattedOrders: Order[] = data.map(order => ({
        id: order.id,
        created_at: order.created_at,
        total: order.total,
        status: order.status,
        customer: order.profiles ? {
          first_name: order.profiles.first_name,
          last_name: order.profiles.last_name,
          email: order.profiles.email
        } : undefined
      }));
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // In case of error, use mock data in development
      if (isDevelopment) {
        setOrders(mockOrders);
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, [page]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableCaption>A list of all customer orders.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        {order.customer ? 
                          `${order.customer.first_name || ''} ${order.customer.last_name || ''}` : 
                          'Unknown Customer'}
                        <div className="text-xs text-muted-foreground">
                          {order.customer?.email || 'No email'}
                        </div>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <Link to={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousPage} 
                  disabled={page <= 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                
                <Button 
                  variant="outline" 
                  onClick={handleNextPage} 
                  disabled={page >= totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersManager;
