
import React, { useEffect, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Loader2, 
  ShoppingBag, 
  Download, 
  ChevronRight, 
  ChevronDown,
  ExternalLink, 
  Package 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Purchases = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 5;
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error, count } = await supabase
          .from('orders')
          .select('*, order_items(*)', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage - 1);
        
        if (error) {
          throw error;
        }
        
        setOrders(data || []);
        
        if (count) {
          setTotalPages(Math.ceil(count / ordersPerPage));
        }
        
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, currentPage]);
  
  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <UserSidebar>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Loading Orders</h2>
            <p className="text-muted-foreground">Please wait while we load your purchase history...</p>
          </div>
        </div>
      </UserSidebar>
    );
  }
  
  return (
    <UserSidebar>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Purchases</h1>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Purchase History
              </CardTitle>
              <CardDescription>View and manage your orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
                  <h3 className="text-lg font-medium">No purchases yet</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    You haven't made any purchases yet. Browse our products to find something you like.
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/products">Browse Products</a>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <React.Fragment key={order.id}>
                            <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleOrderExpand(order.id)}>
                              <TableCell className="font-medium">
                                {order.id.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                {new Date(order.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(order.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                ${parseFloat(order.total).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {expandedOrder === order.id ? (
                                  <ChevronDown className="h-5 w-5" />
                                ) : (
                                  <ChevronRight className="h-5 w-5" />
                                )}
                              </TableCell>
                            </TableRow>
                            
                            <TableRow className={expandedOrder === order.id ? "" : "hidden"}>
                              <TableCell colSpan={5} className="p-0">
                                <Collapsible open={expandedOrder === order.id}>
                                  <CollapsibleContent>
                                    <div className="p-4 bg-muted/30">
                                      <h4 className="font-medium mb-3">Order Details</h4>
                                      
                                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                          <span className="text-sm font-medium block mb-1">Order Date</span>
                                          <span>{new Date(order.created_at).toLocaleString()}</span>
                                        </div>
                                        
                                        <div>
                                          <span className="text-sm font-medium block mb-1">Payment Method</span>
                                          <span>{order.payment_method || 'Credit Card'}</span>
                                        </div>
                                        
                                        <div>
                                          <span className="text-sm font-medium block mb-1">Status</span>
                                          <span>{getStatusBadge(order.status)}</span>
                                        </div>
                                        
                                        <div>
                                          <span className="text-sm font-medium block mb-1">Order ID</span>
                                          <span className="font-mono text-sm">{order.id}</span>
                                        </div>
                                      </div>
                                      
                                      <h5 className="font-medium mb-2">Items</h5>
                                      <div className="space-y-3 mb-4">
                                        {order.order_items && order.order_items.map((item: any) => (
                                          <div key={item.id} className="border rounded-md p-3 bg-card">
                                            <div className="flex justify-between items-center">
                                              <div>
                                                <p className="font-medium">{item.product_name}</p>
                                                {item.variant_name && (
                                                  <p className="text-sm text-muted-foreground">
                                                    Variant: {item.variant_name}
                                                  </p>
                                                )}
                                                <p className="text-sm">
                                                  Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                                </p>
                                              </div>
                                              <p className="font-medium">
                                                ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      
                                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t">
                                        <div className="space-y-1 mb-3 sm:mb-0">
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Subtotal:</span>
                                            <span className="text-sm">${parseFloat(order.subtotal || '0').toFixed(2)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Tax:</span>
                                            <span className="text-sm">${parseFloat(order.taxes || '0').toFixed(2)}</span>
                                          </div>
                                          <div className="flex justify-between font-medium">
                                            <span>Total:</span>
                                            <span>${parseFloat(order.total).toFixed(2)}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                          <Button variant="outline" size="sm" className="flex items-center">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                          </Button>
                                          <Button variant="outline" size="sm" className="flex items-center">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Details
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {totalPages > 1 && (
                    <Pagination className="mt-6">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              href="#" 
                              isActive={page === currentPage}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </UserSidebar>
  );
};

export default Purchases;
