
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Download, 
  Check,
  Star, 
  Shield, 
  Zap,
  Award, 
  Clock, 
  Languages
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [languageVariants, setLanguageVariants] = useState([
    { id: "en", name: "English", available: true },
    { id: "es", name: "Spanish", available: true },
    { id: "fr", name: "French", available: false },
    { id: "de", name: "German", available: true }
  ]);
  
  const product = state.products.find(p => p.id === id);
  
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0].id);
    }
  }, [product]);
  
  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="content-container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you are looking for does not exist.</p>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        quantity: quantity,
        variantId: selectedVariant || undefined
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="content-container py-12">
          <Link to="/products" className="inline-flex items-center mb-8 text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
          
          <motion.div 
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Product Image Section */}
            <motion.div variants={itemAnimation} className="relative">
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md aspect-[4/3] flex items-center justify-center">
                <img 
                  src={product.image || '/placeholder.svg'} 
                  alt={product.title} 
                  className="w-full h-auto object-cover" 
                />
                <div className="absolute top-4 right-4 bg-primary text-white text-sm font-medium py-1 px-3 rounded-full">
                  Digital Product
                </div>
              </div>
              
              <div className="mt-8 glass-card p-4">
                <div className="flex items-center mb-4">
                  <Download className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">Digital Delivery</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">Instant delivery to your email</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">Lifetime access to all updates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">Access on all devices</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Product Details Section */}
            <motion.div variants={itemAnimation} className="flex flex-col">
              <div>
                <div className="flex items-center mb-2">
                  <div className="flex text-amber-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(5.0 from 36 reviews)</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">{product.title}</h1>
                
                <div className="flex items-center mb-6">
                  <div className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="ml-3 text-lg text-muted-foreground line-through">
                    ${(product.price * 2).toFixed(2)}
                  </div>
                  <div className="ml-3 text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
                    50% OFF
                  </div>
                </div>
                
                <div className="prose max-w-none dark:prose-invert mb-8">
                  <p className="text-lg">{product.description}</p>
                </div>
                
                {/* Language Variants with shadcn Select */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Languages className="mr-2 h-5 w-5 text-primary" />
                    Available Languages
                  </h3>
                  
                  <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {languageVariants.map((variant) => (
                          variant.available ? (
                            <SelectItem key={variant.id} value={variant.id}>
                              {variant.name}
                            </SelectItem>
                          ) : (
                            <SelectItem key={variant.id} value={variant.id} disabled>
                              {variant.name} (Coming Soon)
                            </SelectItem>
                          )
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator className="my-6" />
                
                {/* Add to Cart */}
                <div className="space-y-6 mb-8">
                  <Button 
                    size="lg" 
                    className="w-full py-6 text-lg" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Secure checkout with Stripe</span>
                  </div>
                </div>
              </div>
              
              {/* Key Benefits */}
              <div className="glass-card p-6 mt-auto">
                <h3 className="font-medium mb-4">Why Choose This Resource:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Zap className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Instant application to your trading</span>
                  </div>
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Created by professional traders</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">24/7 support available</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Satisfaction guaranteed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="features">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="mt-6">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-4">What's Included:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features?.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    )) || (
                      <div className="col-span-2">
                        <p>No specific features listed for this product.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-6">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-4">Product Details:</h3>
                  <div className="space-y-4">
                    <p>
                      This comprehensive digital resource is designed to help traders master the intricacies of market structure and price action. Whether you're a beginner or experienced trader, this material offers valuable insights into how institutional traders operate in the markets.
                    </p>
                    <p>
                      All materials are delivered digitally, allowing for instant access across all your devices. Updates are provided free of charge for the lifetime of the product.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      <div>
                        <h4 className="font-medium text-sm">Format</h4>
                        <p className="text-muted-foreground">Digital Download (PDF, Video)</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Pages</h4>
                        <p className="text-muted-foreground">146 pages of content</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Last Updated</h4>
                        <p className="text-muted-foreground">January 2023</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Languages</h4>
                        <p className="text-muted-foreground">English, Spanish, German</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Support</h4>
                        <p className="text-muted-foreground">Email, Discord Community</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Access</h4>
                        <p className="text-muted-foreground">Lifetime (including updates)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Customer Reviews:</h3>
                    <Button>Write a Review</Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex text-amber-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">Incredible Resource</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        By Alex Morgan • August 15, 2023
                      </div>
                      <p>
                        This is exactly what I needed to take my trading to the next level. The way market structure is explained has helped me identify high probability setups I was missing before. Highly recommend!
                      </p>
                    </div>
                    
                    <div className="border-b pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex text-amber-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">Game Changer</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        By Sarah Johnson • July 23, 2023
                      </div>
                      <p>
                        I've been trading for years, but the concepts in this material have completely changed my approach. The section on order blocks and breaker blocks alone was worth the price. I'm now consistently finding better entries and exits.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="flex text-amber-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">Worth Every Penny</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        By Michael Chen • June 10, 2023
                      </div>
                      <p>
                        The content is presented in a clear, concise manner that's easy to understand and implement. I particularly appreciated the examples using real market conditions. After applying these strategies, my win rate has improved significantly.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-6">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-4">Frequently Asked Questions:</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Is this suitable for beginners?</h4>
                      <p className="text-muted-foreground">
                        While some basic trading knowledge is helpful, we've designed this material to be accessible to traders of all levels. Beginners will find a solid foundation, while experienced traders will discover advanced techniques to enhance their strategies.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">How will I receive the product after purchase?</h4>
                      <p className="text-muted-foreground">
                        Immediately after your purchase is confirmed, you'll receive an email with download instructions and access links. You can access the material on any device with an internet connection.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                      <p className="text-muted-foreground">
                        Due to the digital nature of this product, we generally don't offer refunds. However, if you're experiencing technical issues or have concerns about the content, please contact our support team, and we'll be happy to assist you.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">How often is the content updated?</h4>
                      <p className="text-muted-foreground">
                        We typically update our materials quarterly to ensure they reflect current market conditions and trading strategies. As a customer, you'll receive lifetime access to all updates at no additional cost.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {state.products.filter(p => p.id !== product.id).slice(0, 4).map(relatedProduct => (
                <Link 
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="glass-card overflow-hidden flex flex-col transition-all hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={relatedProduct.image || '/placeholder.svg'} 
                      alt={relatedProduct.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-medium mb-1 line-clamp-1">{relatedProduct.title}</h3>
                    <div className="flex items-center mt-auto">
                      <div className="font-bold text-primary">${relatedProduct.price.toFixed(2)}</div>
                      <div className="ml-2 text-sm text-muted-foreground line-through">${(relatedProduct.price * 2).toFixed(2)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
