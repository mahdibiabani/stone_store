import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart, Plus, Minus, Play, X } from 'lucide-react';
import { Stone } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import { useCart } from '../hooks/useCart';

interface ProductDetailProps {
  stone: Stone;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ stone, onBack }) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const t = translations[language];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedThickness, setSelectedThickness] = useState('');
  const [notes, setNotes] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  const finishes = ['Polished', 'Honed', 'Brushed', 'Sandblasted'];
  const thicknesses = ['2cm', '3cm', '4cm', '5cm'];

  const handleAddToCart = () => {
    addToCart(stone, quantity, {
      finish: selectedFinish,
      thickness: selectedThickness,
      notes
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center text-stone-600 hover:text-stone-800 mb-8 transition-colors font-persian"
        >
          {language === 'fa' ? (
            <ArrowRight className="w-5 h-5 ml-2" />
          ) : (
            <ArrowLeft className="w-5 h-5 mr-2" />
          )}
          {t.productDetail.backToProducts}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-4xl overflow-hidden shadow-lg">
              <img
                src={stone.images[selectedImage]}
                alt={stone.name[language]}
                className="w-full h-full object-cover"
              />
              {stone.video && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg"
                >
                  <Play className="w-6 h-6 text-stone-700" />
                </button>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4 rtl:space-x-reverse">
              {stone.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-stone-600 shadow-lg' 
                      : 'border-transparent hover:border-stone-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${stone.name[language]} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-stone-800 font-persian">
                {stone.name[language]}
              </h1>
              <p className="text-xl text-stone-600 font-persian">
                {stone.category[language]}
              </p>
              <p className="text-3xl font-bold text-stone-800">
                {stone.price}/m²
              </p>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-stone-800 font-persian">
                {t.productDetail.description}
              </h3>
              <p className="text-stone-600 leading-relaxed font-persian">
                {stone.description[language]}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-6">
              {/* Finish Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 font-persian">
                  {t.productDetail.selectFinish}
                </label>
                <select
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-stone-500 focus:border-transparent font-persian"
                >
                  <option value="">{t.productDetail.selectFinish}</option>
                  {finishes.map((finish) => (
                    <option key={finish} value={finish}>{finish}</option>
                  ))}
                </select>
              </div>

              {/* Thickness Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 font-persian">
                  {t.productDetail.selectThickness}
                </label>
                <select
                  value={selectedThickness}
                  onChange={(e) => setSelectedThickness(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-stone-500 focus:border-transparent font-persian"
                >
                  <option value="">{t.productDetail.selectThickness}</option>
                  {thicknesses.map((thickness) => (
                    <option key={thickness} value={thickness}>{thickness}</option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 font-persian">
                  {t.productDetail.quantity} (m²)
                </label>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-neutral-200 rounded-xl flex items-center justify-center hover:bg-neutral-300 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-semibold text-stone-800 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-neutral-200 rounded-xl flex items-center justify-center hover:bg-neutral-300 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 font-persian">
                  {t.productDetail.notes}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none font-persian"
                  placeholder={t.productDetail.notes}
                />
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-stone-800 text-white py-4 rounded-2xl hover:bg-stone-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 rtl:space-x-reverse transform hover:-translate-y-1 font-persian"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>{t.productDetail.addToCart}</span>
            </button>

            {/* Technical Specifications */}
            <div className="bg-white rounded-4xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-stone-800 mb-4 font-persian">
                {t.productDetail.specifications}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-persian">
                  <span className="text-stone-500">Density:</span>
                  <span className="text-stone-800 ml-2 rtl:ml-0 rtl:mr-2">{stone.technicalData.density}</span>
                </div>
                <div className="font-persian">
                  <span className="text-stone-500">Porosity:</span>
                  <span className="text-stone-800 ml-2 rtl:ml-0 rtl:mr-2">{stone.technicalData.porosity}</span>
                </div>
                <div className="font-persian">
                  <span className="text-stone-500">Compressive:</span>
                  <span className="text-stone-800 ml-2 rtl:ml-0 rtl:mr-2">{stone.technicalData.compressiveStrength}</span>
                </div>
                <div className="font-persian">
                  <span className="text-stone-500">Flexural:</span>
                  <span className="text-stone-800 ml-2 rtl:ml-0 rtl:mr-2">{stone.technicalData.flexuralStrength}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {showVideo && stone.video && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-4xl overflow-hidden max-w-4xl w-full">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <video
                src={stone.video}
                controls
                autoPlay
                className="w-full aspect-video"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;