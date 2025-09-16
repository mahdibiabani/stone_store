import React from 'react';
import { Plus, FileText, MapPin, Eye } from 'lucide-react';
import { Stone } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

interface ProductCardProps {
  stone: Stone;
  onAddToQuote?: (stone: Stone) => void;
  onViewDetails: (stone: Stone) => void;
  onAddToCart: (stone: Stone) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ stone, onAddToQuote, onViewDetails, onAddToCart }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('ProductCard handleAddToCart called for:', stone.name[language]);
    onAddToCart(stone);
  };

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToQuote) {
      onAddToQuote(stone);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(stone);
  };
  return (
    <div 
      className="bg-white rounded-4xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 cursor-pointer"
      onClick={() => onViewDetails(stone)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-4xl">
        <img
          src={stone.images[0]}
          alt={stone.name[language]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex flex-col space-y-2">
          <button
            onClick={handleAddToCart}
            className="bg-white/90 backdrop-blur-sm text-stone-700 p-3 rounded-full hover:bg-stone-100 hover:text-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
            title={language === 'fa' ? 'افزودن به سبد خرید' : 'Add to Cart'}
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={handleViewDetails}
            className="bg-white/90 backdrop-blur-sm text-stone-700 p-3 rounded-full hover:bg-stone-100 hover:text-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
            title={language === 'fa' ? 'مشاهده جزئیات' : 'View Details'}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
        
        {/* Curved bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-white rounded-t-full"></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 relative -mt-8 z-10">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-stone-800 font-persian text-center">{stone.name[language]}</h3>
          <p className="text-stone-600 text-sm line-clamp-2 font-persian text-center">{stone.description[language]}</p>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-center">
          <div className="flex items-center text-sm text-stone-500">
            <FileText className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            <span className="font-persian">{language === 'fa' ? 'دسته‌بندی' : 'Category'}: {stone.category[language]}</span>
          </div>
          <div className="flex items-center text-sm text-stone-500">
            <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            <span className="font-persian">{language === 'fa' ? 'منشاء' : 'Origin'}: {stone.origin}</span>
          </div>
          {stone.price && (
            <div className="text-lg font-bold text-stone-800 font-persian">
              {stone.price}/m²
            </div>
          )}
        </div>

        {/* Technical Data Preview */}
        <div className="bg-warm-50 rounded-2xl p-4">
          <h4 className="text-sm font-semibold text-stone-700 mb-2 font-persian text-center">
            {language === 'fa' ? 'مشخصات فنی' : 'Technical Data'}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
            <div className="font-persian">Density: {stone.technicalData.density}</div>
            <div className="font-persian">Porosity: {stone.technicalData.porosity}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleAddToCart}
            className="bg-stone-800 text-white py-3 rounded-2xl hover:bg-stone-700 transition-all duration-300 font-semibold font-persian transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            {language === 'fa' ? 'افزودن به سبد' : 'Add to Cart'}
          </button>
          <button
            onClick={handleViewDetails}
            className="bg-neutral-200 text-stone-800 py-3 rounded-2xl hover:bg-neutral-300 transition-all duration-300 font-semibold font-persian transform hover:-translate-y-1"
          >
            {language === 'fa' ? 'مشاهده جزئیات' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;