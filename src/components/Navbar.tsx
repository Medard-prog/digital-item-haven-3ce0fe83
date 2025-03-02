import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LogIn,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShoppingBag,
  Sun,
  User,
  UserPlus,
  Shield
} from 'lucide-react';

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { state } = useStore();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : 'U';

  // Update userMenuItems to include icons property
  const userMenuItems = user ? [
    { href: '/dashboard', label: 'Dashboard', icon: <User className="h-4 w-4 mr-2" /> },
    { href: '/profile', label: 'Profile', icon: <Settings className="h-4 w-4 mr-2" /> },
    { href: '/purchases', label: 'My Orders', icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
    { 
      href: '#', 
      label: 'Logout', 
      icon: <LogOut className="h-4 w-4 mr-2" />,
      onClick: async () => {
        try {
          await signOut();
          toast({
            title: "Logged out successfully"
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error logging out",
            description: "Please try again"
          });
        }
      }
    }
  ] : [
    { href: '/login', label: 'Login', icon: <LogIn className="h-4 w-4 mr-2" /> },
    { href: '/register', label: 'Sign Up', icon: <UserPlus className="h-4 w-4 mr-2" /> }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="font-bold text-xl text-gray-800 dark:text-white">
                Trading<span>Resources</span>
              </span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/products"
                  className={`${
                    pathname === '/products'
                      ? 'text-primary font-medium dark:text-primary'
                      : 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  Products
                </Link>
                {isAdmin && (
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className={`${
                        pathname.startsWith('/admin')
                          ? 'text-primary font-medium dark:text-primary'
                          : 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                      } transition-colors duration-200 flex items-center px-4 py-2`}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </li>
                )}
                <Link
                  to="/about"
                  className={`${
                    pathname === '/about'
                      ? 'text-primary font-medium dark:text-primary'
                      : 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`${
                    pathname === '/contact'
                      ? 'text-primary font-medium dark:text-primary'
                      : 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt={user?.email} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {isAdmin ? 'Administrator' : 'User'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item, index) => (
                      <DropdownMenuItem key={index} onClick={item.onClick ? item.onClick : undefined} >
                        <Link to={item.href} className="w-full flex items-center">
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SheetHeader className="pl-6 pr-8">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate the application
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <Link
                    to="/products"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    Products
                  </Link>
                  <Link
                    to="/about"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    Contact
                  </Link>
                  {user ? (
                    <>
                      {userMenuItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.href}
                          className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                          onClick={item.onClick ? item.onClick : undefined}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
