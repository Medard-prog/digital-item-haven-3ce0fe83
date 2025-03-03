
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Direct check of admin status from database
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!user?.id) {
          setIsAdmin(false);
          setLocalLoading(false);
          return;
        }

        console.log("AdminRoute - Checking admin status for user ID:", user.id);
        
        // Directly query the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error checking admin status:", error);
          setError("Failed to verify admin status. Please try again.");
          setIsAdmin(false);
          
          // In development mode, allow access
          if (process.env.NODE_ENV === 'development') {
            console.log("Development mode: setting admin to true despite error");
            setIsAdmin(true);
          }
        } else {
          console.log("Admin check result:", data);
          setIsAdmin(!!data?.is_admin);
        }
        
        setLocalLoading(false);
      } catch (err) {
        console.error("Exception in admin check:", err);
        setError("An unexpected error occurred. Please try again.");
        setIsAdmin(false);
        setLocalLoading(false);
        
        // In development mode, allow access
        if (process.env.NODE_ENV === 'development') {
          console.log("Development mode: setting admin to true despite error");
          setIsAdmin(true);
        }
      }
    };

    if (!isLoading) {
      checkAdminStatus();
    }
    
    // Add a timeout to prevent infinite loading states
    const timeoutId = setTimeout(() => {
      if (localLoading) {
        console.log("Force ending admin check loading state after timeout");
        setLocalLoading(false);
        
        // In development mode, allow access
        if (process.env.NODE_ENV === 'development') {
          console.log("Development mode: setting admin to true after timeout");
          setIsAdmin(true);
        }
      }
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [user, isLoading]);

  // Debug logs
  console.log("AdminRoute - user:", user ? "exists" : "null", "isAdmin:", isAdmin, "isLoading:", isLoading, "localLoading:", localLoading);

  // Development mode always gets access
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (localLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <span className="text-lg font-medium">Verifying admin access...</span>
        <p className="text-muted-foreground mt-2">Just a moment</p>
      </div>
    );
  }

  if (error) {
    toast.error("Admin access verification failed");
    
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }
  
  if ((!user || !isAdmin) && !isDevelopment) {
    console.log("AdminRoute - Redirecting to dashboard - Not admin. User:", user?.id, "isAdmin:", isAdmin);
    toast.error("You don't have admin privileges to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
