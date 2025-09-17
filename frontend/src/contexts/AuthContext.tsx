import { createClient } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    address?: string;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    items: Array<{
        stone_id: string;
        name: string;
        quantity: number;
        price: number;
        image: string;
    }>;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    shipping_address: string;
    notes?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
    getOrders: () => Promise<Order[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // For testing - no persistent login, start with no user
        setLoading(false);
    }, []);

    const getUserData = async (userId: string): Promise<User | null> => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user data:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            // For testing purposes - allow any email/password combination
            // Create a mock user for testing
            const mockUser: User = {
                id: 'test-user-' + Date.now(),
                email: email,
                name: email.split('@')[0], // Use email prefix as name
                phone: '+1234567890',
                address: '123 Test Street, Test City',
                created_at: new Date().toISOString()
            };

            setUser(mockUser);
            return { success: true };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        try {
            // For testing purposes - create a mock user
            const mockUser: User = {
                id: 'test-user-' + Date.now(),
                email: email,
                name: name,
                phone: '+1234567890',
                address: '123 Test Street, Test City',
                created_at: new Date().toISOString()
            };

            setUser(mockUser);
            return { success: true };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            // Clear user-specific cart from localStorage before logging out
            if (user?.id) {
                const cartKey = `medusa-stone-cart-${user.id}`;
                localStorage.removeItem(cartKey);
            }
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            return { success: false, error: 'No user logged in' };
        }

        try {
            // Update local user state only (for testing)
            setUser({ ...user, ...updates });
            return { success: true };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const getOrders = async (): Promise<Order[]> => {
        if (!user) {
            return [];
        }

        try {
            // Return mock orders for testing
            const mockOrders: Order[] = [
                {
                    id: 'order-1',
                    user_id: user.id,
                    items: [
                        {
                            stone_id: 'stone-1',
                            name: 'Granite Countertop',
                            quantity: 1,
                            price: 2500.00,
                            image: '/images/granite.jpg'
                        }
                    ],
                    total: 2500.00,
                    status: 'delivered',
                    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
                    shipping_address: '123 Test Street, Test City, TC 12345',
                    notes: 'Test order'
                },
                {
                    id: 'order-2',
                    user_id: user.id,
                    items: [
                        {
                            stone_id: 'stone-2',
                            name: 'Marble Tiles',
                            quantity: 10,
                            price: 150.00,
                            image: '/images/marble.jpg'
                        }
                    ],
                    total: 1500.00,
                    status: 'processing',
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                    shipping_address: '123 Test Street, Test City, TC 12345'
                }
            ];

            return mockOrders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        getOrders,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
