import { Property, PropertyType, PropertyStatus, Currency, Amenity } from '../types/property';

// Helper function to generate random amenities
const getRandomAmenities = (): Amenity[] => {
  const allAmenities: Amenity[] = [
    'parking',
    'security',
    'swimming-pool',
    'gym',
    'garden',
    'furnished',
    'air-conditioning',
    'internet',
    'water-supply',
    'electricity',
    'fence',
    'gate'
  ];
  
  const count = Math.floor(Math.random() * 5) + 3; // 3-7 amenities
  const shuffled = [...allAmenities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to generate random price
const getRandomPrice = (type: PropertyType, status: PropertyStatus): number => {
  const basePrice = status === 'for-rent' ? 500 : 50000;
  const multiplier = Math.random() * 5 + 1;
  return Math.round(basePrice * multiplier);
};

// Cities in Uganda
const cities = [
  'Kampala',
  'Entebbe',
  'Jinja',
  'Mbarara',
  'Gulu',
  'Mbale',
  'Kasese',
  'Arua',
  'Soroti',
  'Masaka'
];

// Generate 50 properties
export const properties: Property[] = Array.from({ length: 50 }, (_, index) => {
  const type = PropertyType.HOUSE;
  const status: PropertyStatus = Math.random() > 0.3 ? 'for-sale' : 'for-rent';
  const city = cities[Math.floor(Math.random() * cities.length)] || 'Kampala';
  const amenities = getRandomAmenities();
  
  return {
    id: `prop-${index + 1}`,
    title: `${type} for ${status === 'for-rent' ? 'Rent' : 'Sale'} in ${city}`,
    description: `Beautiful ${type} located in ${city}. This property offers modern amenities and is perfect for ${status === 'for-rent' ? 'renting' : 'purchasing'}.`,
    type,
    price: getRandomPrice(type, status),
    currency: Currency.UGX,
    location: {
      city,
      district: `${city} District`,
      address: `${Math.floor(Math.random() * 100) + 1} ${['Main', 'Church', 'Market', 'School'][Math.floor(Math.random() * 4)]} Street`,
      coordinates: {
        latitude: 0.347596 + (Math.random() - 0.5) * 0.1,
        longitude: 32.582520 + (Math.random() - 0.5) * 0.1
      }
    },
    features: {
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      area: Math.floor(Math.random() * 500) + 100,
      yearBuilt: 2000 + Math.floor(Math.random() * 23),
      parking: Math.floor(Math.random() * 3) + 1,
      furnished: Math.random() > 0.5
    },
    amenities,
    images: [
      `https://source.unsplash.com/800x600/?house`,
      `https://source.unsplash.com/800x600/?interior`,
      `https://source.unsplash.com/800x600/?exterior`
    ],
    status: 'AVAILABLE',
    listingType: status === 'for-rent' ? 'RENT' : 'SALE',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: `owner-${Math.floor(Math.random() * 10) + 1}`,
    verified: Math.random() > 0.2,
    documents: [
      {
        title: 'Property Title',
        url: 'https://example.com/title.pdf',
        type: 'title_deed'
      }
    ],
    virtualTour: Math.random() > 0.7 ? 'https://example.com/virtual-tour' : undefined,
    propertyTax: Math.floor(Math.random() * 1000) + 500,
    maintenanceFee: Math.random() > 0.5 ? Math.floor(Math.random() * 200) + 100 : undefined,
    propertyCondition: ['new', 'excellent', 'good', 'fair', 'needs_renovation'][Math.floor(Math.random() * 5)] as Property['propertyCondition'],
    viewingAvailability: {
      days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      hours: '9:00 AM - 5:00 PM'
    }
  };
}); 