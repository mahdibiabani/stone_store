import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import React from 'react';
import { stones } from '../data/stones';
import { translations } from '../data/translations';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import { Stone } from '../types';
import ProductCard from './ProductCard';

interface ProductsSectionProps {
  onViewProduct: (stone: Stone) => void;
  onViewAllProducts: () => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ onViewProduct, onViewAllProducts }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const { getCartItemsCount, addToCart } = useCart();


  const handleAddToCart = (stone: Stone) => {
    console.log('ProductsSection handleAddToCart called for:', stone.name[language]);
    addToCart(stone, 1);
    console.log('addToCart function called');
  };
  return (
    <section id="products" className="py-20 bg-gradient-to-b from-warm-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 font-persian">
            {t.products.title}
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto font-persian">
            {language === 'fa'
              ? 'مجموعه‌ای از بهترین و منحصربه‌فردترین سنگ‌های طبیعی ایران برای پروژه‌های معماری شما'
              : 'Discover our curated collection of premium Iranian natural stones for your architectural projects'
            }
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stones.map((stone) => (
            <ProductCard
              key={stone.id}
              stone={stone}
              onViewDetails={onViewProduct}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={onViewAllProducts}
            className="inline-flex items-center px-8 py-4 bg-stone-800 text-white rounded-2xl hover:bg-stone-700 transition-all duration-300 font-semibold text-lg group transform hover:-translate-y-1 shadow-lg hover:shadow-xl font-persian"
          >
            {t.products.viewAll}
            {language === 'fa' ? (
              <ArrowLeft className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>


        {/* Cart Items Counter */}
        {getCartItemsCount() > 0 && (
          <div className="fixed bottom-20 right-6 rtl:right-auto rtl:left-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-40">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold font-persian">
                {language === 'fa'
                  ? `${getCartItemsCount()} محصول در سبد خرید`
                  : `${getCartItemsCount()} items in cart`
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;