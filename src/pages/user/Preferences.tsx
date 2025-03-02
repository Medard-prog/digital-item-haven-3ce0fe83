
import React, { useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bell, Moon, Languages, Mail, Loader2, Save, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Preferences = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('english');
  const [digestFrequency, setDigestFrequency] = useState('weekly');
  const [theme, setTheme] = useState('system');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSavePreferences = async () => {
    if (!user?.id) return;
    
    try {
      setIsSaving(true);
      
      // In a real application, you would save the preferences to the database
      // For example:
      // await supabase
      //   .from('user_preferences')
      //   .upsert({
      //     user_id: user.id,
      //     email_notifications: emailNotifications,
      //     marketing_emails: marketingEmails,
      //     product_updates: productUpdates,
      //     dark_mode: darkMode,
      //     language: language,
      //     digest_frequency: digestFrequency,
      //     theme: theme
      //   });
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Preferences saved",
        description: "Your preference changes have been saved successfully."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving preferences",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <UserSidebar>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-7 w-7 text-primary" />
            Preferences
          </h1>
          <p className="text-muted-foreground">
            Customize your experience and communication settings
          </p>
        </header>
        
        <div className="grid gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications about your account activity
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    disabled={isSaving}
                  />
                </div>
                
                <div className="flex items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <Label htmlFor="marketing-emails" className="font-medium">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about promotions and new products
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                    disabled={isSaving}
                  />
                </div>
                
                <div className="flex items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <Label htmlFor="product-updates" className="font-medium">Product Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new features and updates
                    </p>
                  </div>
                  <Switch
                    id="product-updates"
                    checked={productUpdates}
                    onCheckedChange={setProductUpdates}
                    disabled={isSaving}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Language & Appearance
                </CardTitle>
                <CardDescription>Customize how the application looks and behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-medium">Theme Mode</Label>
                  <RadioGroup 
                    value={theme} 
                    onValueChange={setTheme}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system">System</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language-select" className="font-medium">Language</Label>
                  <Select value={language} onValueChange={setLanguage} disabled={isSaving}>
                    <SelectTrigger id="language-select" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Digest Frequency
                </CardTitle>
                <CardDescription>Set how often you want to receive email digests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="digest-frequency" className="font-medium">Digest Frequency</Label>
                <Select value={digestFrequency} onValueChange={setDigestFrequency} disabled={isSaving}>
                  <SelectTrigger id="digest-frequency" className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <Button variant="outline" disabled={isSaving}>
                  Reset to Default
                </Button>
                <Button onClick={handleSavePreferences} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </UserSidebar>
  );
};

// Import the Settings icon at the top
import { Settings } from 'lucide-react';

export default Preferences;
