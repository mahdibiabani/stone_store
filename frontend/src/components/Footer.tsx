import React from 'react';
import { Mountain, Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const quickLinks = [
    { key: 'home', href: '#hero' },
    { key: 'products', href: '#products' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-warm-400 p-2 rounded-lg">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-persian">
                  {language === 'fa' ? 'سنگ مدوسا' : 'Medusa Stone'}
                </h3>
                <p className="text-stone-400 text-sm font-persian">
                  {language === 'fa' ? 'کیفیت برتر زندگی' : 'A Higher Quality of Living'}
                </p>
              </div>
            </div>
            <p className="text-stone-300 leading-relaxed font-persian">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold font-persian">{t.footer.quickLinks}</h4>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(link.href);
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }}
                  className="block text-stone-300 hover:text-warm-400 transition-colors font-persian"
                >
                  {t.nav[link.key as keyof typeof t.nav]}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold font-persian">{t.footer.contact}</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-stone-300">
                <Mail className="w-5 h-5 text-warm-400" />
                <span className="font-persian">info@medusastone.com</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-stone-300">
                <Phone className="w-5 h-5 text-warm-400" />
                <span className="font-persian">+98 21 1234 5678</span>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse text-stone-300">
                <MapPin className="w-5 h-5 text-warm-400 mt-1 flex-shrink-0" />
                <span className="font-persian">
                  {language === 'fa' 
                    ? 'تهران، ایران - صادرکننده سنگ طبیعی'
                    : 'Tehran, Iran - Natural Stone Exporter'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold font-persian">{t.footer.followUs}</h4>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="bg-stone-700 p-3 rounded-lg hover:bg-warm-600 transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            {/* Developer Credit */}
            <div className="pt-4 border-t border-stone-700">
              <p className="text-stone-400 text-sm font-persian">
                {language === 'fa' 
                  ? 'طراحی و توسعه توسط مینا وب'
                  : 'Designed & Developed by MinaWeb'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-stone-400 text-sm font-persian">
            © 2025 {language === 'fa' ? 'سنگ مدوسا' : 'Medusa Stone'}. 
            {language === 'fa' ? ' تمامی حقوق محفوظ است.' : ' All rights reserved.'}
          </p>
          <p className="text-stone-400 text-sm mt-4 md:mt-0 font-persian">
            {language === 'fa' 
              ? 'ساخته شده با ❤️ در ایران'
              : 'Made with ❤️ in Iran'
            }
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;