
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
      });
    }
  };
  
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/admin/products', label: 'Products', icon: <Package className="h-5 w-5" /> },
    { path: '/admin/orders', label: 'Orders', icon: <ShoppingCart className="h-5 w-5" /> },
    { path: '/admin/customers', label: 'Customers', icon: <Users className="h-5 w-5" /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-primary">Admin</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
                  `}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full flex items-center justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Admin</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h1 className="text-xl font-bold text-primary">Admin</h1>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="py-4">
              <ul className="space-y-2 px-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`
                        flex items-center px-4 py-3 rounded-lg transition-colors
                        ${isActive(item.path) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
                      `}
                      onClick={() => setOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                className="w-full flex items-center justify-start"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
