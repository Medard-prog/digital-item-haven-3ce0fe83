
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-muted-foreground">Join SMCInsider and get access to exclusive trading resources</p>
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#8b5cf6',
                    brandAccent: '#7c3aed',
                    inputBackground: 'white',
                    inputBorder: '#e2e8f0',
                    inputBorderFocus: '#8b5cf6',
                    inputBorderHover: '#cbd5e1',
                    inputLabelText: '#64748b',
                    inputPlaceholder: '#94a3b8',
                    inputText: '#1e293b',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                label: 'auth-label',
                message: 'auth-message',
              },
            }}
            view="sign_up"
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Email address',
                  password_label: 'Create a password',
                  button_label: 'Create account',
                  link_text: "Don't have an account? Sign up",
                },
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  link_text: 'Already have an account? Sign in',
                },
              }
            }}
            theme="default"
            providers={[]}
            redirectTo={`${window.location.origin}/`}
          />
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
