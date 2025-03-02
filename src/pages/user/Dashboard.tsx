
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { User, Clock, Download, BookOpen, ShoppingCart, BookCheck, FileText, Bookmark } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display mb-2">Welcome back, {user?.email?.split('@')[0] || 'Trader'}</h1>
          <p className="text-muted-foreground">Manage your resources and track your trading progress</p>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <motion.div variants={itemVariants}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <BookCheck className="mr-2 h-5 w-5 text-primary" />
                      Your Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Access your purchased trading courses and resources.</p>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/purchases">View Courses</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Clock className="mr-2 h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Track your recent actions and purchases.</p>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Login from new device</span>
                          <span className="text-muted-foreground">2 hours ago</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Profile updated</span>
                          <span className="text-muted-foreground">3 days ago</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
                      Recommended
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Resources that might interest you based on your activity.</p>
                      <Button asChild className="w-full">
                        <Link to="/products">Browse Resources</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants} className="lg:col-span-3">
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <BookOpen className="mr-2 h-5 w-5 text-primary" />
                      Continue Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">Pick up where you left off with your trading education.</p>
                      
                      <div className="text-center py-8">
                        <BookOpen className="mx-auto h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No courses in progress</h3>
                        <p className="text-muted-foreground mb-4">Purchase a course to start learning advanced trading concepts.</p>
                        <Button asChild>
                          <Link to="/products">Browse Courses</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="purchases">
            <Card>
              <CardHeader>
                <CardTitle>Your Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Download className="mx-auto h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No purchases yet</h3>
                  <p className="text-muted-foreground mb-4">Your purchased digital products will appear here.</p>
                  <Button asChild>
                    <Link to="/products">Browse Products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookmarks">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bookmark className="mx-auto h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
                  <p className="text-muted-foreground mb-4">Save your favorite products and courses for easy access.</p>
                  <Button asChild>
                    <Link to="/products">Browse Products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">{user?.email?.split('@')[0] || 'Trader'}</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <p className="text-sm text-muted-foreground mt-1">Member since {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Personal Information</h4>
                      <p className="text-muted-foreground text-sm">Complete your profile to personalize your experience.</p>
                      <Button variant="outline" className="mt-4">Edit Profile</Button>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Account Settings</h4>
                      <p className="text-muted-foreground text-sm">Manage your account preferences and security.</p>
                      <Button variant="outline" className="mt-4">Account Settings</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
