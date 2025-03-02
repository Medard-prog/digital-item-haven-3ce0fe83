
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
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
          console.log("AdminRoute - Admin status from DB:", data?.is_admin);
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

  // For development, always grant admin access
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (localLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-lg">Verifying admin status...</span>
      </div>
    );
  }

  console.log("AdminRoute - Final decision - isDevelopment:", isDevelopment, "isAdmin:", isAdmin);
  
  if (!isAdmin && !isDevelopment) {
    console.log("AdminRoute - Redirecting to home, user is not an admin");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
