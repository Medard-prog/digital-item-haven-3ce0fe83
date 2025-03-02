
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
import { Line } from 'recharts';
import { UserRound, Package, ShoppingCart, DollarSign, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  });
  
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
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
        
        // Calculate total revenue
        const totalRevenue = orders?.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0) || 0;
        
        // Get top products (mock data for now, would need order_items join in real implementation)
        const topProducts = products?.slice(0, 5).map(product => ({
          id: product.id,
          title: product.title,
          sales: Math.floor(Math.random() * 50) + 1 // Mock sales data
        })) || [];
        
        // Recent orders - use profileMap to get email
        const recentOrders = orders?.slice(0, 5).map(order => ({
          id: order.id,
          customer: profileMap.get(order.user_id) || 'Unknown',
          amount: parseFloat(order.total || '0').toFixed(2),
          status: order.status,
          date: new Date(order.created_at).toLocaleDateString()
        })) || [];
        
        setStats({
          totalCustomers: customerCount || 0,
          totalProducts: products?.length || 0,
          totalOrders: orders?.length || 0,
          totalRevenue,
          recentOrders,
          topProducts
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);
  
  // Sample data for chart - in real implementation, this would come from actual orders
  const chartData = [
    { name: 'Jan', total: 1800 },
    { name: 'Feb', total: 2200 },
    { name: 'Mar', total: 1700 },
    { name: 'Apr', total: 2600 },
    { name: 'May', total: 3100 },
    { name: 'Jun', total: 2900 },
    { name: 'Jul', total: 3700 },
    { name: 'Aug', total: 4100 }
  ];

  // Chart configuration
  const chartConfig = {
    total: {
      label: 'Revenue',
      color: '#0052CC'
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button>Download Report</Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+12.4% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">+7.2% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">+5.3% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">+14.9% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="aspect-[4/3] sm:aspect-[16/9]"
                  config={chartConfig}
                >
                  <Line
                    data={chartData}
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
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.date} · {order.status}
                            </p>
                          </div>
                          <p className="font-medium">${order.amount}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No recent orders</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {stats.topProducts.length > 0 ? (
                      stats.topProducts.map((product: any) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{product.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.sales} sales
                            </p>
                          </div>
                          <p className="font-medium">#{product.id.substring(0, 8)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No products data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Analytics content would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Reports content would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
