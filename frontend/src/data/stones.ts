import { Stone } from '../types';

export const stones: Stone[] = [
  {
    id: '1',
    name: {
      en: 'Royal Onyx',
      fa: 'اونیکس سلطنتی'
    },
    category: {
      en: 'Onyx',
      fa: 'اونیکس'
    },
    description: {
      en: 'Luxurious translucent onyx with golden veining, perfect for backlit applications and premium interiors.',
      fa: 'اونیکس شفاف لوکس با رگه‌های طلایی، مناسب برای کاربردهای نورپردازی و فضاهای داخلی ممتاز.'
    },
    images: [
      'https://images.pexels.com/photos/6207358/pexels-photo-6207358.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7764983/pexels-photo-7764983.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    videos: ['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'],
    finishes: ['Polished', 'Honed', 'Brushed'],
    thickness: ['2cm', '3cm'],
    applications: ['Interior Walls', 'Countertops', 'Flooring'],
    specifications: { hardness: 'High', waterAbsorption: 'Low' },
    technicalData: {
      density: '2.7 g/cm³',
      porosity: '0.2%',
      compressiveStrength: '140 MPa',
      flexuralStrength: '15 MPa'
    },
    origin: 'Isfahan, Iran',
    price: '$85'
  },
  {
    id: '2',
    name: {
      en: 'Persian Travertine',
      fa: 'تراورتن پارسی'
    },
    category: {
      en: 'Travertine',
      fa: 'تراورتن'
    },
    description: {
      en: 'Classic beige travertine with natural patterns, ideal for both interior and exterior applications.',
      fa: 'تراورتن کلاسیک بژ با الگوهای طبیعی، مناسب برای کاربردهای داخلی و خارجی.'
    },
    images: [
      'https://images.pexels.com/photos/6207329/pexels-photo-6207329.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7768197/pexels-photo-7768197.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    finishes: ['Natural', 'Filled', 'Honed'],
    thickness: ['2cm', '3cm', '5cm'],
    applications: ['Flooring', 'Wall Cladding', 'Exterior Facades'],
    specifications: { hardness: 'Medium', waterAbsorption: 'Medium' },
    technicalData: {
      density: '2.5 g/cm³',
      porosity: '5%',
      compressiveStrength: '90 MPa',
      flexuralStrength: '8 MPa'
    },
    origin: 'Mahallat, Iran',
    price: '$65'
  },
  {
    id: '3',
    name: {
      en: 'Silver Marble',
      fa: 'مرمر نقره‌ای'
    },
    category: {
      en: 'Marble',
      fa: 'مرمر'
    },
    description: {
      en: 'Elegant silver-gray marble with subtle white veining, perfect for modern architectural designs.',
      fa: 'مرمر نقره‌ای زیبا با رگه‌های ظریف سفید، مناسب برای طراحی‌های معماری مدرن.'
    },
    images: [
      'https://images.pexels.com/photos/6207347/pexels-photo-6207347.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7768198/pexels-photo-7768198.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    finishes: ['Polished', 'Honed', 'Leathered'],
    thickness: ['2cm', '3cm'],
    applications: ['Countertops', 'Bathroom Vanities', 'Feature Walls'],
    specifications: { hardness: 'High', waterAbsorption: 'Very Low' },
    technicalData: {
      density: '2.8 g/cm³',
      porosity: '1%',
      compressiveStrength: '120 MPa',
      flexuralStrength: '12 MPa'
    },
    origin: 'Kerman, Iran',
    price: '$95'
  }
];