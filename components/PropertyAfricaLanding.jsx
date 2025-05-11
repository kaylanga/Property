import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchIcon, LocationMarkerIcon, CurrencyDollarIcon, ChipIcon, UserIcon, CreditCardIcon, DeviceMobileIcon } from '@heroicons/react/outline';
import { generateRandomProperties, paymentIcons, logos } from '../utils/propertyImages';

export default function PropertyAfricaLanding() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currency, setCurrency] = useState('UGX');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  // Load random properties on component mount
  useEffect(() => {
    // Generate 6 random properties for featured listings
    const randomProperties = generateRandomProperties(6);

    // Set the first 3 as featured properties
    setFeaturedProperties(randomProperties.slice(0, 3).map(prop => ({
      ...prop,
      featured: true
    })));

    // Set the next 2 as AI recommendations with match scores
    setAiRecommendations(randomProperties.slice(3, 5).map((prop, idx) => ({
      ...prop,
      matchScore: idx === 0 ? 95 : 87
    })));
  }, []);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header/Navigation */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
              <Image
                src={logos.propertyAfrica}
                alt="Property Africa Logo"
                width={180}
                height={40}
                className="mr-2"
              />
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/properties" className="text-gray-700 hover:text-blue-600 font-medium">Properties</Link>
            <Link href="/agents" className="text-gray-700 hover:text-blue-600 font-medium">Agents</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="bg-gray-100 text-gray-800 rounded-md px-2 py-1 border border-gray-300"
            >
              <option value="UGX">UGX</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

            {isAuthenticated ? (
              <div className="flex items-center">
                <button className="bg-gray-100 p-2 rounded-full">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="relative bg-blue-700 text-white py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1596005554384-d293674c91d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                alt="Kampala Skyline"
                layout="fill"
                objectFit="cover"
                className="opacity-20"
              />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Find Your Dream Property in East Africa</h1>
            <p className="text-xl mb-8">Discover the finest homes, apartments, and commercial properties in Uganda and across East Africa</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by location, property type, or keyword"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <SearchIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <div>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Price Range</option>
                  <option value="range1">Under 100M UGX</option>
                  <option value="range2">100M - 300M UGX</option>
                  <option value="range3">300M - 500M UGX</option>
                  <option value="range4">Over 500M UGX</option>
                </select>
              </div>

              <div>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Bedrooms</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div className="md:col-span-4">
                <button className="w-full md:w-auto float-right bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                  Search Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <Link href="/properties" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                currency={currency}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">AI-Powered Recommendations</h2>
              <p className="text-gray-600 mt-2">Properties personalized to your preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiRecommendations.map(property => (
              <div key={property.id} className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="md:w-2/5 relative h-56 md:h-auto">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                    {property.matchScore}% Match
                  </div>
                </div>

                <div className="md:w-3/5 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <LocationMarkerIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span>{property.location}</span>
                  </div>

                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {currency === 'UGX' && <span>UGX {property.price.UGX}</span>}
                    {currency === 'USD' && <span>${property.price.USD}</span>}
                    {currency === 'EUR' && <span>€{property.price.EUR}</span>}
                  </div>

                  <div className="flex justify-between border-t border-gray-100 pt-4 mb-6">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span className="text-gray-600">{property.bedrooms} bd</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011-1h8a1 1 0 011 1v1h1a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h1V2a1 1 0 011-1zm11 1H4a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{property.bathrooms} ba</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{property.area}</span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Link href={`/properties/${property.id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors">
                      View Details
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Flexible Payment Options</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <CreditCardIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Card Payments</h3>
              <p className="text-gray-600 text-center mb-6">Securely pay using international credit and debit cards via Stripe.</p>
              <div className="flex space-x-4">
                <Image src={paymentIcons.visa} alt="Visa" width={60} height={40} />
                <Image src={paymentIcons.mastercard} alt="Mastercard" width={60} height={40} />
                <Image src={paymentIcons.amex} alt="American Express" width={60} height={40} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <DeviceMobileIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mobile Money</h3>
              <p className="text-gray-600 text-center mb-6">Pay using local mobile money options for seamless transactions.</p>
              <div className="flex space-x-4">
                <Image src={paymentIcons.mtnMobileMoney} alt="MTN Mobile Money" width={60} height={40} />
                <Image src={paymentIcons.airtelMoney} alt="Airtel Money" width={60} height={40} />
                <Image src={paymentIcons.mpesa} alt="M-Pesa" width={60} height={40} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">Why Choose Property Africa</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-6">
                <SearchIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Search</h3>
              <p className="text-gray-600">Find your perfect property with our powerful search filters and location-based tools.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-6">
                <ChipIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Recommendations</h3>
              <p className="text-gray-600">Get personalized property suggestions based on your preferences and browsing history.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-6">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Currency Conversion</h3>
              <p className="text-gray-600">View property prices in multiple currencies for easier international comparisons.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">Join thousands of satisfied customers who have found their perfect home in East Africa.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/properties" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold">
              Browse Properties
            </Link>
            <Link href="/signup" className="bg-transparent border-2 border-white hover:bg-blue-800 px-8 py-3 rounded-lg font-bold">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <Image
                src={logos.propertyAfricaWhite}
                alt="Property Africa Logo"
                width={160}
                height={36}
                className="mb-4"
              />
              <p className="text-gray-400 mb-4">Your trusted real estate platform in East Africa.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/properties" className="text-gray-400 hover:text-white">Properties</Link></li>
                <li><Link href="/agents" className="text-gray-400 hover:text-white">Agents</Link></li>
                <li><Link href="/featured" className="text-gray-400 hover:text-white">Featured Listings</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Areas</h3>
              <ul className="space-y-2">
                <li><Link href="/properties/kampala" className="text-gray-400 hover:text-white">Kampala</Link></li>
                <li><Link href="/properties/entebbe" className="text-gray-400 hover:text-white">Entebbe</Link></li>
                <li><Link href="/properties/jinja" className="text-gray-400 hover:text-white">Jinja</Link></li>
                <li><Link href="/properties/nairobi" className="text-gray-400 hover:text-white">Nairobi</Link></li>
                <li><Link href="/properties/dar-es-salaam" className="text-gray-400 hover:text-white">Dar es Salaam</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Plot 45, Kampala Road, Kampala, Uganda</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+256 700 123 456</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@propertyafrica.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Property Africa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}