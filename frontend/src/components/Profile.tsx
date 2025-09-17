import { ArrowLeft, Calendar, CheckCircle, Clock, Edit3, Mail, MapPin, Package, Phone, Truck, User, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Order, useAuth } from '../contexts/AuthContext';
import { translations } from '../data/translations';
import { useLanguage } from '../hooks/useLanguage';
import Header from './Header';

interface ProfileProps {
    onBack: () => void;
    onCartClick?: () => void;
    onProfileClick?: () => void;
    onLoginClick?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack, onCartClick, onProfileClick, onLoginClick }) => {
    const { user, updateProfile, getOrders, logout } = useAuth();
    const { language } = useLanguage();
    const t = translations[language];

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchOrders = async () => {
            setOrdersLoading(true);
            try {
                const userOrders = await getOrders();
                setOrders(userOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setOrdersLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user, getOrders]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const result = await updateProfile(formData);
            if (result.success) {
                setIsEditing(false);
            } else {
                alert(result.error || (language === 'fa' ? 'خطا در به‌روزرسانی پروفایل' : 'Error updating profile'));
            }
        } catch (error) {
            alert(language === 'fa' ? 'خطا در به‌روزرسانی پروفایل' : 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || '',
        });
        setIsEditing(false);
    };

    const handleLogout = async () => {
        if (confirm(language === 'fa' ? 'آیا می‌خواهید خارج شوید؟' : 'Are you sure you want to logout?')) {
            await logout();
            onBack();
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-blue-500" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
        const statusMap = {
            pending: language === 'fa' ? 'در انتظار' : 'Pending',
            processing: language === 'fa' ? 'در حال پردازش' : 'Processing',
            shipped: language === 'fa' ? 'ارسال شده' : 'Shipped',
            delivered: language === 'fa' ? 'تحویل داده شده' : 'Delivered',
            cancelled: language === 'fa' ? 'لغو شده' : 'Cancelled',
        };
        return statusMap[status as keyof typeof statusMap] || status;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-white">
                <Header
                    onCartClick={onCartClick || (() => { })}
                    onProfileClick={onProfileClick}
                    onLoginClick={onLoginClick}
                />
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-stone-800 mb-4 font-persian">
                            {language === 'fa' ? 'کاربر یافت نشد' : 'User not found'}
                        </h2>
                        <button
                            onClick={onBack}
                            className="bg-stone-800 text-white px-6 py-2 rounded-lg hover:bg-stone-700 transition-colors font-persian"
                        >
                            {language === 'fa' ? 'بازگشت' : 'Go Back'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header
                onCartClick={onCartClick || (() => { })}
                onProfileClick={onProfileClick}
                onLoginClick={onLoginClick}
            />

            {/* Page Title and Back Button */}
            <div className="bg-stone-50 border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors rtl:space-x-reverse"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium font-persian">
                                {language === 'fa' ? 'بازگشت' : 'Back'}
                            </span>
                        </button>
                        <h1 className="text-2xl font-bold text-stone-800 font-persian">
                            {language === 'fa' ? 'پروفایل' : 'Profile'}
                        </h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-stone-800 font-persian">
                                    {language === 'fa' ? 'اطلاعات شخصی' : 'Personal Information'}
                                </h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2 font-persian">
                                            {language === 'fa' ? 'نام' : 'Name'}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent font-persian"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2 font-persian">
                                            {language === 'fa' ? 'تلفن' : 'Phone'}
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2 font-persian">
                                            {language === 'fa' ? 'آدرس' : 'Address'}
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent font-persian"
                                        />
                                    </div>
                                    <div className="flex space-x-3 rtl:space-x-reverse">
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex-1 bg-stone-800 text-white py-2 px-4 rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50 font-persian"
                                        >
                                            {loading
                                                ? (language === 'fa' ? 'در حال ذخیره...' : 'Saving...')
                                                : (language === 'fa' ? 'ذخیره' : 'Save')
                                            }
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-persian"
                                        >
                                            {language === 'fa' ? 'لغو' : 'Cancel'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <Mail className="w-5 h-5 text-stone-400" />
                                        <div>
                                            <p className="text-sm text-stone-500 font-persian">
                                                {language === 'fa' ? 'ایمیل' : 'Email'}
                                            </p>
                                            <p className="text-stone-800">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <User className="w-5 h-5 text-stone-400" />
                                        <div>
                                            <p className="text-sm text-stone-500 font-persian">
                                                {language === 'fa' ? 'نام' : 'Name'}
                                            </p>
                                            <p className="text-stone-800 font-persian">{user.name || (language === 'fa' ? 'تعریف نشده' : 'Not set')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <Phone className="w-5 h-5 text-stone-400" />
                                        <div>
                                            <p className="text-sm text-stone-500 font-persian">
                                                {language === 'fa' ? 'تلفن' : 'Phone'}
                                            </p>
                                            <p className="text-stone-800">{user.phone || (language === 'fa' ? 'تعریف نشده' : 'Not set')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                        <MapPin className="w-5 h-5 text-stone-400 mt-1" />
                                        <div>
                                            <p className="text-sm text-stone-500 font-persian">
                                                {language === 'fa' ? 'آدرس' : 'Address'}
                                            </p>
                                            <p className="text-stone-800 font-persian">{user.address || (language === 'fa' ? 'تعریف نشده' : 'Not set')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <Calendar className="w-5 h-5 text-stone-400" />
                                        <div>
                                            <p className="text-sm text-stone-500 font-persian">
                                                {language === 'fa' ? 'تاریخ عضویت' : 'Member Since'}
                                            </p>
                                            <p className="text-stone-800">{formatDate(user.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-stone-200">
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium font-persian"
                                >
                                    {language === 'fa' ? 'خروج از حساب' : 'Logout'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
                            <h2 className="text-xl font-bold text-stone-800 mb-6 font-persian">
                                {language === 'fa' ? 'سفارشات قبلی' : 'Order History'}
                            </h2>

                            {ordersLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800 mx-auto"></div>
                                    <p className="text-stone-500 mt-2 font-persian">
                                        {language === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}
                                    </p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                                    <p className="text-stone-500 font-persian">
                                        {language === 'fa' ? 'هنوز سفارشی ثبت نکرده‌اید' : 'No orders yet'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    {getStatusIcon(order.status)}
                                                    <span className="font-medium text-stone-800 font-persian">
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-stone-500 font-persian">
                                                        {language === 'fa' ? 'تاریخ سفارش' : 'Order Date'}
                                                    </p>
                                                    <p className="text-stone-800">{formatDate(order.created_at)}</p>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <p className="text-sm text-stone-500 font-persian mb-1">
                                                    {language === 'fa' ? 'محصولات' : 'Items'}
                                                </p>
                                                <div className="space-y-1">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between text-sm">
                                                            <span className="text-stone-700 font-persian">
                                                                {item.name} × {item.quantity}
                                                            </span>
                                                            <span className="text-stone-600">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                                                <div>
                                                    <p className="text-sm text-stone-500 font-persian">
                                                        {language === 'fa' ? 'آدرس ارسال' : 'Shipping Address'}
                                                    </p>
                                                    <p className="text-stone-800 font-persian">{order.shipping_address}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-stone-800">
                                                        ${order.total.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
