import React from 'react';
import { ArrowLeft, ArrowRight, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import { useCart } from '../hooks/useCart';

interface CartProps {
  onBack: () => void;
}

const Cart: React.FC<CartProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useCart();

  console.log('Cart component rendered. Cart items:', cartItems);
  console.log('Cart items count:', getCartItemsCount());

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {t.cart.continueShopping}
          </button>

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
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {t.cart.continueShopping}
        </button>

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
  );
};

export default Cart;