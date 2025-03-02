
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, refreshSession } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!user?.id) {
          console.log("AdminRoute - No user found");
          setIsAdmin(false);
          setLocalLoading(false);
          return;
        }

        console.log("AdminRoute - Checking admin status for user:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching admin status:", error);
          setIsAdmin(false);
        } else {
          console.log("AdminRoute - Admin status:", data?.is_admin);
          setIsAdmin(!!data?.is_admin);
        }
      } catch (error) {
        console.error("Error in admin check:", error);
        setIsAdmin(false);
      } finally {
        setLocalLoading(false);
      }
    };

    if (!isLoading) {
      checkAdminStatus();
    }
  }, [user, isLoading]);

  // Always refresh session when mounting an admin route
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Add debug console log
  console.log("AdminRoute - isAdmin:", isAdmin, "isLoading:", isLoading, "localLoading:", localLoading, "user:", user ? "exists" : "null");

  // Development mode always gets admin access
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (localLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-lg">Loading authentication status...</span>
      </div>
    );
  }

  console.log("AdminRoute - isDevelopment:", isDevelopment);
  
  if (!isAdmin && !isDevelopment) {
    console.log("AdminRoute - Redirecting to home");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
