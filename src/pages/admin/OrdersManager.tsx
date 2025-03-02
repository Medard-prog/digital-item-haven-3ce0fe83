
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, FileDown } from 'lucide-react';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    date: '2023-06-12',
    total: 199.99,
    status: 'completed',
    items: [
      { id: '1', title: 'SMC Full Course Bundle', price: 199.99, quantity: 1 }
    ]
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    date: '2023-06-11',
    total: 79.00,
    status: 'completed',
    items: [
      { id: '2', title: 'ICT Trader\'s Guide', price: 79.00, quantity: 1 }
    ]
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    date: '2023-06-10',
    total: 128.00,
    status: 'completed',
    items: [
      { id: '3', title: 'Advanced Trading Psychology', price: 49.00, quantity: 1 },
      { id: '4', title: 'Market Structure Analysis', price: 79.00, quantity: 1 }
    ]
  },
  {
    id: 'ORD-004',
    customer: 'Sarah Williams',
    email: 'sarah@example.com',
    date: '2023-06-09',
    total: 349.00,
    status: 'completed',
    items: [
      { id: '5', title: 'Ultimate Trading Package', price: 349.00, quantity: 1 }
    ]
  },
  {
    id: 'ORD-005',
    customer: 'David Brown',
    email: 'david@example.com',
    date: '2023-06-08',
    total: 79.00,
    status: 'completed',
    items: [
      { id: '2', title: 'ICT Trader\'s Guide', price: 79.00, quantity: 1 }
    ]
  }
];

const OrdersManager = () => {
  const [search, setSearch] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const filteredOrders = mockOrders.filter(order => 
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.customer.toLowerCase().includes(search.toLowerCase()) ||
    order.email.toLowerCase().includes(search.toLowerCase())
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
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
      
      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              {new Date(selectedOrder?.date || '').toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer Information</h3>
              <div className="bg-secondary rounded-md p-3">
                <p className="font-medium">{selectedOrder?.customer}</p>
                <p className="text-sm">{selectedOrder?.email}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
              <div className="bg-secondary rounded-md p-3 space-y-3">
                {selectedOrder?.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Summary</h3>
              <div className="bg-secondary rounded-md p-3">
                <div className="flex justify-between items-center py-1">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p>${selectedOrder?.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center py-1">
                  <p className="text-muted-foreground">Digital Delivery</p>
                  <p>Free</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                  <p className="font-medium">Total</p>
                  <p className="font-bold">${selectedOrder?.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <Badge className={getStatusColor(selectedOrder?.status || '')}>
                  {selectedOrder?.status?.charAt(0).toUpperCase() + selectedOrder?.status?.slice(1)}
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
