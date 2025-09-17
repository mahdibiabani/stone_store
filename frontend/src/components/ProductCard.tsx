import { Eye, FileText, MapPin } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Stone } from '../types';

interface ProductCardProps {
  stone: Stone;
  onViewDetails: (stone: Stone) => void;
  onAddToCart: (stone: Stone) => void;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ stone, onViewDetails, onAddToCart, viewMode = 'grid' }) => {
  const { language } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('ProductCard handleAddToCart called for:', stone.name[language]);
    onAddToCart(stone);
  };


  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(stone);
  };
  if (viewMode === 'list') {
    return (
      <div
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
        onClick={() => onViewDetails(stone)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
            <img
              src={stone.images[0]}
              alt={stone.name[language]}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex space-x-2 rtl:space-x-reverse">
              <button
                onClick={handleViewDetails}
                className="bg-white/90 backdrop-blur-sm text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-all duration-300 shadow-lg"
                title={language === 'fa' ? 'مشاهده جزئیات' : 'View Details'}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-stone-800 font-persian mb-2">{stone.name[language]}</h3>
                <p className="text-stone-600 text-sm mb-4 font-persian line-clamp-2">{stone.description[language]}</p>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-sm text-stone-500">
                    <FileText className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    <span className="font-persian">{language === 'fa' ? 'دسته‌بندی' : 'Category'}: {stone.category[language]}</span>
                  </div>
                  <div className="flex items-center text-sm text-stone-500">
                    <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    <span className="font-persian">{language === 'fa' ? 'منشاء' : 'Origin'}: {stone.origin}</span>
                  </div>
                </div>

                {/* Technical Data */}
                <div className="bg-warm-50 rounded-xl p-3 mb-4">
                  <h4 className="text-sm font-semibold text-stone-700 mb-2 font-persian">
                    {language === 'fa' ? 'مشخصات فنی' : 'Technical Data'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                    <div className="font-persian">Density: {stone.technicalData.density}</div>
                    <div className="font-persian">Porosity: {stone.technicalData.porosity}</div>
                    <div className="font-persian">Compressive: {stone.technicalData.compressiveStrength}</div>
                    <div className="font-persian">Flexural: {stone.technicalData.flexuralStrength}</div>
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                {stone.price && (
                  <div className="text-xl font-bold text-stone-800 font-persian">
                    {stone.price}/m²
                  </div>
                )}
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <button
                    onClick={handleAddToCart}
                    className="bg-stone-800 text-white px-6 py-2 rounded-xl hover:bg-stone-700 transition-all duration-300 font-semibold font-persian"
                  >
                    {language === 'fa' ? 'افزودن به سبد' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleViewDetails}
                    className="bg-neutral-200 text-stone-800 px-6 py-2 rounded-xl hover:bg-neutral-300 transition-all duration-300 font-semibold font-persian"
                  >
                    {language === 'fa' ? 'مشاهده جزئیات' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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