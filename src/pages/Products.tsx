import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Loader2, 
  Filter, 
  ShoppingCart,
  AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  featured?: boolean;
  categories?: string[];
  features?: string[];
  variants?: Array<{id: string; name: string; price?: number}>;
}

const fetchProductsData = async () => {
  console.log("Fetching products from database...");
  
  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    if (!productsData || productsData.length === 0) {
      console.log('No products found in the database');
      return {
        products: [],
        categories: []
      };
    }

    const [featuresResponse, variantsResponse, categoriesResponse, categoryMapResponse] = await Promise.all([
      supabase.from('product_features').select('*'),
      supabase.from('product_variants').select('*'),
      supabase.from('product_categories').select('*'),
      supabase.from('product_category_map').select('*')
    ]);

    if (featuresResponse.error) console.error('Error fetching features:', featuresResponse.error);
    if (variantsResponse.error) console.error('Error fetching variants:', variantsResponse.error);
    if (categoriesResponse.error) console.error('Error fetching categories:', categoriesResponse.error);
    if (categoryMapResponse.error) console.error('Error fetching category mappings:', categoryMapResponse.error);

    const enhancedProducts = productsData.map(product => {
      const productFeatures = featuresResponse.data
        ? featuresResponse.data.filter(f => f.product_id === product.id).map(f => f.feature)
        : [];
      
      const productVariants = variantsResponse.data
        ? variantsResponse.data.filter(v => v.product_id === product.id).map(v => ({
            id: v.id,
            name: v.name,
            price: v.price
          }))
        : [];
      
      const productCategoryIds = categoryMapResponse.data
        ? categoryMapResponse.data.filter(cm => cm.product_id === product.id).map(cm => cm.category_id)
        : [];
      
      const productCategories = categoriesResponse.data
        ? productCategoryIds.map(id => {
            const category = categoriesResponse.data.find(c => c.id === id);
            return category ? category.name : '';
          }).filter(name => name !== '')
        : [];
      
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image_url,
        featured: product.featured,
        features: productFeatures,
        categories: productCategories,
        variants: productVariants
      };
    });

    const allCategories = Array.from(new Set(
      enhancedProducts.flatMap(product => product.categories || [])
    )).sort();

    console.log(`Fetched ${enhancedProducts.length} products with ${allCategories.length} categories`);
    
    return {
      products: enhancedProducts,
      categories: allCategories
    };
  } catch (error) {
    console.error('Error in fetchProductsData:', error);
    throw error;
  }
};

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductsData,
    staleTime: 60000,
    retry: 3,
    retryDelay: 1000,
  });
  
  const products = data?.products || [];
  const categories = data?.categories || [];
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [location.search]);
  
  useEffect(() => {
    if (!isLoading && products) {
      let filtered = [...products];
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          product => 
            product.title.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term)
        );
      }
      
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(product => 
          product.categories && product.categories.some(category => selectedCategories.includes(category))
        );
      }
      
      setFilteredProducts(filtered);
    }
  }, [searchTerm, selectedCategories, products, isLoading]);
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container px-4 mx-auto text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Products</h2>
            <p className="text-muted-foreground mb-6">{(error as Error).message}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-3">Trading Resources</h1>
              <p className="text-muted-foreground max-w-3xl">
                Browse our complete collection of premium trading guides, resources, and educational materials.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex gap-2">
                <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                      {selectedCategories.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {selectedCategories.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Narrow down products by category
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <div className="space-y-5">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Categories</h3>
                            {selectedCategories.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="h-auto p-0 text-muted-foreground hover:text-foreground text-xs"
                              >
                                Clear all
                              </Button>
                            )}
                          </div>
                          <div className="mt-4 space-y-3">
                            {categories.map((category) => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`mobile-${category}`}
                                  checked={selectedCategories.includes(category)}
                                  onCheckedChange={() => handleCategoryToggle(category)}
                                />
                                <Label htmlFor={`mobile-${category}`} className="cursor-pointer">
                                  {category}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <SheetClose asChild>
                        <Button className="w-full">Apply Filters</Button>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
                
                {selectedCategories.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" /> Clear Filters
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="hidden lg:block w-60 flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Categories</h3>
                      {selectedCategories.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-auto p-0 text-muted-foreground hover:text-foreground text-xs"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    <div className="mt-4 space-y-3">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`desktop-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryToggle(category)}
                          />
                          <Label htmlFor={`desktop-${category}`} className="cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                      
                      {categories.length === 0 && !isLoading && (
                        <p className="text-sm text-muted-foreground">No categories available</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-4">Active Filters</h3>
                    {selectedCategories.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No filters applied</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map(category => (
                          <Badge 
                            key={category}
                            variant="secondary" 
                            className="flex items-center gap-1"
                          >
                            {category}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => handleCategoryToggle(category)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p className="text-muted-foreground">Loading products...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      {products.length === 0 
                        ? "There are no products in the database yet."
                        : "Try adjusting your search or filter criteria"}
                    </p>
                    {selectedCategories.length > 0 && (
                      <Button onClick={clearFilters}>Clear all filters</Button>
                    )}
                  </div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <AnimatePresence>
                      {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
