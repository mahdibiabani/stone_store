// Persian number formatting utilities

// Convert English digits to Persian digits
export const toPersianNumbers = (text: string | number): string => {
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let result = text.toString();
  
  for (let i = 0; i < englishDigits.length; i++) {
    result = result.replace(new RegExp(englishDigits[i], 'g'), persianDigits[i]);
  }
  
  return result;
};

// Convert Persian digits to English digits (for calculations)
export const toEnglishNumbers = (text: string): string => {
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let result = text;
  
  for (let i = 0; i < persianDigits.length; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
  }
  
  return result;
};

// Format price with proper currency and localization
export const formatPrice = (price: string | number, language: 'en' | 'fa', currency: 'USD' | 'IRR' = 'USD'): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;
  
  if (isNaN(numericPrice)) return language === 'fa' ? 'قیمت نامشخص' : 'Price TBD';
  
  if (language === 'fa') {
    if (currency === 'USD') {
      // Convert USD to approximate IRR (this should ideally come from an API)
      const irrPrice = Math.round(numericPrice * 42000); // Approximate conversion rate
      const formattedPrice = new Intl.NumberFormat('fa-IR').format(irrPrice);
      return `${toPersianNumbers(formattedPrice)} تومان`;
    } else {
      const formattedPrice = new Intl.NumberFormat('fa-IR').format(numericPrice);
      return `${toPersianNumbers(formattedPrice)} تومان`;
    }
  } else {
    if (currency === 'USD') {
      return `$${numericPrice.toFixed(2)}`;
    } else {
      const usdPrice = numericPrice / 42000; // Convert IRR to USD
      return `$${usdPrice.toFixed(2)}`;
    }
  }
};

// Format quantity with Persian numbers when needed
export const formatQuantity = (quantity: number, language: 'en' | 'fa'): string => {
  if (language === 'fa') {
    return toPersianNumbers(quantity.toString());
  }
  return quantity.toString();
};

// Format technical specifications with Persian numbers
export const formatTechnicalValue = (value: string | number, language: 'en' | 'fa'): string => {
  const stringValue = value.toString();
  
  if (language === 'fa') {
    return toPersianNumbers(stringValue);
  }
  
  return stringValue;
};

// Get localized unit text
export const getLocalizedUnit = (unit: string, language: 'en' | 'fa'): string => {
  const unitTranslations: Record<string, { en: string; fa: string }> = {
    'm²': { en: 'm²', fa: 'متر مربع' },
    'm2': { en: 'm²', fa: 'متر مربع' },
    'sqm': { en: 'm²', fa: 'متر مربع' },
    'mm': { en: 'mm', fa: 'میلی‌متر' },
    'cm': { en: 'cm', fa: 'سانتی‌متر' },
    'm': { en: 'm', fa: 'متر' },
    'kg/m³': { en: 'kg/m³', fa: 'کیلوگرم بر متر مکعب' },
    'MPa': { en: 'MPa', fa: 'مگاپاسکال' },
    '%': { en: '%', fa: 'درصد' }
  };

  const translation = unitTranslations[unit];
  if (translation) {
    return translation[language];
  }
  
  // If no translation found, return as-is but convert numbers if Persian
  return language === 'fa' ? toPersianNumbers(unit) : unit;
};

// Format price with unit (e.g., "$85/m²" or "۳,۵۷۰,۰۰۰ تومان/متر مربع")
export const formatPriceWithUnit = (price: string | number, language: 'en' | 'fa', unit: string = 'm²', currency: 'USD' | 'IRR' = 'USD'): string => {
  const formattedPrice = formatPrice(price, language, currency);
  const localizedUnit = getLocalizedUnit(unit, language);
  
  return `${formattedPrice}/${localizedUnit}`;
};

// Format number with thousand separators
export const formatNumber = (num: number, language: 'en' | 'fa'): string => {
  if (language === 'fa') {
    const formatted = new Intl.NumberFormat('fa-IR').format(num);
    return toPersianNumbers(formatted);
  } else {
    return new Intl.NumberFormat('en-US').format(num);
  }
};
