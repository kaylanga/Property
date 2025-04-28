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
  const type: PropertyType = ['apartment', 'house', 'condo', 'land', 'unfinished'][Math.floor(Math.random() * 5)] as PropertyType;
  const status: PropertyStatus = Math.random() > 0.3 ? 'for-sale' : 'for-rent';
  const city = cities[Math.floor(Math.random() * cities.length)];
  
  return {
    id: `prop-${index + 1}`,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} for ${status === 'for-rent' ? 'Rent' : 'Sale'} in ${city}`,
    description: `Beautiful ${type} located in ${city}. This property offers modern amenities and is perfect for ${status === 'for-rent' ? 'renting' : 'purchasing'}.`,
    type,
    status,
    price: getRandomPrice(type, status),
    currency: 'UGX',
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
      bedrooms: type !== 'land' ? Math.floor(Math.random() * 5) + 1 : undefined,
      bathrooms: type !== 'land' ? Math.floor(Math.random() * 3) + 1 : undefined,
      totalArea: Math.floor(Math.random() * 500) + 100,
      yearBuilt: type !== 'land' ? 2000 + Math.floor(Math.random() * 23) : undefined,
      floor: type === 'apartment' || type === 'condo' ? Math.floor(Math.random() * 10) + 1 : undefined,
      totalFloors: type === 'apartment' || type === 'condo' ? Math.floor(Math.random() * 15) + 5 : undefined,
      parkingSpaces: type !== 'land' ? Math.floor(Math.random() * 3) + 1 : undefined,
      amenities: getRandomAmenities()
    },
    images: [
      `https://source.unsplash.com/800x600/?${type},house`,
      `https://source.unsplash.com/800x600/?${type},interior`,
      `https://source.unsplash.com/800x600/?${type},exterior`
    ],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    agentId: `agent-${Math.floor(Math.random() * 10) + 1}`,
    isVerified: Math.random() > 0.2,
    isFeatured: Math.random() > 0.8
  };
}); 