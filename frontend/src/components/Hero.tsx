import React from 'react';
import { ArrowRight, Play, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const Hero: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section id="hero" className="relative bg-gradient-to-br from-warm-50 to-warm-100 overflow-hidden min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-warm-200 text-stone-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-stone-600 rounded-full mr-2 rtl:mr-0 rtl:ml-2"></div>
              {language === 'fa' ? 'تولیدکننده معتبر سنگ طبیعی' : 'Premium Natural Stone Supplier'}
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-stone-800 leading-tight font-persian">
                {t.hero.title}
              </h1>
              <p className="text-xl text-stone-600 leading-relaxed font-persian">
                {t.hero.subtitle}
              </p>
              <p className="text-lg text-stone-500 font-persian">
                {t.hero.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector('#products');
                  if (element) {
                    element.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className="inline-flex items-center justify-center px-8 py-4 bg-stone-800 text-warm-50 rounded-xl hover:bg-stone-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl group transform hover:-translate-y-1"
              >
                {t.hero.cta}
                {language === 'fa' ? (
                  <ArrowLeft className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </a>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-stone-800 border-2 border-warm-200 rounded-xl hover:border-stone-300 hover:bg-warm-50 transition-all duration-300 font-semibold text-lg group transform hover:-translate-y-1">
                <Play className="mr-2 rtl:mr-0 rtl:ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                {t.hero.watchVideo}
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative bg-white rounded-4xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-700">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-warm-200 to-warm-300">
                <img
                  src="https://images.pexels.com/photos/6207358/pexels-photo-6207358.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Medusa Stone Sample"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-stone-800 text-lg font-persian">Medusa Stone</h3>
                <p className="text-stone-600 text-sm font-persian">
                  {language === 'fa' ? 'کیفیت برتر زندگی' : 'A Higher Quality of Living'}
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-warm-300 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-stone-300 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;