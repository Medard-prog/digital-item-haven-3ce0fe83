
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Award, BookOpen, Calendar, Download, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchases, setPurchases] = useState<any[]>([]);
  
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserPurchases();
    }
  }, [user]);
  
  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };
  
  const fetchUserPurchases = async () => {
    setIsLoading(true);
    try {
      // Fetch orders for current user
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      // For each order, fetch the order items and product details
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products:product_id (title, image_url, price),
            product_variants:variant_id (name)
          `)
          .eq('order_id', order.id.toString());
        
        if (itemsError) throw itemsError;
        
        return {
          ...order,
          items: items || []
        };
      }));
      
      setPurchases(ordersWithItems);
    } catch (error: any) {
      console.error('Error fetching purchases:', error);
      toast({
        title: "Error fetching purchases",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };
  
  const userName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'User';
  const userInitials = getInitials(userName !== 'User' ? userName : user?.email?.split('@')[0]);
  
  // Calculate total spent and count products
  const totalSpent = purchases.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
  const totalProducts = purchases.reduce((sum, order) => sum + order.items.length, 0);
  
  // Get purchase date for most recent order
  const mostRecentPurchase = purchases.length > 0 
    ? new Date(purchases[0].created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : 'No purchases yet';
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {userName !== 'User' ? userName : user?.email?.split('@')[0]}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/user/profile">
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="purchases">My Purchases</TabsTrigger>
            <TabsTrigger value="resources">Learning Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <motion.div 
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              variants={containerAnimation}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemAnimation}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Spent
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      {purchases.length} orders
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemAnimation}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Products Purchased
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalProducts}</div>
                    <p className="text-xs text-muted-foreground">
                      Trading resources
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemAnimation}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Recent Purchase
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mostRecentPurchase}</div>
                    <p className="text-xs text-muted-foreground">
                      Last order date
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemAnimation}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Account Status
                    </CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Active</div>
                    <p className="text-xs text-muted-foreground">
                      Standard membership
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Access your resources or find new trading materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Button asChild className="w-full justify-between">
                    <Link to="/products">
                      Browse products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link to="/user/purchases">
                      View purchases
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full justify-between">
                    <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer">
                      Join Discord community
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Purchases</CardTitle>
                  <CardDescription>
                    Your latest trading resources
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <p className="text-center text-muted-foreground py-6">Loading purchases...</p>
                  ) : purchases.length > 0 ? (
                    purchases.slice(0, 3).flatMap(order => 
                      order.items.slice(0, 2).map((item: any, index: number) => (
                        <div key={`${order.id}-${index}`} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                              {item.products?.image_url ? (
                                <img 
                                  src={item.products.image_url} 
                                  alt={item.products?.title} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">{item.products?.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.product_variants?.name 
                                  ? `${item.product_variants.name} version` 
                                  : 'English version'}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" asChild>
                            <Link to={`/user/purchases`}>
                              <Download className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))
                    )
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">You haven't purchased any resources yet.</p>
                      <Button asChild>
                        <Link to="/products">Browse Products</Link>
                      </Button>
                    </div>
                  )}
                  
                  {purchases.length > 0 && (
                    <div className="pt-2">
                      <Button variant="link" asChild className="px-0">
                        <Link to="/user/purchases">View all purchases</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="purchases">
            <Card>
              <CardHeader>
                <CardTitle>My Purchases</CardTitle>
                <CardDescription>
                  All the trading resources you've purchased
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center text-muted-foreground py-12">Loading purchases...</p>
                ) : purchases.length > 0 ? (
                  <div className="space-y-8">
                    {purchases.map((order) => (
                      <div key={order.id} className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <p className="font-medium">Order #{order.id.toString().substring(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge>{order.status}</Badge>
                            <p className="font-medium">${parseFloat(order.total.toString()).toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                                  {item.products?.image_url ? (
                                    <img 
                                      src={item.products.image_url} 
                                      alt={item.products?.title} 
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted">
                                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium line-clamp-1">{item.products?.title}</p>
                                  {item.product_variants?.name && (
                                    <Badge variant="outline" className="mt-1">
                                      {item.product_variants.name}
                                    </Badge>
                                  )}
                                  <p className="text-sm text-muted-foreground mt-1">
                                    ${parseFloat(item.price.toString()).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <Button size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-6">You haven't purchased any resources yet.</p>
                    <Button asChild>
                      <Link to="/products">Browse Products</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
                <CardDescription>
                  Track your progress and access your trading materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchases.length > 0 ? (
                  <div className="space-y-6">
                    {purchases.flatMap(order => 
                      order.items.map((item: any) => (
                        <div key={item.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                                {item.products?.image_url ? (
                                  <img 
                                    src={item.products.image_url} 
                                    alt={item.products?.title} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{item.products?.title}</p>
                                {item.product_variants?.name && (
                                  <Badge variant="outline" className="mt-1">
                                    {item.product_variants.name}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Access
                            </Button>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>23%</span>
                            </div>
                            <Progress value={23} className="h-2" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-6">Purchase resources to start learning.</p>
                    <Button asChild>
                      <Link to="/products">Browse Products</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View all resources</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
