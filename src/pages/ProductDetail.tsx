
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
  Download,
  BookOpen,
  ArrowLeft,
  ShoppingCart,
  AlertTriangle,
  Shield,
  Zap,
  Globe,
  Users
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const reviewsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulate API call to fetch product
    setTimeout(() => {
      const foundProduct = state.products.find(p => p.id === id);
      setProduct(foundProduct || null);
      setLoading(false);
    }, 500);
  }, [id, state.products]);
  
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
  
  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Available languages with flags
  const languages = [
    { value: 'english', label: 'English', flag: '🇬🇧' },
    { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
    { value: 'french', label: 'French', flag: '🇫🇷' },
    { value: 'german', label: 'German', flag: '🇩🇪' },
    { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
    { value: 'chinese', label: 'Chinese', flag: '🇨🇳' }
  ];
  
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
      question: "Is there a money-back guarantee?",
      answer: "Yes, we offer a 30-day satisfaction guarantee. If you're not happy with the product, contact us for a full refund."
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
        <div className="content-container">
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/products" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Product Image and Details - 3 cols */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-3 space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md relative glass-morphism">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={product.image || '/placeholder.svg'} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                  />
                </div>
                
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Digital Product
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md space-y-6 glass-morphism">
                <div>
                  <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                  
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
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg mb-6 leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                          <Download className="h-5 w-5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">Instant Digital Delivery</h3>
                          <p className="text-sm text-muted-foreground">
                            Immediate access after purchase
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">Comprehensive Material</h3>
                          <p className="text-sm text-muted-foreground">
                            Detailed guide with examples
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">Multiple Languages</h3>
                          <p className="text-sm text-muted-foreground">
                            Available in 6 languages
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">Community Support</h3>
                          <p className="text-sm text-muted-foreground">
                            Join our Discord and Telegram
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">What You'll Learn</h2>
                  
                  <ul className="space-y-3">
                    {product.features?.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    
                    {!product.features || product.features.length === 0 ? (
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
                    ) : null}
                  </ul>
                </div>
              </div>
              
              {/* FAQs */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md glass-morphism">
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
              </div>
              
              {/* Reviews */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md glass-morphism" ref={reviewsRef}>
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
              </div>
            </motion.div>
            
            {/* Purchase Box - 2 cols */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md sticky top-6 glass-morphism">
                <div className="space-y-6">
                  <div className="flex justify-between items-baseline">
                    <div className="text-3xl font-bold">{formatCurrency(product.price)}</div>
                    <div className="text-sm text-muted-foreground">Digital Product</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="language" className="block text-sm font-medium">
                        Select Language
                      </label>
                      <Select
                        value={selectedLanguage}
                        onValueChange={setSelectedLanguage}
                      >
                        <SelectTrigger id="language" className="w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.value} value={language.value} className="flex items-center">
                              <span className="mr-2">{language.flag}</span>
                              <span>{language.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="quantity" className="block text-sm font-medium">
                        Quantity
                      </label>
                      <select
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>Instant digital delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Secure payment & 30-day guarantee</span>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg mt-4 border border-primary/10">
                    <h3 className="font-bold text-sm">🔥 LIMITED TIME OFFER</h3>
                    <p className="text-sm mt-1">
                      50% discount applied automatically at checkout. Hurry, offer ends soon!
                    </p>
                  </div>
                </div>
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
