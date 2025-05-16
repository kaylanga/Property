# Property Africa

A modern real estate platform focused on the East African market, particularly Uganda. This application allows users to search for properties, view details, and make payments using both card payments and mobile money.

## Features

- **Property Search**: Dynamic search with filters for location, property type, price range, and amenities
- **AI Recommendations**: Personalized property recommendations based on user preferences
- **User Authentication**: Secure login and signup functionality
- **Currency Conversion**: Automatic currency detection and conversion based on user location
- **Payment Integration**: Support for both Stripe card payments and mobile money payments
- **Responsive Design**: Modern UI that works on all devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database)
- **Payments**: Stripe, Mobile Money APIs
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account
- Stripe account (for card payments)
- Mobile Money API access (for mobile payments)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/property-africa.git
   cd property-africa
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key

   # Mobile Money API Keys
   MTN_MOBILE_MONEY_API_KEY=your_mtn_mobile_money_api_key
   MPESA_API_KEY=your_mpesa_api_key
   AIRTEL_MONEY_API_KEY=your_airtel_money_api_key
   TIGO_PESA_API_KEY=your_tigo_pesa_api_key

   # Application Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app`: Next.js app router pages and API routes
- `src/components`: React components
  - `auth`: Authentication components
  - `common`: Shared components
  - `layout`: Layout components
  - `payments`: Payment-related components
  - `properties`: Property-related components
- `src/data`: Mock data and data utilities
- `src/lib`: Utility functions and external service clients
- `src/types`: TypeScript type definitions

## Deployment

This application can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)
