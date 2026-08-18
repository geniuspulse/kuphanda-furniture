'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

// Generate a unique cart item key from product id + selected variations
function getCartKey(id, variations = {}) {
  const varStr = Object.entries(variations)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return varStr ? `${id}__${varStr}` : id;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('akonzi_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveCart = (updated) => {
    localStorage.setItem('akonzi_cart', JSON.stringify(updated));
  };

  const addToCart = (product, quantity = 1, selectedVariations = {}) => {
    const key = getCartKey(product.id, selectedVariations);
    const effectivePrice = (product.salePrice && product.salePrice < product.price)
      ? product.salePrice
      : product.price;

    setCart(prev => {
      const existing = prev.find(item => item.key === key);
      let updated;
      if (existing) {
        updated = prev.map(item =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, {
          key,
          id: product.id,
          name: product.name,
          price: effectivePrice,
          image: product.image || (product.images && product.images[0]) || '',
          category: product.category || '',
          quantity,
          selectedVariations,
        }];
      }
      saveCart(updated);
      return updated;
    });
  };

  const removeFromCart = (key) => {
    setCart(prev => {
      const updated = prev.filter(item => item.key !== key);
      saveCart(updated);
      return updated;
    });
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) {
      removeFromCart(key);
      return;
    }
    setCart(prev => {
      const updated = prev.map(item =>
        item.key === key ? { ...item, quantity } : item
      );
      saveCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('akonzi_cart');
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const hasPriceItems = useMemo(() => {
    return cart.some(item => item.price && item.price > 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      hasPriceItems,
      isLoaded,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      cartTotal: 0,
      cartCount: 0,
      hasPriceItems: false,
      isLoaded: false,
    };
  }
  return context;
}
