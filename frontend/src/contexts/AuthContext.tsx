import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api, ApiUser, ApiOrder } from '../services/api';

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
    order_number: string;
    tracking_code?: string;
    items: Array<{
        stone_id: string;
        name: string;
        quantity: number;
        price: number;
        image: string;
    }>;
    total: number;
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'completed' | 'failed' | 'cancelled';
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
    getOrders: (language?: 'en' | 'fa') => Promise<Order[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const apiUser = await api.auth.getProfile();
                    setUser({
                        id: apiUser.id.toString(),
                        email: apiUser.email,
                        name: `${apiUser.first_name} ${apiUser.last_name}`.trim(),
                        phone: apiUser.phone,
                        address: apiUser.address,
                        created_at: apiUser.date_joined
                    });
                } catch (error) {
                    console.error('Failed to get user profile:', error);
                    localStorage.removeItem('auth_token');
                }
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await api.auth.login(email, password);
            
            const apiUser = response.user;
            setUser({
                id: apiUser.id.toString(),
                email: apiUser.email,
                name: `${apiUser.first_name} ${apiUser.last_name}`.trim(),
                phone: apiUser.phone,
                address: apiUser.address,
                created_at: apiUser.date_joined
            });
            
            return { success: true };
        } catch (error) {
            let errorMessage = 'Login failed';
            
            if (error instanceof Error) {
                const originalError = error.message.toLowerCase();
                
                // Map common Django authentication errors to user-friendly messages
                if (originalError.includes('unable to log in') || originalError.includes('invalid credentials') || originalError.includes('incorrect')) {
                    errorMessage = 'نام کاربری یا رمز عبور نادرست است'; // Persian: Username or password is incorrect
                } else if (originalError.includes('user account is disabled')) {
                    errorMessage = 'حساب کاربری غیرفعال است'; // Persian: User account is disabled
                } else if (originalError.includes('this field may not be blank') || originalError.includes('required')) {
                    errorMessage = 'لطفا تمام فیلدهای ضروری را پر کنید'; // Persian: Please fill all required fields
                } else {
                    // For other errors, show the original message if it's user-friendly, otherwise show generic message
                    errorMessage = originalError.length < 100 ? error.message : 'خطا در ورود به سیستم'; // Persian: Login error
                }
            }
            
            return { 
                success: false, 
                error: errorMessage
            };
        }
    };

    const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const nameParts = name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            const response = await api.auth.register(email, password, firstName, lastName);
            
            const apiUser = response.user;
            setUser({
                id: apiUser.id.toString(),
                email: apiUser.email,
                name: `${apiUser.first_name} ${apiUser.last_name}`.trim(),
                phone: apiUser.phone,
                address: apiUser.address,
                created_at: apiUser.date_joined
            });
            
            return { success: true };
        } catch (error) {
            let errorMessage = 'Registration failed';
            
            if (error instanceof Error) {
                const originalError = error.message.toLowerCase();
                
                // Map common Django registration errors to user-friendly messages
                if (originalError.includes('user with this email already exists') || originalError.includes('already exists')) {
                    errorMessage = 'کاربری با این ایمیل قبلاً ثبت نام کرده است'; // Persian: User with this email already registered
                } else if (originalError.includes('username') && originalError.includes('already exists')) {
                    errorMessage = 'این ایمیل قبلاً استفاده شده است'; // Persian: This email has already been used
                } else if (originalError.includes('password too short') || originalError.includes('ensure this field has at least 8')) {
                    errorMessage = 'رمز عبور باید حداقل ۸ کاراکتر باشد'; // Persian: Password must be at least 8 characters
                } else if (originalError.includes('password too common') || originalError.includes('password is too common')) {
                    errorMessage = 'رمز عبور انتخابی بسیار ساده است'; // Persian: Password is too common
                } else if (originalError.includes('passwords don\'t match') || originalError.includes('password')) {
                    errorMessage = 'رمز عبور وارد شده معتبر نیست'; // Persian: Invalid password
                } else if (originalError.includes('enter a valid email')) {
                    errorMessage = 'لطفا ایمیل معتبر وارد کنید'; // Persian: Please enter a valid email
                } else if (originalError.includes('this field may not be blank') || originalError.includes('required')) {
                    errorMessage = 'لطفا تمام فیلدهای ضروری را پر کنید'; // Persian: Please fill all required fields
                } else if (originalError.includes('first_name')) {
                    errorMessage = 'لطفا نام خود را وارد کنید'; // Persian: Please enter your name
                } else if (originalError.includes('username')) {
                    errorMessage = 'مشکلی در نام کاربری وجود دارد'; // Persian: There's an issue with the username
                } else {
                    // For other errors, show the original message if it's user-friendly, otherwise show generic message
                    errorMessage = originalError.length < 100 ? error.message : 'خطا در ثبت نام'; // Persian: Registration error
                }
            }
            
            return { 
                success: false, 
                error: errorMessage
            };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            // Clear user-specific cart from localStorage before logging out
            if (user?.id) {
                const cartKey = `medusa-stone-cart-${user.id}`;
                localStorage.removeItem(cartKey);
            }
            
            api.auth.logout();
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
            // Convert frontend user format to API format
            const apiUpdates: Partial<ApiUser> = {};
            
            if (updates.name) {
                const nameParts = updates.name.split(' ');
                apiUpdates.first_name = nameParts[0] || '';
                apiUpdates.last_name = nameParts.slice(1).join(' ') || '';
            }
            
            if (updates.phone !== undefined) apiUpdates.phone = updates.phone;
            if (updates.address !== undefined) apiUpdates.address = updates.address;

            const updatedApiUser = await api.auth.updateProfile(apiUpdates);
            
            // Update local user state
            setUser({
                ...user,
                name: `${updatedApiUser.first_name} ${updatedApiUser.last_name}`.trim(),
                phone: updatedApiUser.phone,
                address: updatedApiUser.address
            });
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Update failed' 
            };
        }
    };

    const getOrders = async (language: 'en' | 'fa' = 'en'): Promise<Order[]> => {
        if (!user) {
            return [];
        }

        try {
            const apiOrders: ApiOrder[] = await api.orders.getAll();
            
            // Transform API orders to frontend format
            return apiOrders.map(apiOrder => ({
                id: apiOrder.id.toString(),
                user_id: user.id,
                order_number: apiOrder.order_number,
                tracking_code: apiOrder.tracking_code,
                items: apiOrder.items.map(item => ({
                    stone_id: item.stone.id.toString(),
                    name: language === 'fa' ? item.stone.name_fa : item.stone.name_en,
                    quantity: item.quantity,
                    price: parseFloat(item.price),
                    image: item.stone.images[0]?.image || ''
                })),
                total: parseFloat(apiOrder.total_amount),
                status: apiOrder.status,
                payment_status: apiOrder.payment_status,
                created_at: apiOrder.created_at,
                shipping_address: `${apiOrder.shipping_address}, ${apiOrder.shipping_city}, ${apiOrder.shipping_postal_code}`,
                notes: ''
            }));
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
