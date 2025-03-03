
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

type User = any; // Using 'any' temporarily as the Supabase user type is complex

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Track if initial session check has completed
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const refreshSession = async () => {
    try {
      console.log("Refreshing session...");
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error.message);
        throw error;
      }
      
      if (session?.user) {
        console.log("Session found, user is logged in", session.user.email);
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
        setUser(null);
        setIsAdmin(false);
        
        // For development mode, create a mock user
        if (process.env.NODE_ENV === 'development') {
          console.log("Development mode: setting mock user");
          setUser({ id: 'dev-user-id', email: 'dev@example.com' });
          setIsAdmin(true);
        }
      }
    } catch (error: any) {
      console.error('Error refreshing session:', error.message);
      
      // For development mode, set a mock user
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
      setInitialCheckDone(true);
    }
  };

  // Add signOut function
  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log("Signing out...");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      console.log("Sign out successful");
      setUser(null);
      setIsAdmin(false);
      
      toast("Signed out successfully");
      
      // Force a page reload to clear any cached state
      window.location.href = '/';
      
    } catch (error: any) {
      console.error("Sign out error caught:", error);
      toast.error("Sign out failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        
        // Fetch user profile to determine admin status
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setIsAdmin(false);
        } else {
          setIsAdmin(profileData?.is_admin || false);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add register function
  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setIsAdmin(false); // New users are not admins by default
      }
    } catch (error: any) {
      console.error('Registration error:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add reset password function
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Reset password error:', error.message);
      throw error;
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
        
        if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setUser(null);
          setIsAdmin(false);
          return;
        }
        
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
        } else if (process.env.NODE_ENV === 'development') {
          console.log("Development mode: setting mock user on auth change");
          setUser({ id: 'dev-user-id', email: 'dev@example.com' });
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        
        setIsLoading(false);
        setInitialCheckDone(true);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Debug timeout: If loading state persists for too long, force it to complete
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        console.log("Force ending loading state after timeout");
        setIsLoading(false);
        setInitialCheckDone(true);
        
        // In development mode, set a mock user
        if (process.env.NODE_ENV === 'development' && !user) {
          setUser({ id: 'dev-user-id', email: 'dev@example.com' });
          setIsAdmin(true);
        }
      }, 3000); // 3 second timeout
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading: isLoading && !initialCheckDone,
      isAdmin, 
      signOut, 
      refreshSession, 
      login, 
      register, 
      resetPassword 
    }}>
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
