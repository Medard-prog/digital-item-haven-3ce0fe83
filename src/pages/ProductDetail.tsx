
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  
  const product = state.products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you are looking for does not exist.</p>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        quantity: 1
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/products" className="inline-flex items-center mb-6 text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-lg overflow-hidden bg-secondary/30">
          <img 
            src={product.image || '/placeholder.svg'} 
            alt={product.title} 
            className="w-full h-auto object-cover aspect-[4/3]" 
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <div className="text-2xl font-semibold text-primary mb-4">
            ${product.price.toFixed(2)}
          </div>
          
          <Separator className="my-6" />
          
          <div className="prose max-w-none mb-6">
            <p>{product.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1">
              {product.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              )) || <li>Digital product with instant access</li>}
            </ul>
          </div>
          
          <Button 
            size="lg" 
            className="w-full sm:w-auto" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
