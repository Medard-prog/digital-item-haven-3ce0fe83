
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, BookOpen, ShoppingCart, Search, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Purchase {
  id: string;
  title: string;
  type: 'course' | 'material';
  date: string;
  price: number;
}

const Purchases = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true);
      
      try {
        if (user?.id) {
          console.log("Fetching purchases for user:", user.id);
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (*)
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (ordersError) throw ordersError;
          
          // Transform the data
          const purchasesData: Purchase[] = [];
          
          ordersData?.forEach(order => {
            if (order.order_items && Array.isArray(order.order_items)) {
              order.order_items.forEach(item => {
                if (item.products) {
                  purchasesData.push({
                    id: item.id,
                    title: item.products.title,
                    type: item.products.title.includes('Course') ? 'course' : 'material',
                    date: order.created_at,
                    price: item.price
                  });
                }
              });
            }
          });
          
          setPurchases(purchasesData);
        } else {
          // For development, add mock purchases
          if (process.env.NODE_ENV === 'development') {
            console.log("Development mode: setting mock purchases");
            setPurchases([
              {
                id: 'mock-purchase-1',
                title: 'SMC Trading Course Bundle',
                type: 'course',
                date: new Date().toISOString(),
                price: 199.99
              },
              {
                id: 'mock-purchase-2',
                title: 'ICT Mentorship Program',
                type: 'course',
                date: new Date().toISOString(),
                price: 149.99
              },
              {
                id: 'mock-purchase-3',
                title: 'Advanced Order Blocks',
                type: 'material',
                date: new Date().toISOString(),
                price: 89.99
              }
            ]);
          } else {
            setPurchases([]);
          }
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
        
        // For development, add mock purchases
        if (process.env.NODE_ENV === 'development') {
          console.log("Development mode: setting mock purchases after error");
          setPurchases([
            {
              id: 'mock-purchase-1',
              title: 'SMC Trading Course Bundle',
              type: 'course',
              date: new Date().toISOString(),
              price: 199.99
            },
            {
              id: 'mock-purchase-2',
              title: 'ICT Mentorship Program',
              type: 'course',
              date: new Date().toISOString(),
              price: 149.99
            }
          ]);
        } else {
          setPurchases([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPurchases();
  }, [user]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Filter purchases by type
  const courses = purchases.filter(p => p.type === 'course');
  const materials = purchases.filter(p => p.type === 'material');
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Loading Your Purchases</h2>
            <p className="text-muted-foreground">Please wait while we fetch your purchase history...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const renderEmptyState = (type: string, icon: React.ReactNode) => (
    <div className="text-center py-16">
      {icon}
      <h3 className="text-xl font-medium mb-2">No {type} purchased</h3>
      <p className="text-muted-foreground mb-6">Your purchased {type} will appear here.</p>
      <Button asChild>
        <Link to="/products">Browse {type}</Link>
      </Button>
    </div>
  );
  
  const renderPurchaseItem = (purchase: Purchase) => (
    <motion.div
      key={purchase.id}
      variants={itemVariants}
      className="bg-background rounded-lg border border-border p-4 shadow-sm"
    >
      <h3 className="font-medium text-lg mb-1">{purchase.title}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-muted-foreground">
          {new Date(purchase.date).toLocaleDateString()}
        </span>
        <Badge className="bg-primary">{purchase.type === 'course' ? 'Course' : 'Material'}</Badge>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="font-medium">${purchase.price.toFixed(2)}</span>
        <Button size="sm">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </div>
    </motion.div>
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display mb-2">Your Purchases</h1>
          <p className="text-muted-foreground">Access your digital products and course materials</p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Purchases</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="order-history">Order History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {purchases.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {purchases.map(purchase => renderPurchaseItem(purchase))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="mb-6">
                  <Download className="mx-auto h-20 w-20 text-muted-foreground opacity-30" />
                </div>
                <h3 className="text-xl font-medium mb-3">No purchases yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You haven't purchased any digital trading resources yet. Browse our collection of premium SMC and ICT resources.
                </p>
                <Button asChild>
                  <Link to="/products">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Browse Products
                  </Link>
                </Button>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="courses">
            {courses.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {courses.map(course => renderPurchaseItem(course))}
              </motion.div>
            ) : (
              renderEmptyState("courses", <BookOpen className="mx-auto h-20 w-20 text-muted-foreground opacity-30 mb-4" />)
            )}
          </TabsContent>
          
          <TabsContent value="materials">
            {materials.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {materials.map(material => renderPurchaseItem(material))}
              </motion.div>
            ) : (
              renderEmptyState("materials", <FileText className="mx-auto h-20 w-20 text-muted-foreground opacity-30 mb-4" />)
            )}
          </TabsContent>
          
          <TabsContent value="order-history">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {purchases.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map(purchase => (
                        <TableRow key={purchase.id}>
                          <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                          <TableCell>{purchase.title}</TableCell>
                          <TableCell>${purchase.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Completed</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Search className="mx-auto h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No order history</h3>
                    <p className="text-muted-foreground mb-4">Your order history will be displayed here once you make a purchase.</p>
                    <Button asChild>
                      <Link to="/products">Start Shopping</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

// We need to add the Badge and Table components
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default Purchases;
