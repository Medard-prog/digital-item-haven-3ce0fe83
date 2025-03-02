
import React, { createContext, useContext, useReducer } from 'react';

// Types
export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  image?: string;
  featured?: boolean;
  features?: string[];
};

export type CartItem = {
  id: string;
  quantity: number;
  product?: Product;
};

type State = {
  products: Product[];
  cart: {
    items: CartItem[];
  };
};

type Action =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Sample products
const initialProducts: Product[] = [
  {
    id: '1',
    title: 'SMC Trading Fundamentals',
    price: 79.99,
    description: 'A comprehensive guide to Smart Money Concepts (SMC) trading fundamentals. Learn the core principles of market structure and price action.',
    image: '/placeholder.svg',
    featured: true,
    features: [
      'Understanding market structure',
      'Identifying liquidity pools',
      'Price action patterns',
      'Entry and exit strategies',
      'Risk management techniques'
    ]
  },
  {
    id: '2',
    title: 'ICT Trader\'s Guide',
    price: 69.99,
    description: 'Master Inner Circle Trader (ICT) concepts with this complete trading guide. Discover proven strategies for consistent market success.',
    image: '/placeholder.svg',
    featured: true,
    features: [
      'Market manipulation tactics',
      'Institutional order flow',
      'Kill zones and optimal trading times',
      'Order blocks and breaker blocks',
      'Fair value gaps and mitigation'
    ]
  },
  {
    id: '3',
    title: 'Advanced Market Structure Analysis',
    price: 59.99,
    description: 'Take your trading to the next level with advanced market structure analysis. Learn to identify and capitalize on high-probability trade setups.',
    image: '/placeholder.svg',
    featured: false,
    features: [
      'Advanced swing failure patterns',
      'Equal highs and lows identification',
      'Multi-timeframe analysis',
      'Volume spread analysis',
      'Wyckoff method integration'
    ]
  },
  {
    id: '4',
    title: 'Supply and Demand Mastery',
    price: 49.99,
    description: 'Discover the secrets of supply and demand zones in financial markets. Learn how to identify and trade these institutional levels like a pro.',
    image: '/placeholder.svg',
    featured: false,
    features: [
      'Identifying valid supply and demand zones',
      'Fresh vs. tested zones',
      'Zone strength analysis',
      'Multi-timeframe confirmation',
      'Entry and exit techniques'
    ]
  },
  {
    id: '5',
    title: 'Trader Psychology Blueprint',
    price: 39.99,
    description: 'Master your trading mindset with this comprehensive psychology guide. Learn to overcome emotional biases and develop a disciplined trading approach.',
    image: '/placeholder.svg',
    featured: true,
    features: [
      'Overcoming trading fears',
      'Managing trading stress',
      'Developing discipline and patience',
      'Creating a trading routine',
      'Performance evaluation techniques'
    ]
  },
  {
    id: '6',
    title: 'Complete Trading Plan Template',
    price: 29.99,
    description: 'A structured template for creating your personalized trading plan. Get organized and improve your trading consistency with this essential resource.',
    image: '/placeholder.svg',
    featured: false,
    features: [
      'Strategy definition framework',
      'Risk management guidelines',
      'Trade documentation templates',
      'Performance tracking tools',
      'Trading journal structure'
    ]
  }
];

// Initial state
const initialState: State = {
  products: initialProducts,
  cart: {
    items: []
  }
};

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product => 
          product.id === action.payload.id ? action.payload : product
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.items.findIndex(
        item => item.id === action.payload.id
      );
      
      if (existingItemIndex >= 0) {
        // Item already exists in cart, update quantity
        const updatedItems = [...state.cart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };
        
        return {
          ...state,
          cart: {
            ...state.cart,
            items: updatedItems
          }
        };
      } else {
        // Item doesn't exist in cart, add it
        return {
          ...state,
          cart: {
            ...state.cart,
            items: [...state.cart.items, action.payload]
          }
        };
      }
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(item => item.id !== action.payload.id)
        }
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
        }
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: []
        }
      };
    
    default:
      return state;
  }
};

// Create context
type StoreContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const StoreContext = createContext<StoreContextType>({
  state: initialState,
  dispatch: () => null
});

// Provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the store
export const useStore = () => useContext(StoreContext);
