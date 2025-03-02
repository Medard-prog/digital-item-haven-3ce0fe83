
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Download, Package, Heart, Settings, LayoutDashboard, History, ShoppingBag, FileText, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuth();
  const { state } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  
  useEffect(() => {
    if (user) {
      fetchUserPurchases();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  const fetchUserPurchases = async () => {
    setIsLoading(true);
    try {
      // Fetch orders for this user
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id);
      
      if (ordersError) throw ordersError;
      
      // For each order, fetch the order items with product details
      const purchasesWithDetails = [];
      let totalAmount = 0;
      
      for (const order of orders || []) {
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('*, products(*)')
          .eq('order_id', order.id);
        
        if (itemsError) throw itemsError;
        
        // Add each order item as a purchase
        for (const item of orderItems || []) {
          purchasesWithDetails.push({
            id: item.id,
            productName: item.products?.title || 'Unknown Product',
            date: order.created_at,
            price: parseFloat(item.price),
            status: order.status,
            downloadLink: '#', // In a real app, generate download links
            quantity: item.quantity,
            productId: item.product_id
          });
          
          totalAmount += parseFloat(item.price) * item.quantity;
        }
      }
      
      setPurchases(purchasesWithDetails);
      setTotalSpent(totalAmount);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  // Mocked favorites from store (in a real app, fetch from database)
  const favorites = state.products.slice(0, 2);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col gap-6"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user?.email?.split('@')[0] || 'Trader'}</p>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 md:w-fit">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="purchases" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden sm:inline">Purchases</span>
                </TabsTrigger>
                <TabsTrigger value="downloads" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Downloads</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Favorites</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="glass-morphism">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Purchases</CardTitle>
                      <CardDescription>Your lifetime purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{purchases.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-morphism">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Spent</CardTitle>
                      <CardDescription>Amount invested in education</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        ${totalSpent.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-morphism">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Saved Favorites</CardTitle>
                      <CardDescription>Products you've bookmarked</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{favorites.length}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <History className="mr-2 h-5 w-5" /> Recent Purchases
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {purchases.length > 0 ? (
                        <ScrollArea className="h-60">
                          <div className="space-y-4">
                            {purchases.slice(0, 3).map((purchase) => (
                              <div key={purchase.id} className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{purchase.productName}</h4>
                                  <p className="text-sm text-muted-foreground">{new Date(purchase.date).toLocaleDateString()}</p>
                                </div>
                                <Badge>${purchase.price.toFixed(2)}</Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          You haven't made any purchases yet
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link to="#purchases">View All Purchases</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5" /> Community
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-60">
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium flex items-center">
                              <Users className="mr-2 h-4 w-4" /> Trading Community
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Join our community of traders to share insights
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm" className="h-8 gap-1">
                                <svg className="h-4 w-4" viewBox="0 0 127.14 96.36">
                                  <path
                                    d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                                    fill="currentColor"
                                  />
                                </svg>
                                Discord
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 gap-1">
                                <img src="/icons/telegram.svg" alt="Telegram" className="h-4 w-4" />
                                Telegram
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="purchases" className="space-y-4 pt-4">
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                    <CardDescription>
                      View and download your purchased digital products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {purchases.length > 0 ? (
                      <div className="space-y-6">
                        {purchases.map((purchase) => (
                          <div key={purchase.id} className="flex flex-col md:flex-row justify-between gap-4 border-b pb-4">
                            <div>
                              <h3 className="font-medium">{purchase.productName}</h3>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm mt-1">
                                <p className="text-muted-foreground">
                                  Purchased on {new Date(purchase.date).toLocaleDateString()}
                                </p>
                                <Badge variant="outline" className="w-fit">
                                  ${purchase.price.toFixed(2)}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 md:mt-0">
                              <Button size="sm" variant="outline" className="h-8 gap-1">
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No purchases yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          You haven't purchased any digital products yet.
                        </p>
                        <Button asChild>
                          <Link to="/products">Browse Products</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="downloads" className="pt-4">
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle>Your Downloads</CardTitle>
                    <CardDescription>
                      Access all your purchased digital products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {purchases.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {purchases.map((purchase) => (
                          <Card key={purchase.id} className="flex flex-col h-full">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{purchase.productName}</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 flex-1">
                              <p className="text-sm text-muted-foreground">
                                Purchased on {new Date(purchase.date).toLocaleDateString()}
                              </p>
                              <Badge variant="secondary" className="mt-2">
                                Digital Product
                              </Badge>
                            </CardContent>
                            <CardFooter className="border-t pt-4">
                              <Button variant="outline" className="w-full gap-2">
                                <Download className="h-4 w-4" />
                                Download Now
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No downloads available</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Purchase a product to get access to downloads.
                        </p>
                        <Button asChild>
                          <Link to="/products">Browse Products</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="favorites" className="pt-4">
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle>Your Favorites</CardTitle>
                    <CardDescription>
                      Products you've saved for later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {favorites.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favorites.map((product) => (
                          <Card key={product.id} className="flex flex-col h-full">
                            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden">
                              <img 
                                src={product.image || '/placeholder.svg'} 
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{product.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 flex-1">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.description}
                              </p>
                              <div className="mt-2 font-bold">
                                ${parseFloat(product.price).toFixed(2)}
                              </div>
                            </CardContent>
                            <CardFooter className="border-t pt-4 grid grid-cols-2 gap-2">
                              <Button variant="outline" className="w-full">
                                <Heart className="h-4 w-4 mr-2 text-destructive" fill="currentColor" />
                                Remove
                              </Button>
                              <Button asChild>
                                <Link to={`/product/${product.id}`}>
                                  View
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          You haven't added any products to your favorites yet.
                        </p>
                        <Button asChild>
                          <Link to="/products">Browse Products</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
