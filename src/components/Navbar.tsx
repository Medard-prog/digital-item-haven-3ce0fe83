
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/lib/store';
import { 
  GanttChartSquare, 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ShoppingBag,
  Heart, 
  BadgeHelp,
  ChevronDown
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { state } = useStore();
  const { user, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  
  const cartItemsCount = state.cart.items.reduce(
    (total, item) => total + item.quantity, 
    0
  );
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : 'U';
  
  return (
    <>
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo-smc.png" alt="SMCInsider" className="h-9 w-auto" />
                <span className="hidden sm:inline-block font-bold text-xl bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  SMCInsider
                </span>
              </Link>
              
              {/* Desktop Nav Links */}
              <nav className="hidden md:flex ml-10 space-x-6">
                <Link 
                  to="/" 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium relative px-1 py-2 group"
                >
                  Home
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
                </Link>
                <Link 
                  to="/products" 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium relative px-1 py-2 group"
                >
                  Products
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium relative px-1 py-2 group flex items-center">
                      Resources
                      <ChevronDown className="ml-1 h-4 w-4" />
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="glass-card">
                    <DropdownMenuItem>
                      <Link to="/products?category=SMC" className="flex w-full">
                        SMC Trading
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/products?category=ICT" className="flex w-full">
                        ICT Methodology
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/products?category=Advanced" className="flex w-full">
                        Advanced Strategies
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/products?category=Psychology" className="flex w-full">
                        Trading Psychology
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium relative px-1 py-2 group flex items-center">
                      Support
                      <ChevronDown className="ml-1 h-4 w-4" />
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="glass-card">
                    <DropdownMenuItem>
                      <a href="https://discord.gg/smcinsider" className="flex w-full items-center" target="_blank" rel="noopener noreferrer">
                        <img src="/icons/discord.svg" alt="Discord" className="h-4 w-4 mr-2" />
                        Discord Support
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href="https://t.me/smcinsider" className="flex w-full items-center" target="_blank" rel="noopener noreferrer">
                        <img src="/icons/telegram.svg" alt="Telegram" className="h-4 w-4 mr-2" />
                        Telegram Support
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Cart Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative" 
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
              
              {/* Auth Button */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                        <AvatarFallback className="bg-primary text-white">{userInitials}</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline-block">Dashboard</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex w-full">
                            <GanttChartSquare className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/favorites" className="flex w-full">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login">Authenticate</Link>
                  </Button>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-white dark:bg-gray-900 pt-16 animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-lg font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-lg font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={closeMenu}
            >
              Products
            </Link>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Resources</p>
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/products?category=SMC" 
                  className="pl-2 text-gray-700 dark:text-gray-300" 
                  onClick={closeMenu}
                >
                  SMC Trading
                </Link>
                <Link 
                  to="/products?category=ICT" 
                  className="pl-2 text-gray-700 dark:text-gray-300" 
                  onClick={closeMenu}
                >
                  ICT Methodology
                </Link>
                <Link 
                  to="/products?category=Advanced" 
                  className="pl-2 text-gray-700 dark:text-gray-300" 
                  onClick={closeMenu}
                >
                  Advanced Strategies
                </Link>
                <Link 
                  to="/products?category=Psychology" 
                  className="pl-2 text-gray-700 dark:text-gray-300" 
                  onClick={closeMenu}
                >
                  Trading Psychology
                </Link>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Support (24/7)</p>
              <div className="flex flex-col space-y-2">
                <a 
                  href="https://discord.gg/smcinsider" 
                  className="pl-2 text-gray-700 dark:text-gray-300 flex items-center" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img src="/icons/discord.svg" alt="Discord" className="h-4 w-4 mr-2" />
                  Discord Support
                </a>
                <a 
                  href="https://t.me/smcinsider" 
                  className="pl-2 text-gray-700 dark:text-gray-300 flex items-center" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img src="/icons/telegram.svg" alt="Telegram" className="h-4 w-4 mr-2" />
                  Telegram Support
                </a>
              </div>
            </div>
            
            {/* Mobile Auth */}
            {!user ? (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-2">
                <Button asChild>
                  <Link to="/login" onClick={closeMenu}>Authenticate</Link>
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Account</p>
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/dashboard" 
                    className="pl-2 text-gray-700 dark:text-gray-300 flex items-center" 
                    onClick={closeMenu}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="pl-2 text-gray-700 dark:text-gray-300 flex items-center" 
                    onClick={closeMenu}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="pl-2 text-gray-700 dark:text-gray-300 flex items-center" 
                    onClick={closeMenu}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Link>
                </div>
              </div>
            )}
            
            {/* Admin Links (Mobile) */}
            {user && isAdmin && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Admin</p>
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/admin" 
                    className="pl-2 text-gray-700 dark:text-gray-300 flex items-center" 
                    onClick={closeMenu}
                  >
                    <GanttChartSquare className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/products" 
                    className="pl-2 text-gray-700 dark:text-gray-300 flex items-center" 
                    onClick={closeMenu}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Manage Products
                  </Link>
                  <Link 
                    to="/admin/orders" 
                    className="pl-2 text-gray-700 dark:text-gray-300 flex items-center" 
                    onClick={closeMenu}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Manage Orders
                  </Link>
                </div>
              </div>
            )}
            
            {/* Logout (Mobile) */}
            {user && (
              <div className="pt-4 mt-auto border-t border-gray-200 dark:border-gray-800">
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
