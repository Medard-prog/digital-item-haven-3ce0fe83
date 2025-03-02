
import React, { useState, useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User as UserIcon, Mail, Camera } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setProfile(data);
        setFirstName(data?.first_name || '');
        setLastName(data?.last_name || '');
        setEmail(data?.email || user.email || '');
        setAvatarUrl(data?.avatar_url || '');
        
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: "Failed to load your profile information"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);
  
  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: email,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setProfile({
        ...profile,
        first_name: firstName,
        last_name: lastName,
        email: email,
        avatar_url: avatarUrl
      });
      
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    try {
      setIsSaving(true);
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      if (data?.publicUrl) {
        setAvatarUrl(data.publicUrl);
      }
      
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been uploaded successfully"
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error uploading avatar",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const userInitials = firstName && lastName 
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : user?.email 
      ? user.email.substring(0, 2).toUpperCase() 
      : 'U';
  
  if (isLoading) {
    return (
      <UserSidebar>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Loading Profile</h2>
            <p className="text-muted-foreground">Please wait while we load your information...</p>
          </div>
        </div>
      </UserSidebar>
    );
  }
  
  return (
    <UserSidebar>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                {isEditing ? "Edit Profile" : "Personal Information"}
              </CardTitle>
              <CardDescription>Manage your personal information and profile settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/80 transition-colors"
                    >
                      <Camera className="h-5 w-5" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload}
                        disabled={isSaving}
                      />
                    </label>
                  )}
                </div>
                
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h3 className="font-medium text-xl">
                    {profile?.first_name || ''} {profile?.last_name || ''}
                  </h3>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    {profile?.email || user?.email || 'No email set'}
                  </p>
                </div>
              </div>
              
              {isEditing ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input 
                      id="first-name" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input 
                      id="last-name" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium block mb-1">First Name</span>
                      <span>{profile?.first_name || 'Not set'}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium block mb-1">Last Name</span>
                      <span>{profile?.last_name || 'Not set'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium block mb-1">Email</span>
                    <span>{profile?.email || user?.email || 'Not available'}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isEditing ? (
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Information about your account status and membership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium block mb-1">Account Status</span>
                <span className="text-green-500 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                  Active
                </span>
              </div>
              
              <div>
                <span className="text-sm font-medium block mb-1">Member Since</span>
                <span>
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString() 
                    : 'Not available'}
                </span>
              </div>
              
              <div>
                <span className="text-sm font-medium block mb-1">Last Updated</span>
                <span>
                  {profile?.updated_at 
                    ? new Date(profile.updated_at).toLocaleDateString() 
                    : 'Not available'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserSidebar>
  );
};

export default Profile;
