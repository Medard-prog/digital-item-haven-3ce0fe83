
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      await register(registerData.email, registerData.password);
      toast({
        title: "Registration successful",
        description: "Welcome! You can now log in.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "There was an error creating your account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegisterSubmit}>
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Join us and get access to exclusive trading resources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              className="pl-10 pr-10"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              className="pl-10 pr-10"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              required
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></div>
              <span>Creating account...</span>
            </div>
          ) : (
            <div className="flex items-center">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default RegisterForm;
