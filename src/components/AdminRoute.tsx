
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading, refreshSession, user } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);

  // Introduce a timeout to stop waiting for isLoading if it takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Always refresh session when mounting an admin route
    refreshSession();
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        console.log("AdminRoute - Still loading after 2s, refreshing session");
        refreshSession(); // Try to refresh the session
        
        // Set another timeout if still not resolved
        const secondTimeoutId = setTimeout(() => {
          console.log("AdminRoute - Loading timeout reached");
          setLocalLoading(false);
        }, 2000); // Wait another 2 seconds after refresh attempt
        
        return () => {
          if (secondTimeoutId) clearTimeout(secondTimeoutId);
        };
      }, 2000); // Wait initial 2 seconds
    } else {
      setLocalLoading(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, refreshSession]);

  // Add debug console log
  console.log("AdminRoute - isAdmin:", isAdmin, "isLoading:", isLoading, "localLoading:", localLoading, "user:", user ? "exists" : "null");

  // Development mode always gets admin access
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (localLoading && isLoading) {
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
