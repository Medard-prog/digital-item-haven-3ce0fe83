
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define types
export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  description?: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  categories: string[];
  variants: ProductVariant[];
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
};

type State = {
  products: Product[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_CART'; payload: { product: Product; variantId: string; quantity: number } }
  | { type: 'UPDATE_CART_ITEM'; payload: { productId: string; variantId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; variantId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

const initialState: State = {
  products: [],
  cart: [],
  loading: false,
  error: null,
};

// Sample product data
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'SMC Trading Fundamentals',
    slug: 'smc-trading-fundamentals',
    description: 'Learn the core concepts of Smart Money Concepts trading with this comprehensive guide.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500',
    featured: true,
    categories: ['SMC', 'Fundamentals'],
    variants: [
      { id: 'v1', name: 'Basic Edition', price: 49.99 },
      { id: 'v2', name: 'Premium Edition', price: 79.99, description: 'Includes additional case studies' },
      { id: 'v3', name: 'Complete Package', price: 129.99, description: 'Includes video tutorials and templates' }
    ]
  },
  {
    id: '2',
    title: 'ICT Strategy Blueprint',
    slug: 'ict-strategy-blueprint',
    description: 'Master Inner Circle Trader strategies with this detailed blueprint guide.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500',
    featured: true,
    categories: ['ICT', 'Strategy'],
    variants: [
      { id: 'v1', name: 'Standard Edition', price: 69.99 },
      { id: 'v2', name: 'Extended Edition', price: 99.99, description: 'Includes market analysis tools' }
    ]
  },
  {
    id: '3',
    title: 'Advanced Price Action Analysis',
    slug: 'advanced-price-action-analysis',
    description: 'Take your trading to the next level with advanced price action techniques.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=500',
    featured: false,
    categories: ['Price Action', 'Advanced'],
    variants: [
      { id: 'v1', name: 'Digital PDF', price: 59.99 },
      { id: 'v2', name: 'PDF + Cheat Sheets', price: 74.99, description: 'Includes printable reference sheets' }
    ]
  },
  {
    id: '4',
    title: 'SMC & ICT Combined Methods',
    slug: 'smc-ict-combined-methods',
    description: 'The ultimate guide that integrates SMC and ICT methodologies for a comprehensive trading approach.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500',
    featured: true,
    categories: ['SMC', 'ICT', 'Combined'],
    variants: [
      { id: 'v1', name: 'Basic Edition', price: 89.99 },
      { id: 'v2', name: 'Deluxe Edition', price: 129.99, description: 'Includes lifetime updates' }
    ]
  },
  {
    id: '5',
    title: 'Risk Management Mastery',
    slug: 'risk-management-mastery',
    description: 'Learn essential risk management techniques required for consistent trading success.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=500',
    featured: false,
    categories: ['Risk Management'],
    variants: [
      { id: 'v1', name: 'Standard Edition', price: 39.99 },
      { id: 'v2', name: 'Extended Edition', price: 59.99, description: 'Includes position sizing calculator' }
    ]
  },
  {
    id: '6',
    title: 'Order Flow Trading Secrets',
    slug: 'order-flow-trading-secrets',
    description: 'Uncover the hidden dynamics of market order flow to anticipate price movements.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1612010167108-3e6b327405f0?q=80&w=500',
    featured: true,
    categories: ['Order Flow', 'Advanced'],
    variants: [
      { id: 'v1', name: 'Basic Guide', price: 79.99 },
      { id: 'v2', name: 'Complete Guide', price: 119.99, description: 'Includes DOM trading techniques' }
    ]
  }
];

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const storeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
      
    case 'ADD_TO_CART': {
      const { product, variantId, quantity } = action.payload;
      const variant = product.variants.find(v => v.id === variantId);
      
      if (!variant) return state;
      
      const existingItemIndex = state.cart.findIndex(
        item => item.productId === product.id && item.variantId === variantId
      );
      
      if (existingItemIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return { ...state, cart: updatedCart };
      }
      
      return {
        ...state,
        cart: [...state.cart, { productId: product.id, variantId, quantity, product, variant }]
      };
    }
    
    case 'UPDATE_CART_ITEM': {
      const { productId, variantId, quantity } = action.payload;
      const updatedCart = state.cart.map(item => {
        if (item.productId === productId && item.variantId === variantId) {
          return { ...item, quantity };
        }
        return item;
      });
      return { ...state, cart: updatedCart };
    }
    
    case 'REMOVE_FROM_CART': {
      const { productId, variantId } = action.payload;
      const updatedCart = state.cart.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      );
      return { ...state, cart: updatedCart };
    }
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
      
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    default:
      return state;
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        parsedCart.forEach(item => {
          const product = sampleProducts.find(p => p.id === item.productId);
          if (product) {
            dispatch({
              type: 'ADD_TO_CART',
              payload: {
                product,
                variantId: item.variantId,
                quantity: item.quantity
              }
            });
          }
        });
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
    
    // Load initial products (In a real app, this would be an API call)
    dispatch({ type: 'SET_PRODUCTS', payload: sampleProducts });
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);
  
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
