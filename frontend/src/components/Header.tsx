import React, { useState } from 'react';
import { Menu, X, Mountain, ShoppingCart } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import { useCart } from '../hooks/useCart';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const { getCartItemsCount } = useCart();

  const navItems = [
    { key: 'home', href: '#hero' },
    { key: 'products', href: '#products' },
    { key: 'projects', href: '#projects' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' }
  ];

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

          {/* Right side - Language toggle and CTA */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageToggle />
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
                  onClick={() => setIsMenuOpen(false)}
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
                  onClick={() => setIsMenuOpen(false)}
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
    </header>
  );
};

export default Header;