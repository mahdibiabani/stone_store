import { ArrowLeft, LogOut, Minus, Mountain, Plus, ShoppingBag, ShoppingCart, Trash2, User, UserCircle, CreditCard, Banknote, Truck, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../data/translations';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import ConfirmationModal from './ConfirmationModal';
import LanguageToggle from './LanguageToggle';
import { formatPrice, formatPriceWithUnit, formatQuantity } from '../utils/numberFormat';

interface CartProps {
  onBack: () => void;
  onContinueShopping: () => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  onLoginClick?: () => void;
  onHomeClick?: () => void;
}

const Cart: React.FC<CartProps> = ({ onBack, onContinueShopping, onCartClick, onProfileClick, onLoginClick, onHomeClick }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const { user, logout } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount, checkout, loading } = useCart();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('zarinpal');
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState(256);
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    postal_code: '',
    phone: ''
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);

  // Payment gateway options
  const paymentGateways = [
    {
      id: 'zarinpal',
      name: t.cart.paymentGateways.zarinpal,
      icon: CreditCard,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      id: 'mellat',
      name: t.cart.paymentGateways.mellat,
      icon: Building2,
      color: 'bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      id: 'parsian',
      name: t.cart.paymentGateways.parsian,
      icon: Building2,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      id: 'melli',
      name: t.cart.paymentGateways.melli,
      icon: Building2,
      color: 'bg-red-600',
      textColor: 'text-red-600'
    },
    {
      id: 'cash_on_delivery',
      name: t.cart.paymentGateways.cash_on_delivery,
      icon: Truck,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      id: 'bank_transfer',
      name: t.cart.paymentGateways.bank_transfer,
      icon: Banknote,
      color: 'bg-purple-600',
      textColor: 'text-purple-600'
    }
  ];

  const selectedGateway = paymentGateways.find(gateway => gateway.id === selectedPaymentType) || paymentGateways[0];

  // Function to check available space and set dropdown direction
  const checkDropdownDirection = () => {
    if (paymentDropdownRef.current) {
      const rect = paymentDropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = paymentGateways.length * 64 + 16; // Approximate height
      const spaceBelow = viewportHeight - rect.bottom - 20; // 20px margin
      const spaceAbove = rect.top - 20; // 20px margin
      
      // Choose direction based on available space
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownDirection('up');
        setDropdownMaxHeight(Math.min(spaceAbove, 300)); // Max 300px or available space
      } else {
        setDropdownDirection('down');
        setDropdownMaxHeight(Math.min(spaceBelow, 300)); // Max 300px or available space
      }
    }
  };

  // Close dropdown when clicking outside and handle window resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setIsPaymentDropdownOpen(false);
      }
    };

    const handleResize = () => {
      if (isPaymentDropdownOpen) {
        checkDropdownDirection();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPaymentDropdownOpen]);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(false);
    if (user) {
      onProfileClick?.();
    } else {
      onLoginClick?.();
    }
  };

  const handleLogoutFromDropdown = () => {
    setShowLogoutConfirm(true);
    setIsProfileDropdownOpen(false);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCheckoutClick = () => {
    // Auto-fill shipping data from user profile
    if (user) {
      const updatedShippingData = {
        address: user.address || '',
        city: '',
        postal_code: '',
        phone: user.phone || ''
      };

      // Try to parse address if it contains city/postal code
      if (user.address) {
        const addressParts = user.address.split(',').map(part => part.trim());
        if (addressParts.length >= 3) {
          // Assume format: "address, city, postal_code"
          updatedShippingData.address = addressParts.slice(0, -2).join(', ');
          updatedShippingData.city = addressParts[addressParts.length - 2];
          updatedShippingData.postal_code = addressParts[addressParts.length - 1];
        } else if (addressParts.length === 2) {
          // Assume format: "address, city"
          updatedShippingData.address = addressParts[0];
          updatedShippingData.city = addressParts[1];
        }
      }

      setShippingData(updatedShippingData);
    }
    
    setShowCheckoutForm(true);
    setCheckoutError('');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setCheckoutError('');

    // Validate required fields
    if (!shippingData.address || !shippingData.city || !shippingData.postal_code || !shippingData.phone) {
      setCheckoutError(language === 'fa' ? 'لطفا تمام فیلدهای آدرس را پر کنید' : 'Please fill all address fields');
      setCheckoutLoading(false);
      return;
    }

    try {
      const result = await checkout({
        ...shippingData,
        payment_type: selectedPaymentType
      });
      
      if (result.success && result.paymentUrl) {
        // Redirect to ZarinPal payment page
        window.location.href = result.paymentUrl;
      } else {
        setCheckoutError(result.error || (language === 'fa' ? 'خطا در تسویه حساب' : 'Checkout error'));
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(language === 'fa' ? 'خطا در تسویه حساب' : 'Checkout error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleShippingInputChange = (field: string, value: string) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
  };

  const handleFillFromProfile = () => {
    if (user) {
      const updatedShippingData = {
        address: user.address || '',
        city: '',
        postal_code: '',
        phone: user.phone || ''
      };

      // Try to parse address if it contains city/postal code
      if (user.address) {
        const addressParts = user.address.split(',').map(part => part.trim());
        if (addressParts.length >= 3) {
          // Assume format: "address, city, postal_code"
          updatedShippingData.address = addressParts.slice(0, -2).join(', ');
          updatedShippingData.city = addressParts[addressParts.length - 2];
          updatedShippingData.postal_code = addressParts[addressParts.length - 1];
        } else if (addressParts.length === 2) {
          // Assume format: "address, city"
          updatedShippingData.address = addressParts[0];
          updatedShippingData.city = addressParts[1];
        }
      }

      setShippingData(updatedShippingData);
    }
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
                  onClick={onHomeClick || onBack}
                  className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors rtl:space-x-reverse"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-persian">
                    {language === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
                  </span>
                </button>

                <button 
                  onClick={onHomeClick}
                  className="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-opacity"
                >
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
                </button>
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
                    <div className={`absolute ${language === 'fa' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50`}>
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
                      {formatQuantity(getCartItemsCount(), language)}
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
        
        {/* Logout Confirmation Modal */}
        <ConfirmationModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogoutConfirm}
          title={language === 'fa' ? 'تأیید خروج' : 'Confirm Logout'}
          message={language === 'fa' ? 'آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟' : 'Are you sure you want to logout from your account?'}
          confirmText={language === 'fa' ? 'خروج' : 'Logout'}
          cancelText={language === 'fa' ? 'لغو' : 'Cancel'}
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isLoading={isLoggingOut}
        />
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
                  onClick={onHomeClick || onBack}
                  className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors rtl:space-x-reverse"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-persian">
                    {language === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
                  </span>
                </button>

                <button 
                  onClick={onHomeClick}
                  className="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-opacity"
                >
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
                </button>
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
                    <div className={`absolute ${language === 'fa' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50`}>
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
                      {formatQuantity(getCartItemsCount(), language)}
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
                onClick={onContinueShopping}
                className="bg-stone-800 text-white px-8 py-3 rounded-2xl hover:bg-stone-700 transition-all font-persian"
              >
                {t.cart.continueShopping}
              </button>
            </div>
          </div>
        </div>
        
        {/* Logout Confirmation Modal */}
        <ConfirmationModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogoutConfirm}
          title={language === 'fa' ? 'تأیید خروج' : 'Confirm Logout'}
          message={language === 'fa' ? 'آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟' : 'Are you sure you want to logout from your account?'}
          confirmText={language === 'fa' ? 'خروج' : 'Logout'}
          cancelText={language === 'fa' ? 'لغو' : 'Cancel'}
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isLoading={isLoggingOut}
        />
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
                  <div className={`absolute ${language === 'fa' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50`}>
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
              {formatQuantity(getCartItemsCount(), language)} {language === 'fa' ? 'محصول در سبد خرید' : 'items in cart'}
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
                            onClick={() => item.id && updateQuantity(
                              item.id,
                              item.quantity - 1
                            )}
                            className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center hover:bg-neutral-300 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-semibold text-stone-800 min-w-[2rem] text-center">
                            {formatQuantity(item.quantity, language)}
                          </span>
                          <button
                            onClick={() => item.id && updateQuantity(
                              item.id,
                              item.quantity + 1
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
                              {formatPrice((parseInt(item.stone.price?.replace('$', '') || '85') * item.quantity), language)}
                            </p>
                            <p className="text-sm text-stone-500">
                              {formatPriceWithUnit(item.stone.price || '$85', language)} × {formatQuantity(item.quantity, language)}
                            </p>
                          </div>
                          <button
                            onClick={() => item.id && removeFromCart(item.id)}
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
                    <span>{formatQuantity(getCartItemsCount(), language)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 font-persian">
                    <span>{t.cart.subtotal}</span>
                    <span>{formatPrice(subtotal, language)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 font-persian">
                    <span>{t.cart.shipping}</span>
                    <span>{shipping > 0 ? formatPrice(shipping, language) : t.cart.free}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-stone-800 font-persian">
                      <span>{t.cart.grandTotal}</span>
                      <span>{formatPrice(total, language)}</span>
                    </div>
                  </div>
                  
                  {/* Payment Type Selection */}
                  <div className="border-t border-neutral-200 pt-4">
                    <label className="block text-sm font-semibold text-stone-700 mb-3 font-persian">
                      {t.cart.paymentType}
                    </label>
                    <div className="relative" ref={paymentDropdownRef}>
                      {/* Selected Payment Gateway Display */}
                       <button
                         onClick={() => {
                           if (!isPaymentDropdownOpen) {
                             checkDropdownDirection();
                           }
                           setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
                         }}
                         className="w-full flex items-center justify-between p-4 border border-neutral-200 rounded-2xl hover:border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all bg-white"
                       >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 ${selectedGateway.color} rounded-lg flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3`}>
                            <selectedGateway.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-persian text-sm font-medium text-stone-700">
                            {selectedGateway.name}
                          </span>
                        </div>
                        {isPaymentDropdownOpen ? (
                          <ChevronUp className="w-5 h-5 text-stone-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-stone-500" />
                        )}
                      </button>

                       {/* Dropdown Options */}
                       {isPaymentDropdownOpen && (
                         <div 
                           className={`absolute left-0 right-0 bg-white border border-neutral-200 rounded-2xl shadow-lg z-10 overflow-y-auto ${
                             dropdownDirection === 'up' 
                               ? 'bottom-full mb-2' 
                               : 'top-full mt-2'
                           }`}
                           style={{ maxHeight: `${dropdownMaxHeight}px` }}
                         >
                           {paymentGateways.map((gateway) => (
                            <button
                              key={gateway.id}
                              onClick={() => {
                                setSelectedPaymentType(gateway.id);
                                setIsPaymentDropdownOpen(false);
                              }}
                              className={`w-full flex items-center p-4 hover:bg-neutral-50 transition-all first:rounded-t-2xl last:rounded-b-2xl ${
                                selectedPaymentType === gateway.id ? 'bg-stone-50 border-l-4 border-l-stone-600' : ''
                              }`}
                            >
                              <div className={`w-8 h-8 ${gateway.color} rounded-lg flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3`}>
                                <gateway.icon className="w-5 h-5 text-white" />
                              </div>
                              <span className={`font-persian text-sm font-medium ${
                                selectedPaymentType === gateway.id ? 'text-stone-800' : 'text-stone-700'
                              }`}>
                                {gateway.name}
                              </span>
                              {selectedPaymentType === gateway.id && (
                                <div className="ml-auto rtl:ml-0 rtl:mr-auto w-2 h-2 bg-stone-600 rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCheckoutClick}
                  disabled={checkoutLoading || loading}
                  className="w-full bg-stone-800 text-white py-4 rounded-2xl hover:bg-stone-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-6 font-persian disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {checkoutLoading || loading ? (language === 'fa' ? 'در حال پردازش...' : 'Processing...') : t.cart.checkout}
                </button>

                <button
                  onClick={onContinueShopping}
                  className="w-full bg-neutral-200 text-stone-800 py-3 rounded-2xl hover:bg-neutral-300 transition-all duration-300 font-semibold mt-4 font-persian"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Form Modal */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="text-2xl font-bold text-stone-800 font-persian">
                {language === 'fa' ? 'اطلاعات ارسال' : 'Shipping Information'}
              </h2>
              <button
                onClick={() => setShowCheckoutForm(false)}
                className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              {/* Fill from Profile Button */}
              {user && (user.address || user.phone) && (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={handleFillFromProfile}
                    className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm font-persian"
                  >
                    <User className="w-4 h-4" />
                    <span>{t.cart.fillFromProfile}</span>
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2 font-persian">
                  {language === 'fa' ? 'آدرس' : 'Address'}
                </label>
                <textarea
                  value={shippingData.address}
                  onChange={(e) => handleShippingInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all font-persian"
                  placeholder={language === 'fa' ? 'آدرس کامل خود را وارد کنید' : 'Enter your full address'}
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2 font-persian">
                  {language === 'fa' ? 'شهر' : 'City'}
                </label>
                <input
                  type="text"
                  value={shippingData.city}
                  onChange={(e) => handleShippingInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all font-persian"
                  placeholder={language === 'fa' ? 'شهر' : 'City'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2 font-persian">
                  {language === 'fa' ? 'کد پستی' : 'Postal Code'}
                </label>
                <input
                  type="text"
                  value={shippingData.postal_code}
                  onChange={(e) => handleShippingInputChange('postal_code', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                  placeholder={language === 'fa' ? 'کد پستی' : 'Postal Code'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2 font-persian">
                  {language === 'fa' ? 'شماره تلفن' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={shippingData.phone}
                  onChange={(e) => handleShippingInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                  placeholder={language === 'fa' ? 'شماره تلفن' : 'Phone Number'}
                  required
                />
              </div>

              {checkoutError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-persian">
                  {checkoutError}
                </div>
              )}

              <div className="flex space-x-3 rtl:space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="flex-1 bg-neutral-200 text-stone-800 py-3 rounded-lg hover:bg-neutral-300 transition-colors font-persian"
                >
                  {language === 'fa' ? 'لغو' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="flex-1 bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-700 transition-colors font-persian disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? (language === 'fa' ? 'در حال پردازش...' : 'Processing...') : (language === 'fa' ? 'پرداخت' : 'Pay Now')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title={language === 'fa' ? 'تأیید خروج' : 'Confirm Logout'}
        message={language === 'fa' ? 'آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟' : 'Are you sure you want to logout from your account?'}
        confirmText={language === 'fa' ? 'خروج' : 'Logout'}
        cancelText={language === 'fa' ? 'لغو' : 'Cancel'}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isLoggingOut}
      />
    </div>
  );
};

export default Cart;