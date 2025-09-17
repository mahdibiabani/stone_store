import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CartItem, Stone } from '../types';
import { useAuth } from './AuthContext';
import { api, ApiCartItem } from '../services/api';

interface CartContextType {
    cartItems: CartItem[];
    loading: boolean;
    addToCart: (stone: Stone, quantity?: number, options?: { finish?: string; thickness?: string; notes?: string }) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getCartTotal: () => number;
    getCartItemsCount: () => number;
    refreshCart: () => Promise<void>;
    checkout: (shippingData: { address: string; city: string; postal_code: string; phone: string }) => Promise<{ success: boolean; paymentUrl?: string; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

// Transform API cart item to frontend format
const transformApiCartItem = (apiItem: ApiCartItem): CartItem => ({
    id: apiItem.id,
    stone: {
        id: apiItem.stone.id.toString(),
        name: {
            en: apiItem.stone.name_en,
            fa: apiItem.stone.name_fa
        },
        category: {
            en: apiItem.stone.category.name_en,
            fa: apiItem.stone.category.name_fa
        },
        description: {
            en: apiItem.stone.description_en,
            fa: apiItem.stone.description_fa
        },
        price: apiItem.stone.price || '$85',
        images: apiItem.stone.images.map(img => img.image),
        videos: apiItem.stone.videos?.map(vid => vid.video) || [],
        origin: apiItem.stone.origin || 'Iran',
        finishes: apiItem.stone.finishes,
        thickness: apiItem.stone.thickness_options,
        applications: [],
        specifications: {}
    },
    quantity: apiItem.quantity,
    selectedFinish: apiItem.selected_finish,
    selectedThickness: apiItem.selected_thickness,
    notes: apiItem.notes
});

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Load cart from API when user changes
    const refreshCart = async () => {
        if (!user) {
            // Load guest cart from localStorage
            const savedCart = localStorage.getItem('medusa-stone-cart-guest');
            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart);
                    setCartItems(parsedCart);
                } catch (parseError) {
                    console.error('Error parsing saved cart:', parseError);
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
            return;
        }

        try {
            setLoading(true);
            console.log('Loading cart from API for user:', user.id);
            const apiCart = await api.cart.get();
            console.log('API cart response:', apiCart);
            setCartItems(apiCart.items.map(transformApiCartItem));
        } catch (error) {
            console.error('Error loading cart:', error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Sync localStorage cart to backend when user logs in
    const syncGuestCartToBackend = async () => {
        if (!user) return;
        
        const guestCart = localStorage.getItem('medusa-stone-cart-guest');
        if (!guestCart) return;
        
        try {
            const parsedCart = JSON.parse(guestCart);
            console.log('Syncing guest cart to backend:', parsedCart);
            
            for (const item of parsedCart) {
                await api.cart.addItem(parseInt(item.stone.id), item.quantity, {
                    selected_finish: item.selectedFinish,
                    selected_thickness: item.selectedThickness,
                    notes: item.notes
                });
            }
            
            // Clear guest cart after sync
            localStorage.removeItem('medusa-stone-cart-guest');
            
            // Refresh cart to get updated data
            await refreshCart();
        } catch (error) {
            console.error('Error syncing guest cart:', error);
        }
    };

    useEffect(() => {
        if (user) {
            // First sync guest cart if exists, then refresh
            syncGuestCartToBackend().then(() => {
                if (!cartItems.length) {
                    refreshCart();
                }
            });
        } else {
            refreshCart();
        }
    }, [user?.id]);

    // Save guest cart to localStorage
    useEffect(() => {
        if (!user && cartItems.length > 0) {
            localStorage.setItem('medusa-stone-cart-guest', JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const addToCart = async (stone: Stone, quantity: number = 1, options?: { finish?: string; thickness?: string; notes?: string }) => {
        if (!user) {
            // Handle guest cart with localStorage
            setCartItems(prev => {
                const existingItemIndex = prev.findIndex(item =>
                    item.stone.id === stone.id &&
                    item.selectedFinish === options?.finish &&
                    item.selectedThickness === options?.thickness
                );

                if (existingItemIndex >= 0) {
                    const updatedItems = [...prev];
                    updatedItems[existingItemIndex].quantity += quantity;
                    return updatedItems;
                } else {
                    const newItem: CartItem = {
                        id: Date.now(), // Temporary ID for guest cart
                        stone,
                        quantity,
                        selectedFinish: options?.finish,
                        selectedThickness: options?.thickness,
                        notes: options?.notes
                    };
                    return [...prev, newItem];
                }
            });
            return;
        }

        try {
            setLoading(true);
            await api.cart.addItem(parseInt(stone.id), quantity, {
                selected_finish: options?.finish,
                selected_thickness: options?.thickness,
                notes: options?.notes
            });
            await refreshCart();
        } catch (error) {
            console.error('Error adding item to cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId: number) => {
        if (!user) {
            // Handle guest cart
            setCartItems(prev => prev.filter(item => item.id !== itemId));
            return;
        }

        try {
            setLoading(true);
            await api.cart.removeItem(itemId);
            await refreshCart();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        if (!user) {
            // Handle guest cart
            if (quantity <= 0) {
                setCartItems(prev => prev.filter(item => item.id !== itemId));
            } else {
                setCartItems(prev => prev.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                ));
            }
            return;
        }

        try {
            setLoading(true);
            await api.cart.updateItem(itemId, quantity);
            await refreshCart();
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        if (!user) {
            // Handle guest cart
            setCartItems([]);
            localStorage.removeItem('medusa-stone-cart-guest');
            return;
        }

        try {
            setLoading(true);
            await api.cart.clear();
            setCartItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
        } finally {
            setLoading(false);
        }
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

    const checkout = async (shippingData: { address: string; city: string; postal_code: string; phone: string }): Promise<{ success: boolean; paymentUrl?: string; error?: string }> => {
        if (!user) {
            return { success: false, error: 'کاربر وارد نشده است' }; // Persian: User not logged in
        }

        if (cartItems.length === 0) {
            return { success: false, error: 'سبد خرید خالی است' }; // Persian: Cart is empty
        }

        try {
            setLoading(true);
            console.log('Checkout data being sent:', shippingData);
            console.log('Cart items:', cartItems);
            
            const response = await api.cart.checkout(shippingData);
            console.log('Checkout response:', response);
            
            if (response.payment_url) {
                // Clear cart after successful checkout initiation
                await refreshCart();
                return { 
                    success: true, 
                    paymentUrl: response.payment_url 
                };
            } else {
                return { 
                    success: false, 
                    error: 'خطا در ایجاد درخواست پرداخت' // Persian: Error creating payment request
                };
            }
        } catch (error) {
            console.error('Checkout error:', error);
            let errorMessage = 'خطا در تسویه حساب'; // Persian: Checkout error
            
            if (error instanceof Error) {
                const originalError = error.message.toLowerCase();
                if (originalError.includes('network error')) {
                    errorMessage = 'خطا در اتصال به سرور. لطفا اتصال اینترنت خود را بررسی کنید'; // Persian: Connection error, check internet
                } else if (originalError.includes('missing required field')) {
                    errorMessage = 'لطفا تمام اطلاعات آدرس را وارد کنید'; // Persian: Please enter all address information
                } else if (originalError.includes('cart is empty')) {
                    errorMessage = 'سبد خرید خالی است'; // Persian: Cart is empty
                } else if (originalError.includes('price not set')) {
                    errorMessage = 'قیمت برخی محصولات تعیین نشده است'; // Persian: Some products don't have prices set
                } else if (originalError.includes('invalid total amount')) {
                    errorMessage = 'مبلغ کل نامعتبر است'; // Persian: Invalid total amount
                } else if (originalError.includes('invalid json response')) {
                    errorMessage = 'خطا در دریافت پاسخ از سرور'; // Persian: Error receiving response from server
                } else if (originalError.includes('authentication credentials')) {
                    errorMessage = 'لطفا دوباره وارد شوید'; // Persian: Please login again
                } else if (originalError.length < 100) {
                    errorMessage = error.message;
                }
            }
            
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartItemsCount,
            refreshCart,
            checkout
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
