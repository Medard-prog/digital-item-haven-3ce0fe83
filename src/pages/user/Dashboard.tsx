
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import UserSidebar from '@/components/UserSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        // Handle development mode
        if (process.env.NODE_ENV === 'development') {
          console.log("Dashboard - Development mode: setting mock profile");
          setProfile({
            id: 'dev-user-id',
            first_name: 'Dev',
            last_name: 'User',
            email: 'dev@example.com',
            avatar_url: null
          });
        } else {
          setProfile(null);
        }
        setIsProfileLoading(false);
        return;
      }
      
      try {
        console.log("Dashboard - Fetching profile for user:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setProfile(data);
        
        // Also fetch recent orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*, order_items(*, products(title, image_url))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (ordersError) {
          console.error('Error loading orders:', ordersError);
        } else {
          setRecentOrders(ordersData || []);
        }
        
      } catch (error) {
        console.error('Error loading profile:', error);
        
        // For development mode, set a mock profile
        if (process.env.NODE_ENV === 'development') {
          setProfile({
            id: user.id,
            first_name: 'Dev',
            last_name: 'User',
            email: user.email,
            avatar_url: null
          });
        }
      } finally {
        setIsProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  if (isLoading || isProfileLoading) {
    return (
      <UserSidebar>
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Loading Dashboard</h2>
            <p className="text-muted-foreground">Please wait while we load your information...</p>
          </div>
        </div>
      </UserSidebar>
    );
  }
  
  return (
    <UserSidebar>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Name: </span>
                  <span>
                    {profile?.first_name || 'Not set'} {profile?.last_name || ''}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Email: </span>
                  <span>{profile?.email || user?.email || 'Not available'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
              <CardDescription>View your recent orders</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div key={order.id} className="border-b pb-3">
                      <p className="text-sm text-muted-foreground">
                        Order #{order.id.substring(0, 8)} - {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="font-medium">${parseFloat(order.total).toFixed(2)}</p>
                      <p className="text-sm capitalize">{order.status}</p>
                    </div>
                  ))}
                  <button 
                    className="text-primary hover:underline"
                    onClick={() => navigate('/purchases')}
                  >
                    View All Purchases
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">You have no recent purchases.</p>
                  <button 
                    className="text-primary hover:underline"
                    onClick={() => navigate('/products')}
                  >
                    Browse Products
                  </button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </UserSidebar>
  );
};

export default Dashboard;
