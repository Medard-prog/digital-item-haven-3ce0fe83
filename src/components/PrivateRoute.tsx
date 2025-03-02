
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  // Add debug console log
  console.log("PrivateRoute - user:", user ? "exists" : "null", "isLoading:", isLoading);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-lg">Loading authentication status...</span>
      </div>
    );
  }

  // For development purposes, allow access even if not logged in
  // IMPORTANT: Remove this condition in production!
  const allowAccess = user || process.env.NODE_ENV === 'development';

  if (!allowAccess) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
