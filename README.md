# Property Africa

A modern real estate platform focused on the East African market, particularly Uganda. This application allows users to search for properties, view details, and make payments using both card payments and mobile money.

## Environment Setup

This project uses environment variables for configuration. Follow these steps to set up:

1. Copy `.env.local.example` to `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. Update the values in `.env.local` with your actual Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Never commit `.env.local` to version control - it contains sensitive information.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Features

- Property Search: Dynamic search with filters for location, property type, price range, and amenities
- AI Recommendations: Personalized property recommendations based on user preferences
- User Authentication: Secure login and signup functionality
- Currency Conversion: Automatic currency detection and conversion based on user location
- Payment Integration: Support for both Stripe card payments and mobile money payments
- Responsive Design: Modern UI that works on all devices

## Security Best Practices

- Never share API keys, tokens, or credentials in public repositories
- Always use environment variables for sensitive information
- Rotate credentials if they've been accidentally exposed
- Implement proper authorization checks on both client and server
