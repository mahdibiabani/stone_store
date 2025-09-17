import { LogOut, Menu, Mountain, ShoppingCart, User, UserCircle, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../data/translations';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import ConfirmationModal from './ConfirmationModal';
import LanguageToggle from './LanguageToggle';

interface HeaderProps {
  onCartClick: () => void;
  onProfileClick?: () => void;
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onProfileClick, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth();

  const navItems = [
    { key: 'home', href: '#hero' },
    { key: 'products', href: '#products' },
    { key: 'projects', href: '#projects' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' }
  ];

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

  const handleLogout = () => {
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

  return (
    <header className="bg-warm-50/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-warm-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  if (element) {
                    element.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className="text-stone-700 hover:text-stone-800 transition-colors font-medium relative group"
              >
                {t.nav[item.key as keyof typeof t.nav]}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stone-800 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right side - Language toggle, Profile, Cart and CTA */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
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
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50">
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
            <a
              href="#quote"
              className="bg-stone-800 text-warm-50 px-6 py-2 rounded-lg hover:bg-stone-700 transition-colors font-medium"
            >
              {t.nav.quote}
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-800"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }}
                  className="text-stone-700 hover:text-amber-700 transition-colors font-medium px-2"
                >
                  {t.nav[item.key as keyof typeof t.nav]}
                </a>
              ))}
              <div className="flex items-center justify-between px-2 pt-4 border-t border-stone-200">
                <LanguageToggle />
                <button
                  onClick={() => {
                    handleProfileClick();
                    setIsMenuOpen(false);
                  }}
                  className="relative p-2 text-stone-600 hover:text-stone-800 transition-colors bg-white rounded-lg shadow-sm"
                >
                  {user ? (
                    <UserCircle className="w-6 h-6" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </button>
                <button
                  onClick={() => {
                    onCartClick();
                    setIsMenuOpen(false);
                  }}
                  className="relative p-2 text-stone-600 hover:text-stone-800 transition-colors bg-white rounded-lg shadow-sm"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
                <a
                  href="#quote"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    const element = document.querySelector('#quote');
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }}
                  className="bg-stone-800 text-warm-50 px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors font-medium"
                >
                  {t.nav.quote}
                </a>
              </div>
            </nav>
          </div>
        )}
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
    </header>
  );
};

export default Header;