
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore, formatCurrency } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Star,
  Check,
  ArrowLeft,
  ShoppingCart,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  Globe
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from '@/integrations/supabase/client';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [availableLanguages, setAvailableLanguages] = useState<any[]>([]);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (productError) throw productError;
        
        // Fetch product features
        const { data: featuresData, error: featuresError } = await supabase
          .from('product_features')
          .select('*')
          .eq('product_id', id)
          .order('order_number', { ascending: true });
        
        if (featuresError) throw featuresError;
        
        // Fetch product language variants
        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', id);
        
        if (variantsError) throw variantsError;
        
        // Set product data
        setProduct(productData);
        
        // Set features
        setFeatures(featuresData.map((f: any) => f.feature));
        
        // Set languages
        const langs = variantsData.map((v: any) => ({
          value: v.name,
          label: v.name.charAt(0).toUpperCase() + v.name.slice(1),
          flag: `/flags/${v.name === 'english' ? 'gb' : v.name.substring(0, 2)}.svg`
        }));
        
        // If no language variants, default to English
        if (langs.length === 0) {
          setAvailableLanguages([{
            value: 'english',
            label: 'English',
            flag: '/flags/gb.svg'
          }]);
        } else {
          setAvailableLanguages(langs);
        }
        
        // Generate mock additional images for carousel
        // In a real app, these would come from the database
        if (productData.image_url) {
          const mockImages = [
            productData.image_url,
            '/placeholder.svg',
            '/placeholder.svg'
          ];
          setAdditionalImages(mockImages);
        } else {
          setAdditionalImages(['/placeholder.svg']);
        }
        
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: { 
          id: product.id, 
          quantity,
          variantId: selectedLanguage
        }
      });
      
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`
      });
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Mock frequently asked questions
  const faqs = [
    {
      question: "How is this product delivered?",
      answer: "This is a digital product delivered instantly to your email after purchase. You'll also have access to download it from your account dashboard."
    },
    {
      question: "Do I get lifetime access?",
      answer: "Yes! Once purchased, you get lifetime access to the product and all future updates."
    },
    {
      question: "Is there 24/7 support available?",
      answer: "Yes, we provide 24/7 support via Discord and Telegram. Join our community for immediate assistance with your questions."
    },
    {
      question: "Can I use this on multiple devices?",
      answer: "Yes, you can access and download your purchase on any device. We have no device limits."
    }
  ];
  
  // Mock reviews
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      date: "2023-09-12",
      review: "This course completely changed my approach to trading. The Smart Money Concepts taught here have helped me identify high-probability setups I was missing before."
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      rating: 5,
      date: "2023-08-28",
      review: "The content is incredibly well structured and easy to follow. I've been trading for years but these insights have taken my analysis to a new level."
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 4,
      date: "2023-10-05",
      review: "Very comprehensive material on institutional order flow. Would have given 5 stars but would like to see more practical examples."
    }
  ];
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading product information...</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the product you're looking for. It may have been removed or the URL might be incorrect.
          </p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="pl-0">
              <Link to="/products" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images - Left */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md relative glass-morphism">
                <Carousel>
                  <CarouselContent>
                    {additionalImages.map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={src} 
                            alt={`${product.title} - image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
                
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Digital Product
                </div>
              </div>
              
              {/* Thumbnail navigation (for larger screens) */}
              <div className="mt-4 hidden md:grid grid-cols-4 gap-2">
                {additionalImages.map((src, index) => (
                  <div 
                    key={index}
                    className={`aspect-video rounded-md overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-transparent'} cursor-pointer hover:opacity-80 transition-all`}
                  >
                    <img 
                      src={src} 
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Product Description and Details - Right */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-muted-foreground">(32 reviews)</span>
                    <button 
                      onClick={scrollToReviews}
                      className="text-primary underline text-sm ml-2"
                    >
                      See all reviews
                    </button>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg mb-6 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Multiple Languages</h3>
                      <p className="text-sm text-muted-foreground">
                        Available in {availableLanguages.length} languages
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">24/7 Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Discord and Telegram support
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">What You'll Learn</h2>
                  
                  <ul className="space-y-3">
                    {features.length > 0 ? (
                      features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Understand market structure and how to identify it</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Master the art of identifying smart money levels</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Learn to spot and trade with Order Blocks</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Identify liquidity pools and how banks target them</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Develop an institutional trader's mindset</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h2 className="text-xl font-bold">Select Options</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="language" className="block text-sm font-medium">
                        Language
                      </label>
                      <Select
                        value={selectedLanguage}
                        onValueChange={setSelectedLanguage}
                      >
                        <SelectTrigger id="language" className="w-full">
                          <SelectValue placeholder="Select language">
                            <div className="flex items-center">
                              {availableLanguages.find(l => l.value === selectedLanguage)?.label || 'Select language'}
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {availableLanguages.map((language) => (
                            <SelectItem key={language.value} value={language.value}>
                              <div className="flex items-center">
                                <img src={language.flag} alt={language.label} className="w-4 h-4 mr-2" />
                                <span>{language.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="quantity" className="block text-sm font-medium">
                        Quantity
                      </label>
                      <div className="flex h-10 w-full rounded-md border border-input bg-background">
                        <button
                          type="button"
                          className="flex items-center justify-center h-full aspect-square border-r border-input"
                          onClick={decrementQuantity}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="flex-1 flex items-center justify-center font-medium">
                          {quantity}
                        </div>
                        <button
                          type="button"
                          className="flex items-center justify-center h-full aspect-square border-l border-input"
                          onClick={incrementQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="text-3xl font-bold">{formatCurrency(product.price)}</div>
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex gap-4 mt-4">
                      <Button variant="outline" size="sm" className="h-8 gap-2">
                        <svg className="h-4 w-4" viewBox="0 0 127.14 96.36">
                          <path
                            d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                            fill="currentColor"
                          />
                        </svg>
                        Discord Support
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-2">
                        <img src="/icons/telegram.svg" alt="Telegram" className="h-4 w-4" />
                        Telegram Support
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Full width sections */}
          <div className="space-y-12">
            {/* FAQs */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md glass-morphism"
            >
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
            
            {/* Reviews */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md glass-morphism" 
              ref={reviewsRef}
            >
              <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start">
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <h4 className="font-medium">{review.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm">{review.review}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
