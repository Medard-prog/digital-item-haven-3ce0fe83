
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, BookOpen, ShoppingCart, Search, FileText } from 'lucide-react';

const Purchases = () => {
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
          <h1 className="text-3xl font-bold font-display mb-2">Your Purchases</h1>
          <p className="text-muted-foreground">Access your digital products and course materials</p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Purchases</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="order-history">Order History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <Download className="mx-auto h-20 w-20 text-muted-foreground opacity-30" />
                </div>
                <h3 className="text-xl font-medium mb-3">No purchases yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You haven't purchased any digital trading resources yet. Browse our collection of premium SMC and ICT resources.
                </p>
                <Button asChild>
                  <Link to="/products">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Browse Products
                  </Link>
                </Button>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-20 w-20 text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-xl font-medium mb-2">No courses purchased</h3>
              <p className="text-muted-foreground mb-6">Your purchased courses will appear here.</p>
              <Button asChild>
                <Link to="/products">Browse Courses</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="materials">
            <div className="text-center py-16">
              <FileText className="mx-auto h-20 w-20 text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-xl font-medium mb-2">No materials purchased</h3>
              <p className="text-muted-foreground mb-6">Your purchased trading materials will appear here.</p>
              <Button asChild>
                <Link to="/products">Browse Materials</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="order-history">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Search className="mx-auto h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No order history</h3>
                  <p className="text-muted-foreground mb-4">Your order history will be displayed here once you make a purchase.</p>
                  <Button asChild>
                    <Link to="/products">Start Shopping</Link>
                  </Button>
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

export default Purchases;
