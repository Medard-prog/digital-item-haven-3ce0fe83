
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isAdmin, refreshSession } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a timeout to stop waiting for isLoading if it takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkAdmin = async () => {
      try {
        // Always refresh session when mounting an admin route
        await refreshSession();
        setLocalLoading(false);
      } catch (err) {
        console.error("Error checking admin status:", err);
        setError("Failed to verify admin status. Please try again.");
        setLocalLoading(false);
      }
    };

    checkAdmin();
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        console.log("Force ending admin check loading state after timeout");
        setLocalLoading(false);
      }, 1000); // 1 second timeout
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, refreshSession]);

  // Debug console log
  console.log("AdminRoute - user:", user ? "exists" : "null", "isAdmin:", isAdmin, "isLoading:", isLoading, "localLoading:", localLoading);

  // Development mode always gets access
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (localLoading && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <span className="text-lg font-medium">Verifying admin access...</span>
        <p className="text-muted-foreground mt-2">Just a moment</p>
      </div>
    );
  }

  if (error) {
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
    console.log("AdminRoute - Redirecting to dashboard - Not admin");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
