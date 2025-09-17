import { ArrowLeft, Grid, List, LogOut, Mountain, Search, ShoppingCart, User, UserCircle } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { stones } from '../data/stones';
import { translations } from '../data/translations';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import { Stone } from '../types';
import LanguageToggle from './LanguageToggle';
import ProductCard from './ProductCard';

interface AllProductsProps {
    onBack: () => void;
    onViewProduct: (stone: Stone) => void;
    onCartClick: () => void;
    onProfileClick?: () => void;
    onLoginClick?: () => void;
}

const AllProducts: React.FC<AllProductsProps> = ({ onBack, onViewProduct, onCartClick, onProfileClick, onLoginClick }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const { addToCart, getCartItemsCount } = useCart();
    const { user, logout } = useAuth();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(false);
        if (user) {
            onProfileClick?.();
        } else {
            onLoginClick?.();
        }
    };

    const handleLogout = async () => {
        await logout();
        setIsProfileDropdownOpen(false);
    };

    // Get unique categories
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(stones.map(stone => stone.category[language])));
        return uniqueCategories;
    }, [language]);

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = stones.filter(stone => {
            const matchesSearch = stone.name[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
                stone.description[language].toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || stone.category[language] === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Sort products
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name[language].localeCompare(b.name[language]);
                    break;
                case 'price':
                    const priceA = parseFloat(a.price.replace('$', ''));
                    const priceB = parseFloat(b.price.replace('$', ''));
                    comparison = priceA - priceB;
                    break;
                case 'category':
                    comparison = a.category[language].localeCompare(b.category[language]);
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [searchTerm, selectedCategory, sortBy, sortOrder, language]);


    const handleAddToCart = (stone: Stone) => {
        addToCart(stone, 1);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Custom Header */}
            <header className="bg-warm-50/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-warm-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Left side - Back Button and Logo */}
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <button
                                onClick={onBack}
                                className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors rtl:space-x-reverse"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-persian">
                                    {language === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
                                </span>
                            </button>

                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <div className="bg-stone-800 p-2 rounded-lg">
                                    <Mountain className="w-6 h-6 text-warm-50" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-stone-800 font-persian">
                                        {language === 'fa' ? 'سنگ مدوسا' : 'Medusa Stone'}
                                    </h1>
                                    <p className="text-xs text-stone-600 font-persian">
                                        {language === 'fa' ? 'کیفیت برتر زندگی' : 'A Higher Quality of Living'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Center - All Products Title */}
                        <div className="flex-1 text-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 font-persian">
                                {language === 'fa' ? 'همه محصولات' : 'All Products'}
                            </h1>
                        </div>

                        {/* Right side - Language toggle, Profile, Cart and CTA */}
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <LanguageToggle />

                            {/* Profile Icon */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="relative p-2 text-stone-600 hover:text-stone-800 transition-colors bg-white rounded-lg shadow-sm hover:shadow-md"
                                >
                                    {user ? (
                                        <UserCircle className="w-6 h-6" />
                                    ) : (
                                        <User className="w-6 h-6" />
                                    )}
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50">
                                        {user ? (
                                            <>
                                                <div className="px-4 py-2 border-b border-stone-100">
                                                    <p className="text-sm font-medium text-stone-800 font-persian">
                                                        {user.name || user.email}
                                                    </p>
                                                    <p className="text-xs text-stone-500">{user.email}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleProfileClick();
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                                                >
                                                    <UserCircle className="w-4 h-4" />
                                                    <span className="font-persian">
                                                        {language === 'fa' ? 'پروفایل' : 'Profile'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="font-persian">
                                                        {language === 'fa' ? 'خروج' : 'Logout'}
                                                    </span>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={handleProfileClick}
                                                className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                                            >
                                                <User className="w-4 h-4" />
                                                <span className="font-persian">
                                                    {language === 'fa' ? 'ورود / ثبت نام' : 'Login / Register'}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={onCartClick}
                                className="relative p-2 text-stone-600 hover:text-stone-800 transition-colors bg-white rounded-lg shadow-sm hover:shadow-md"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {getCartItemsCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                                        {getCartItemsCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filters and Search */}
            <div className="bg-stone-50 py-6 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5 rtl:left-auto rtl:right-3" />
                            <input
                                type="text"
                                placeholder={language === 'fa' ? 'جستجو در محصولات...' : 'Search products...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent rtl:pl-4 rtl:pr-10"
                                dir={language === 'fa' ? 'rtl' : 'ltr'}
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="custom-dropdown w-44 px-4 py-3 bg-white border-2 border-stone-200 rounded-2xl focus:ring-4 focus:ring-stone-200 focus:border-stone-400 font-persian text-stone-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-stone-300"
                        >
                            <option value="all">
                                {language === 'fa' ? 'همه دسته‌ها' : 'All Categories'}
                            </option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-stone-600 font-persian">
                                {language === 'fa' ? 'مرتب‌سازی:' : 'Sort by:'}
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'category')}
                                className="custom-dropdown w-44 px-4 py-3 bg-white border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-stone-200 focus:border-stone-400 font-persian text-stone-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-stone-300"
                            >
                                <option value="name">
                                    {language === 'fa' ? 'نام' : 'Name'}
                                </option>
                                <option value="price">
                                    {language === 'fa' ? 'قیمت' : 'Price'}
                                </option>
                                <option value="category">
                                    {language === 'fa' ? 'دسته‌بندی' : 'Category'}
                                </option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-2 bg-white border-2 border-stone-200 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all duration-300 shadow-sm hover:shadow-md text-stone-600 hover:text-stone-800 font-bold"
                                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'
                                    }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="bg-white py-4 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-stone-600 font-persian">
                        {language === 'fa'
                            ? `نمایش ${filteredAndSortedProducts.length} از ${stones.length} محصول`
                            : `Showing ${filteredAndSortedProducts.length} of ${stones.length} products`
                        }
                    </p>
                </div>
            </div>

            {/* Products Grid/List */}
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredAndSortedProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-stone-400 mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-stone-600 mb-2 font-persian">
                                {language === 'fa' ? 'محصولی یافت نشد' : 'No products found'}
                            </h3>
                            <p className="text-stone-500 font-persian">
                                {language === 'fa'
                                    ? 'لطفاً کلمات کلیدی جستجو یا فیلترها را تغییر دهید'
                                    : 'Try adjusting your search terms or filters'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'space-y-4'
                        }>
                            {filteredAndSortedProducts.map((stone) => (
                                <ProductCard
                                    key={stone.id}
                                    stone={stone}
                                    onViewDetails={onViewProduct}
                                    onAddToCart={handleAddToCart}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
