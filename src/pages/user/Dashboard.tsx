
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, ShoppingBag, Shield, Settings, Calendar, PieChart } from 'lucide-react';
import UserSidebar from '@/components/UserSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

// Function to fetch profile data
const fetchProfile = async (userId: string | undefined) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
};

// Function to fetch recent orders
const fetchRecentOrders = async (userId: string | undefined) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(title, image_url))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3);
    
  if (error) throw error;
  return data || [];
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use React Query for data fetching with better caching and loading states
  const { 
    data: profile,
    isLoading: isProfileLoading,
    error: profileError 
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user?.id),
    enabled: !!user?.id,
    staleTime: 300000, // 5 minutes
  });
  
  const { 
    data: recentOrders,
    isLoading: isOrdersLoading,
    error: ordersError 
  } = useQuery({
    queryKey: ['recentOrders', user?.id],
    queryFn: () => fetchRecentOrders(user?.id),
    enabled: !!user?.id,
    staleTime: 300000, // 5 minutes
  });
  
  const isLoading = isProfileLoading || isOrdersLoading;
  
  // Mock data for stats
  const stats = [
    { label: 'Total Purchases', value: recentOrders?.length || 0, icon: ShoppingBag },
    { label: 'Favorites', value: '4', icon: PieChart },
    { label: 'Account Age', value: '24 days', icon: Calendar },
  ];
  
  return (
    <UserSidebar>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.first_name || user?.email?.split('@')[0] || 'User'}!
          </p>
        </header>
        
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-3xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Quick Access */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                My Profile
              </CardTitle>
              <CardDescription>Manage personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your personal details and preferences
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/profile')}>
                View Profile
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                My Purchases
              </CardTitle>
              <CardDescription>View your order history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {recentOrders && recentOrders.length > 0 
                  ? `You have ${recentOrders.length} recent order${recentOrders.length > 1 ? 's' : ''}`
                  : 'No recent purchases'}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/purchases')}>
                View Purchases
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update password and security settings
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/security')}>
                View Security
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set notification and display preferences
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/preferences')}>
                View Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              {isProfileLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : profileError ? (
                <div className="text-red-500">Error loading profile: {(profileError as Error).message}</div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Name</div>
                    <div className="col-span-2">
                      {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Not set'}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Email</div>
                    <div className="col-span-2">{profile?.email || user?.email || 'Not available'}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Account Type</div>
                    <div className="col-span-2">{profile?.is_admin ? 'Administrator' : 'Standard User'}</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/profile')}>
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recent Purchases */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
              <CardDescription>View your recent orders</CardDescription>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : ordersError ? (
                <div className="text-red-500">Error loading orders: {(ordersError as Error).message}</div>
              ) : recentOrders && recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="rounded-md h-12 w-12 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Order #{order.id.substring(0, 8)} - {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="font-medium">${parseFloat(order.total).toFixed(2)}</p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                        {order.status}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="ghost"
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                    onClick={() => navigate('/purchases')}
                  >
                    View All Purchases
                  </Button>
                </div>
              ) : (
                <>
                  <div className="py-8 text-center">
                    <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground mb-4">You have no recent purchases.</p>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/products')}
                    >
                      Browse Products
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </UserSidebar>
  );
};

export default Dashboard;
