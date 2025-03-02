
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type User = any; // Using 'any' temporarily as the Supabase user type is complex

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const refreshSession = async () => {
    try {
      console.log("Refreshing session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (session?.user) {
        console.log("Session found, user is logged in", session.user);
        setUser(session.user);
        
        // Fetch user profile to determine admin status
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setIsAdmin(false);
        } else {
          console.log("Profile data:", profileData);
          setIsAdmin(profileData?.is_admin || false);
        }
      } else {
        console.log("No session found, user is not logged in");
        // For development, create a fake user and admin status
        if (process.env.NODE_ENV === 'development') {
          console.log("Development mode: setting mock user");
          setUser({ id: 'dev-user-id', email: 'dev@example.com' });
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    } catch (error: any) {
      console.error('Error refreshing session:', error.message);
      // For development, create a fake user and admin status
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: setting mock user after error");
        setUser({ id: 'dev-user-id', email: 'dev@example.com' });
        setIsAdmin(true);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial session check
    refreshSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "session exists" : "no session");
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile to determine admin status
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setIsAdmin(false);
          } else {
            setIsAdmin(profileData?.is_admin || false);
          }
        } else {
          // For development, create a fake user and admin status
          if (process.env.NODE_ENV === 'development') {
            console.log("Development mode: setting mock user on auth change");
            setUser({ id: 'dev-user-id', email: 'dev@example.com' });
            setIsAdmin(true);
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        }
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
