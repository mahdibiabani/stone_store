import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CartItem, Stone } from '../types';

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (stone: Stone, quantity?: number, options?: { finish?: string; thickness?: string; notes?: string }) => void;
    removeFromCart: (stoneId: string, finish?: string, thickness?: string) => void;
    updateQuantity: (stoneId: string, quantity: number, finish?: string, thickness?: string) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('medusa-stone-cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                console.log('Loaded cart from localStorage:', parsedCart);
                setCartItems(parsedCart);
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        console.log('Saving cart to localStorage:', cartItems);
        localStorage.setItem('medusa-stone-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (stone: Stone, quantity: number = 1, options?: { finish?: string; thickness?: string; notes?: string }) => {
        console.log('addToCart called with:', { stone: stone.name, quantity, options });

        setCartItems(prev => {
            console.log('Previous cart items:', prev);

            const existingItemIndex = prev.findIndex(item =>
                item.stone.id === stone.id &&
                item.selectedFinish === options?.finish &&
                item.selectedThickness === options?.thickness
            );

            console.log('Existing item index:', existingItemIndex);

            if (existingItemIndex >= 0) {
                // Update existing item
                const updatedItems = [...prev];
                updatedItems[existingItemIndex].quantity += quantity;
                console.log('Updated existing item. New cart:', updatedItems);
                return updatedItems;
            } else {
                // Add new item
                const newItem: CartItem = {
                    stone,
                    quantity,
                    selectedFinish: options?.finish,
                    selectedThickness: options?.thickness,
                    notes: options?.notes
                };
                const newItems = [...prev, newItem];
                console.log('Added new item:', newItem);
                console.log('New cart:', newItems);
                return newItems;
            }
        });
    };

    const removeFromCart = (stoneId: string, finish?: string, thickness?: string) => {
        setCartItems(prev => prev.filter(item =>
            !(item.stone.id === stoneId &&
                item.selectedFinish === finish &&
                item.selectedThickness === thickness)
        ));
    };

    const updateQuantity = (stoneId: string, quantity: number, finish?: string, thickness?: string) => {
        if (quantity <= 0) {
            removeFromCart(stoneId, finish, thickness);
            return;
        }

        setCartItems(prev => prev.map(item =>
            item.stone.id === stoneId &&
                item.selectedFinish === finish &&
                item.selectedThickness === thickness
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const basePrice = parseInt(item.stone.price?.replace('$', '') || '85');
            return total + (basePrice * item.quantity);
        }, 0);
    };

    const getCartItemsCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartItemsCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
