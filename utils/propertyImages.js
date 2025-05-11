/**
 * Property Images Utility
 *
 * This file provides a collection of placeholder property images for development purposes.
 * These will eventually be replaced with actual property images from the database.
 */

// Collection of high-quality property image URLs from Unsplash
const propertyImageCollection = [
  // Luxury Homes and Apartments
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",

  // Modern Apartments
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",

  // African-Specific Properties
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",

  // Commercial Properties
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556784344-ad913a7b246e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1577979749830-f1d742b96791?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
];

// Interior Images
const interiorImageCollection = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1616137466211-f939a420be84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1616137466211-45786d00e702?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1604709177225-055f99402ea3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1617104678098-de229db51175?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1616486701797-eb4d6c2f8854?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1616486029436-b1619930cea8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
];

// Payment Icons
const paymentIcons = {
  visa: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png",
  mastercard:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png",
  amex: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/800px-American_Express_logo_%282018%29.svg.png",
  mtnMobileMoney:
    "https://upload.wikimedia.org/wikipedia/en/thumb/9/93/MTN_Logo.svg/800px-MTN_Logo.svg.png",
  airtelMoney:
    "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Airtel_logo.svg/800px-Airtel_logo.svg.png",
  mpesa:
    "https://upload.wikimedia.org/wikipedia/en/thumb/6/66/M-PESA_LOGO-01.svg/800px-M-PESA_LOGO-01.svg.png",
};

// Logo
const logos = {
  propertyAfrica:
    "https://via.placeholder.com/180x40/0658c2/ffffff?text=Property+Africa",
  propertyAfricaWhite:
    "https://via.placeholder.com/180x40/0658c2/ffffff?text=Property+Africa",
};

// Get a random image from the collection
const getRandomPropertyImage = () => {
  const randomIndex = Math.floor(
    Math.random() * propertyImageCollection.length,
  );
  return propertyImageCollection[randomIndex];
};

// Get a random interior image
const getRandomInteriorImage = () => {
  const randomIndex = Math.floor(
    Math.random() * interiorImageCollection.length,
  );
  return interiorImageCollection[randomIndex];
};

// Get a specific number of unique random property images
const getMultipleRandomPropertyImages = (count) => {
  const shuffled = [...propertyImageCollection].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a complete random property with image
const generateRandomProperty = (id) => {
  const propertyTypes = ["Apartment", "House", "Villa", "Commercial", "Land"];
  const locations = [
    "Kampala, Uganda",
    "Entebbe, Uganda",
    "Jinja, Uganda",
    "Nairobi, Kenya",
    "Mombasa, Kenya",
    "Dar es Salaam, Tanzania",
  ];

  const getRandomPrice = () => {
    const basePrice = Math.floor(Math.random() * 900) + 100; // 100 to 999
    return {
      UGX: `${basePrice * 3.7},000,000`,
      USD: `${basePrice},000`,
      EUR: `${Math.floor(basePrice * 0.9)},000`,
    };
  };

  return {
    id,
    title: `${["Luxury", "Modern", "Spacious", "Elegant", "Cozy"][Math.floor(Math.random() * 5)]} ${propertyTypes[Math.floor(Math.random() * propertyTypes.length)]}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    price: getRandomPrice(),
    bedrooms: Math.floor(Math.random() * 5) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
    area: `${Math.floor(Math.random() * 300) + 100} m²`,
    image: getRandomPropertyImage(),
    featured: Math.random() > 0.7, // 30% chance of being featured
  };
};

// Generate a complete list of random properties
const generateRandomProperties = (count) => {
  return Array.from({ length: count }, (_, i) => generateRandomProperty(i + 1));
};

export {
  getRandomPropertyImage,
  getRandomInteriorImage,
  getMultipleRandomPropertyImages,
  generateRandomProperty,
  generateRandomProperties,
  paymentIcons,
  logos,
};
