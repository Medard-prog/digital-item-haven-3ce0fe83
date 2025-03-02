
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, refreshSession } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);

  // Introduce a timeout to stop waiting for isLoading if it takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Always refresh session when mounting a private route
    refreshSession();
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        console.log("Force ending loading state after timeout");
        setLocalLoading(false);
      }, 1500); // 1.5 second timeout - reduced from 2 seconds for better UX
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
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-lg">Loading authentication status...</span>
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
