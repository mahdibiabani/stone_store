import { ArrowLeft, LogOut, Minus, Mountain, Plus, ShoppingBag, ShoppingCart, Trash2, User, UserCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../data/translations';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import LanguageToggle from './LanguageToggle';

interface CartProps {
  onBack: () => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  onLoginClick?: () => void;
}

const Cart: React.FC<CartProps> = ({ onBack, onCartClick, onProfileClick, onLoginClick }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const { user, logout } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useCart();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLogoutFromDropdown = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
  };

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50">
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

              {/* Center - Cart Title */}
              <div className="flex-1 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-stone-800 font-persian">
                  {language === 'fa' ? 'سبد خرید' : 'Shopping Cart'}
                </h1>
              </div>

              {/* Right side - Language toggle, Profile, Cart */}
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <LanguageToggle />

                {/* Profile Icon */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="relative p-2 text-stone-600 hover:text-stone-800 transition-colors bg-white rounded-lg shadow-sm hover:shadow-md"
                  >
                    <User className="w-6 h-6" />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50">
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <User className="w-4 h-4" />
                        <span className="font-persian">
                          {language === 'fa' ? 'ورود / ثبت نام' : 'Login / Register'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={onCartClick || (() => { })}
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

        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Login Required */}
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 text-stone-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-stone-800 mb-4 font-persian">
                {language === 'fa' ? 'برای مشاهده سبد خرید وارد شوید' : 'Please login to view your cart'}
              </h2>
              <p className="text-stone-600 mb-6 font-persian">
                {language === 'fa' ? 'برای دسترسی به سبد خرید خود باید وارد حساب کاربری شوید' : 'You need to be logged in to access your cart'}
              </p>
              <button
                onClick={onLoginClick}
                className="bg-stone-800 text-white px-8 py-3 rounded-2xl hover:bg-stone-700 transition-all font-persian"
              >
                {language === 'fa' ? 'ورود' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Cart component rendered. Cart items:', cartItems);
  console.log('Cart items count:', getCartItemsCount());

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
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

              {/* Center - Cart Title */}
              <div className="flex-1 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-stone-800 font-persian">
                  {language === 'fa' ? 'سبد خرید' : 'Shopping Cart'}
                </h1>
              </div>

              {/* Right side - Language toggle, Profile, Cart */}
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
                            onClick={handleLogoutFromDropdown}
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
                  onClick={onCartClick || (() => { })}
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

        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Empty Cart */}
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 text-stone-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-stone-800 mb-4 font-persian">
                {t.cart.empty}
              </h2>
              <button
                onClick={onBack}
                className="bg-stone-800 text-white px-8 py-3 rounded-2xl hover:bg-stone-700 transition-all font-persian"
              >
                {t.cart.continueShopping}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
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

            {/* Center - Cart Title */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-stone-800 font-persian">
                {language === 'fa' ? 'سبد خرید' : 'Shopping Cart'}
              </h1>
            </div>

            {/* Right side - Language toggle, Profile, Cart */}
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
                          onClick={handleLogoutFromDropdown}
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
                onClick={onCartClick || (() => { })}
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

      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cart Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-stone-800 font-persian">
              {t.cart.title}
            </h1>
            <p className="text-stone-600 mt-2 font-persian">
              {getCartItemsCount()} {language === 'fa' ? 'محصول در سبد خرید' : 'items in cart'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <div key={`${item.stone.id}-${item.selectedFinish}-${item.selectedThickness}-${index}`} className="bg-white rounded-4xl p-6 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
                      <img
                        src={item.stone.images[0]}
                        alt={item.stone.name[language]}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-stone-800 font-persian">
                          {item.stone.name[language]}
                        </h3>
                        <p className="text-stone-600 font-persian">
                          {item.stone.category[language]}
                        </p>
                        {item.selectedFinish && (
                          <p className="text-sm text-stone-500 font-persian">
                            {t.products.finish}: {item.selectedFinish}
                          </p>
                        )}
                        {item.selectedThickness && (
                          <p className="text-sm text-stone-500 font-persian">
                            {t.products.thickness}: {item.selectedThickness}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <button
                            onClick={() => updateQuantity(
                              item.stone.id,
                              item.quantity - 1,
                              item.selectedFinish,
                              item.selectedThickness
                            )}
                            className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center hover:bg-neutral-300 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-semibold text-stone-800 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(
                              item.stone.id,
                              item.quantity + 1,
                              item.selectedFinish,
                              item.selectedThickness
                            )}
                            className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center hover:bg-neutral-300 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className="text-right rtl:text-left">
                            <p className="text-lg font-bold text-stone-800">
                              ${(parseInt(item.stone.price?.replace('$', '') || '85') * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-stone-500">
                              {item.stone.price}/m² × {item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(
                              item.stone.id,
                              item.selectedFinish,
                              item.selectedThickness
                            )}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {item.notes && (
                        <div className="pt-2 border-t border-neutral-200">
                          <p className="text-sm text-stone-600 font-persian">
                            <span className="font-medium">Notes:</span> {item.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-4xl p-6 shadow-lg sticky top-8">
                <h2 className="text-xl font-bold text-stone-800 mb-6 font-persian">
                  {language === 'fa' ? 'خلاصه سفارش' : 'Order Summary'}
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-stone-600 font-persian">
                    <span>{language === 'fa' ? 'تعداد اقلام' : 'Items'}</span>
                    <span>{getCartItemsCount()}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 font-persian">
                    <span>{t.cart.subtotal}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 font-persian">
                    <span>{t.cart.shipping}</span>
                    <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : (language === 'fa' ? 'رایگان' : 'Free')}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-stone-800 font-persian">
                      <span>{t.cart.grandTotal}</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-stone-800 text-white py-4 rounded-2xl hover:bg-stone-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-6 font-persian">
                  {t.cart.checkout}
                </button>

                <button
                  onClick={onBack}
                  className="w-full bg-neutral-200 text-stone-800 py-3 rounded-2xl hover:bg-neutral-300 transition-all duration-300 font-semibold mt-4 font-persian"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;