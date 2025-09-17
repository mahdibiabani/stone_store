import React from 'react';
import { Award, Users, Globe } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import { toPersianNumbers } from '../utils/numberFormat';

const AboutSection: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const stats = [
    {
      icon: Award,
      value: '35+',
      label: t.about.experience
    },
    {
      icon: Users,
      value: '500+',
      label: t.about.projects
    },
    {
      icon: Globe,
      value: '25+',
      label: t.about.countries
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-warm-100 to-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-stone-800 font-persian">
                {t.about.title}
              </h2>
              <p className="text-xl text-stone-600 leading-relaxed font-persian">
                {t.about.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-stone-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transform hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-warm-50" />
                  </div>
                  <div className="text-3xl font-bold text-stone-800 mb-1">
                    {language === 'fa' ? toPersianNumbers(stat.value) : stat.value}
                  </div>
                  <div className="text-sm text-stone-600 font-medium font-persian">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector('#contact');
                  if (element) {
                    element.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className="inline-flex items-center px-8 py-4 bg-stone-800 text-white rounded-2xl hover:bg-stone-700 transition-all duration-300 font-semibold text-lg transform hover:-translate-y-1 shadow-lg hover:shadow-xl font-persian"
              >
                {language === 'fa' ? 'بیشتر بدانید' : 'Learn More'}
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-4xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src="https://images.pexels.com/photos/6207329/pexels-photo-6207329.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Stone extraction"
                    className="w-full h-32 object-cover rounded-2xl"
                  />
                </div>
                <div className="bg-white rounded-4xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src="https://images.pexels.com/photos/7768197/pexels-photo-7768197.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Processing facility"
                    className="w-full h-40 object-cover rounded-2xl"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white rounded-4xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src="https://images.pexels.com/photos/7768198/pexels-photo-7768198.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Quality control"
                    className="w-full h-40 object-cover rounded-2xl"
                  />
                </div>
                <div className="bg-white rounded-4xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src="https://images.pexels.com/photos/6207347/pexels-photo-6207347.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Finished products"
                    className="w-full h-32 object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-warm-300 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-stone-300 rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;