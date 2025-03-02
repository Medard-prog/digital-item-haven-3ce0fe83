import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { state } = useStore();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Calculate total items in cart
  const cartItemsCount = state.cart.items.reduce((total, item) => total + item.quantity, 0);
  
  // Update navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="text-xl font-semibold tracking-tight transition-colors"
          >
            TradingEdge
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                location.pathname === '/' && 'text-primary'
              )}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                location.pathname === '/products' && 'text-primary'
              )}
            >
              All Products
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                Categories <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/products?category=SMC" className="cursor-pointer">SMC</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products?category=ICT" className="cursor-pointer">ICT</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products?category=Advanced" className="cursor-pointer">Advanced</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through our digital trading resources
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <Link 
                  to="/" 
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">Categories</h3>
                  <div className="space-y-2 pl-4">
                    <Link 
                      to="/products?category=SMC" 
                      className="block text-sm transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      SMC
                    </Link>
                    <Link 
                      to="/products?category=ICT" 
                      className="block text-sm transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ICT
                    </Link>
                    <Link 
                      to="/products?category=Advanced" 
                      className="block text-sm transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Advanced
                    </Link>
                  </div>
                </div>
                <div className="pt-4">
                  <Link 
                    to="/admin" 
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
