
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, refreshSession } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);

  // Use a faster timeout and more reliable loading state management
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Always refresh session when mounting a private route
    refreshSession();
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        console.log("Force ending loading state after timeout");
        setLocalLoading(false);
      }, 1000); // 1 second timeout for better UX
    } else {
      setLocalLoading(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, refreshSession]);

  // Debug console log
  console.log("PrivateRoute - user:", user ? "exists" : "null", "isLoading:", isLoading, "localLoading:", localLoading);

  // Development mode always gets access
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (localLoading && isLoading && !isDevelopment) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <span className="text-lg font-medium">Verifying your access...</span>
        <p className="text-muted-foreground mt-2">Just a moment</p>
      </div>
    );
  }

  console.log("PrivateRoute - isDevelopment:", isDevelopment);
  
  if (!user && !isDevelopment) {
    console.log("PrivateRoute - Redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
