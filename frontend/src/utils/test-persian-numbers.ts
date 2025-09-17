// Test file to demonstrate Persian number formatting functionality
import { 
  toPersianNumbers, 
  formatPrice, 
  formatPriceWithUnit, 
  formatQuantity, 
  getLocalizedUnit,
  formatNumber
} from './numberFormat';

// Test cases
console.log('=== Persian Number Formatting Tests ===');

// Test basic number conversion
console.log('English to Persian numbers:');
console.log('123456 ->', toPersianNumbers('123456'));
console.log('$85.50 ->', toPersianNumbers('$85.50'));

// Test price formatting
console.log('\nPrice formatting:');
console.log('$85 in English:', formatPrice('85', 'en'));
console.log('$85 in Persian:', formatPrice('85', 'fa'));

// Test price with units
console.log('\nPrice with units:');
console.log('$85/m² in English:', formatPriceWithUnit('85', 'en'));
console.log('$85/m² in Persian:', formatPriceWithUnit('85', 'fa'));

// Test quantity formatting
console.log('\nQuantity formatting:');
console.log('Quantity 5 in English:', formatQuantity(5, 'en'));
console.log('Quantity 5 in Persian:', formatQuantity(5, 'fa'));

// Test unit localization
console.log('\nUnit localization:');
console.log('m² in English:', getLocalizedUnit('m²', 'en'));
console.log('m² in Persian:', getLocalizedUnit('m²', 'fa'));
console.log('mm in English:', getLocalizedUnit('mm', 'en'));
console.log('mm in Persian:', getLocalizedUnit('mm', 'fa'));

// Test number formatting with separators
console.log('\nNumber formatting:');
console.log('1234567 in English:', formatNumber(1234567, 'en'));
console.log('1234567 in Persian:', formatNumber(1234567, 'fa'));

export {};
