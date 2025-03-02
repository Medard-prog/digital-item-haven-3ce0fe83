
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading, refreshSession } = useAuth();

  // Add debug console log
  console.log("AdminRoute - isAdmin:", isAdmin, "isLoading:", isLoading);

  useEffect(() => {
    // If it's been loading for more than 2 seconds, try refreshing the session
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("AdminRoute - Still loading after 2s, refreshing session");
        refreshSession();
      }
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [isLoading, refreshSession]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-lg">Loading authentication status...</span>
      </div>
    );
  }

  // For development purposes, always allow access
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.log("AdminRoute - isDevelopment:", isDevelopment);
  
  if (!isAdmin && !isDevelopment) {
    console.log("AdminRoute - Redirecting to home");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
