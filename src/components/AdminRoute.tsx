
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAuth();

  // Add debug console log
  console.log("AdminRoute - isAdmin:", isAdmin, "isLoading:", isLoading);

  // Development mode always gets admin access
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isLoading && !isDevelopment) {
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
