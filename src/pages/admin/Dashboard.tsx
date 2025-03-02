
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
import { Line, Bar } from 'recharts';
import { UserRound, Package, ShoppingCart, DollarSign, Loader2, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

// Function to fetch dashboard data
const fetchDashboardData = async () => {
  try {
    // Fetch all required data in parallel for better performance
    const [
      { count: customerCount, error: customerError },
      { data: products, error: productsError },
      { data: orders, error: ordersError },
      { data: profiles, error: profilesError }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*'),
      supabase.from('orders').select('*'),
      supabase.from('profiles').select('id, email')
    ]);
    
    if (customerError) throw customerError;
    if (productsError) throw productsError;
    if (ordersError) throw ordersError;
    if (profilesError) throw profilesError;
    
    // Create a map of profile IDs to emails for easy lookup
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile.email);
    });
    
    // Calculate total revenue - ensuring we convert to string before parsing to handle null/undefined
    const totalRevenue = orders?.reduce((sum, order) => {
      const orderTotal = typeof order.total === 'string' ? parseFloat(order.total) : (order.total || 0);
      return sum + orderTotal;
    }, 0) || 0;
    
    // Get top products (mock data for now, would need order_items join in real implementation)
    const topProducts = products?.slice(0, 5).map(product => ({
      id: product.id,
      title: product.title,
      sales: Math.floor(Math.random() * 50) + 1 // Mock sales data
    })) || [];
    
    // Recent orders - use profileMap to get email and ensure amount is a string
    const recentOrders = orders?.slice(0, 5).map(order => {
      // Safely parse the order total to a number, then convert to fixed string
      const orderTotal = typeof order.total === 'string' ? parseFloat(order.total) : (order.total || 0);
      return {
        id: order.id,
        customer: profileMap.get(order.user_id) || 'Unknown',
        amount: orderTotal.toFixed(2),
        status: order.status || 'pending',
        date: new Date(order.created_at).toLocaleDateString()
      };
    }) || [];
    
    return {
      totalCustomers: customerCount || 0,
      totalProducts: products?.length || 0,
      totalOrders: orders?.length || 0,
      totalRevenue,
      recentOrders,
      topProducts
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Sample data for charts - in real implementation, this would come from actual data
const revenueData = [
  { name: 'Jan', total: 1800 },
  { name: 'Feb', total: 2200 },
  { name: 'Mar', total: 1700 },
  { name: 'Apr', total: 2600 },
  { name: 'May', total: 3100 },
  { name: 'Jun', total: 2900 },
  { name: 'Jul', total: 3700 },
  { name: 'Aug', total: 4100 }
];

const salesData = [
  { name: 'Mon', sales: 120 },
  { name: 'Tue', sales: 160 },
  { name: 'Wed', sales: 180 },
  { name: 'Thu', sales: 140 },
  { name: 'Fri', sales: 210 },
  { name: 'Sat', sales: 290 },
  { name: 'Sun', sales: 190 }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Use React Query for data fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    staleTime: 300000, // 5 minutes
  });
  
  // Calculate percentage changes (mock data for demo)
  const percentChanges = {
    revenue: 12.4,
    customers: 7.2,
    products: 5.3,
    orders: 14.9
  };
  
  // Chart configurations
  const revenueChartConfig = {
    total: {
      label: 'Revenue',
      color: '#0052CC'
    }
  };
  
  const salesChartConfig = {
    sales: {
      label: 'Sales',
      color: '#10B981'
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-10 w-36" />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[1, 2, 3, 4].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-28 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg text-center">
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
              Error Loading Dashboard Data
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {(error as Error).message || "There was an error loading dashboard data. Please try again."}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your admin dashboard.</p>
          </div>
          <Button onClick={() => navigate('/admin/reports')}>
            Generate Report
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data?.totalRevenue.toFixed(2) || "0.00"}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {percentChanges.revenue >= 0 ? (
                  <>
                    <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-500 font-medium">{percentChanges.revenue}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500 font-medium">{Math.abs(percentChanges.revenue)}%</span>
                  </>
                )}
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalCustomers || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {percentChanges.customers >= 0 ? (
                  <>
                    <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-500 font-medium">{percentChanges.customers}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500 font-medium">{Math.abs(percentChanges.customers)}%</span>
                  </>
                )}
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalProducts || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {percentChanges.products >= 0 ? (
                  <>
                    <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-500 font-medium">{percentChanges.products}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500 font-medium">{Math.abs(percentChanges.products)}%</span>
                  </>
                )}
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalOrders || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {percentChanges.orders >= 0 ? (
                  <>
                    <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-500 font-medium">{percentChanges.orders}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500 font-medium">{Math.abs(percentChanges.orders)}%</span>
                  </>
                )}
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="aspect-[4/3] sm:aspect-[16/9]"
                  config={revenueChartConfig}
                >
                  <Line
                    data={revenueData}
                    dataKey="total"
                    stroke="#0052CC"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </ChartContainer>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {data?.recentOrders && data.recentOrders.length > 0 ? (
                      data.recentOrders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium line-clamp-1">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.date} · {order.status}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">${order.amount}</span>
                            <button 
                              className="text-primary hover:underline text-sm font-medium"
                              onClick={() => navigate(`/admin/orders/${order.id}`)}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No recent orders</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best selling products</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {data?.topProducts && data.topProducts.length > 0 ? (
                      data.topProducts.map((product: any) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium line-clamp-1">{product.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.sales} sales
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                              Top Seller
                            </span>
                            <button 
                              className="text-primary hover:underline text-sm font-medium"
                              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No products data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Sales</CardTitle>
                <CardDescription>Sales performance for the current week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="aspect-[4/3] sm:aspect-[16/9]"
                  config={salesChartConfig}
                >
                  <Bar
                    data={salesData}
                    dataKey="sales"
                    fill="#10B981"
                    radius={4}
                  />
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed analytics reports and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-16 w-16 text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    We're currently building a comprehensive analytics dashboard to help you track and analyze your business performance.
                  </p>
                  <Button variant="outline">Request Early Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
