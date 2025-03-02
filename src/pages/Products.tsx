
import React, { useEffect, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
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

// Define Product type
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  featured?: boolean;
  categories?: string[];
  features?: string[];
  variants?: Array<{id: string; name: string; price: number}>;
}

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  
  // Fetch products from Supabase
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching products from database... (attempt ${retryCount + 1})`);
      
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      console.log(`Products fetched: ${productsData?.length || 0}`);

      if (!productsData || productsData.length === 0) {
        setProducts([]);
        setFilteredProducts([]);
        setCategories([]);
        setIsLoading(false);
        return;
      }

      // Fetch additional data in separate queries
      const { data: featuresData } = await supabase
        .from('product_features')
        .select('*');
        
      const { data: variantsData } = await supabase
        .from('product_variants')
        .select('*');
        
      const { data: categoriesMapData } = await supabase
        .from('product_category_map')
        .select('*, product_categories(*)');

      console.log(`Features fetched: ${featuresData?.length || 0}`);
      console.log(`Variants fetched: ${variantsData?.length || 0}`);
      console.log(`Categories fetched: ${categoriesMapData?.length || 0}`);

      // Map features and variants to their respective products
      const featuresMap = new Map();
      const variantsMap = new Map();
      const categoriesMap = new Map();
      
      // Process features
      if (featuresData) {
        featuresData.forEach((feature: any) => {
          if (!featuresMap.has(feature.product_id)) {
            featuresMap.set(feature.product_id, []);
          }
          featuresMap.get(feature.product_id).push(feature.feature);
        });
      }
      
      // Process variants
      if (variantsData) {
        variantsData.forEach((variant: any) => {
          if (!variantsMap.has(variant.product_id)) {
            variantsMap.set(variant.product_id, []);
          }
          variantsMap.get(variant.product_id).push({
            id: variant.id,
            name: variant.name,
            price: variant.price
          });
        });
      }
      
      // Process categories
      if (categoriesMapData) {
        categoriesMapData.forEach((categoryMap: any) => {
          if (!categoriesMap.has(categoryMap.product_id)) {
            categoriesMap.set(categoryMap.product_id, []);
          }
          if (categoryMap.product_categories && categoryMap.product_categories.name) {
            categoriesMap.get(categoryMap.product_id).push(categoryMap.product_categories.name);
          }
        });
      }

      // Transform Supabase data to match our Product type
      const formattedProducts: Product[] = productsData.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image_url,
        featured: product.featured,
        features: featuresMap.get(product.id) || [],
        categories: categoriesMap.get(product.id) || [],
        variants: variantsMap.get(product.id) || []
      }));

      console.log(`Formatted products: ${formattedProducts.length}`);

      // Get all unique categories
      const allCategories = Array.from(new Set(
        formattedProducts.flatMap(product => product.categories || [])
      )).sort();

      setCategories(allCategories);
      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);

    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      toast({
        variant: "destructive",
        title: "Error loading products",
        description: err.message
      });
      
      // If we failed, but have a reasonable retry count, try again
      if (retryCount < 3) {
        console.log(`Retrying in 1 second... (${retryCount + 1}/3)`);
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchProducts();
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and when retry count changes
  useEffect(() => {
    fetchProducts();
  }, [retryCount]);
  
  // Check for category in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [location.search]);
  
  // Filter products based on search term and selected categories
  useEffect(() => {
    if (!isLoading) {
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

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  if (error && retryCount >= 3) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container px-4 mx-auto text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Products</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => {
              setRetryCount(0);
              fetchProducts();
            }}>Try Again</Button>
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
              {/* Desktop Sidebar Filters */}
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
              
              {/* Product Grid */}
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
