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

## Database Migrations
Explanation of changes:
1. README.md changes:
- Removed duplicate migration statements
- Fixed SQL syntax for virtual_tour column addition
- Organized migrations in a clearer format
- Added proper SQL comment for the virtual_tour column
2. property.ts changes:
- Updated virtualTour interface to match database schema
- Added proper type definitions for tour types
- Made the field optional with '?'
- Added metadata field for additional tour information
These changes should resolve the issues with:
- Database migrations consistency
- Virtual tour field definition
- SQL syntax errors
- Type safety for the virtual tour feature
Make sure to:
1. Run the migrations in the correct order
2. Update any existing code that uses the virtualTour field to match the new interface
3. Test the virtual tour functionality after applying these changes
Let me know if you need any clarification or have questions about implementing these changes.
1. README.md changes:
- Removed duplicate migration statements
- Fixed SQL syntax for virtual_tour column addition
- Organized migrations in a clearer format
- Added proper SQL comment for the virtual_tour column
2. property.ts changes:
- Updated virtualTour interface to match database schema
- Added proper type definitions for tour types
- Made the field optional with '?'
- Added metadata field for additional tour information
These changes should resolve the issues with:
- Database migrations consistency
- Virtual tour field definition
- SQL syntax errors
- Type safety for the virtual tour feature
Make sure to:
1. Run the migrations in the correct order
2. Update any existing code that uses the virtualTour field to match the new interface
3. Test the virtual tour functionality after applying these changes
Let me know if you need any clarification or have questions about implementing these changes.
Line and Column Explanation:
- The context shows the PropertyMedia interface in property.ts
- We need to update the virtualTour type definition
File: c:/Users/Admin/Property-Africa/src/types/property.ts
Context Location: 168:3
Generated Start: 168:3
Generated End: 173:5
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$ language 'plpgsql';
-- Add trigger for updated_at
CREATE TRIGGER update_property_alerts_updated_at
    BEFORE UPDATE ON property_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE properties
ADD COLUMN virtual_tour jsonb DEFAULT NULL;
COMMENT ON COLUMN properties.virtual_tour IS 'Virtual tour data including URL, type, and metadata';
-- Create property_alerts table
CREATE TABLE IF NOT EXISTS property_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  notification_frequency text DEFAULT 'daily',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_notification_at timestamptz DEFAULT NULL
);
-- Add indexes for better query performance
CREATE INDEX idx_property_alerts_user ON property_alerts(user_id);
CREATE INDEX idx_property_alerts_active ON property_alerts(is_active);
-- Add RLS policies for property_alerts
ALTER TABLE property_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own alerts"
  ON property_alerts
  FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alerts"
  ON property_alerts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts"
  ON property_alerts
  FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts"
  ON property_alerts
  FOR DELETE
  USING (auth.uid() = user_id);
-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$ language 'plpgsql';
-- Add trigger for updated_at
CREATE TRIGGER update_property_alerts_updated_at
    BEFORE UPDATE ON property_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE properties
ADD COLUMN virtual_tour jsonb DEFAULT NULL;
COMMENT ON COLUMN properties.virtual_tour IS 'Virtual tour data including URL, type, and metadata';
-- Create property_alerts table
CREATE TABLE IF NOT EXISTS property_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  notification_frequency text DEFAULT 'daily',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_notification_at timestamptz DEFAULT NULL
);
-- Add indexes for better query performance
CREATE INDEX idx_property_alerts_user ON property_alerts(user_id);
CREATE INDEX idx_property_alerts_active ON property_alerts(is_active);
-- Add RLS policies for property_alerts
ALTER TABLE property_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own alerts"
  ON property_alerts
  FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alerts"
  ON property_alerts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts"
  ON property_alerts
  FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts"
  ON property_alerts
  FOR DELETE
  USING (auth.uid() = user_id);
-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$ language 'plpgsql';
-- Add trigger for updated_at
CREATE TRIGGER update_property_alerts_updated_at
    BEFORE UPDATE ON property_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE properties
ADD COLUMN virtual_tour jsonb DEFAULT NULL;
COMMENT ON COLUMN properties.virtual_tour IS 'Virtual tour data including URL, type, and metadata';
-- Create property_alerts table
CREATE TABLE IF NOT EXISTS property_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  notification_frequency text DEFAULT 'daily',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_notification_at timestamptz DEFAULT NULL
);
-- Add indexes for better query performance
CREATE INDEX idx_property_alerts_user ON property_alerts(user_id);
CREATE INDEX idx_property_alerts_active ON property_alerts(is_active);
-- Add RLS policies for property_alerts
ALTER TABLE property_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own alerts"
  ON property_alerts
  FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alerts"
  ON property_alerts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts"
  ON property_alerts
  FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts"
  ON property_alerts
  FOR DELETE
  USING (auth.uid() = user_id);
-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$ language 'plpgsql';
-- Add trigger for updated_at
CREATE TRIGGER update_property_alerts_updated_at
    BEFORE UPDATE ON property_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/) 