-- Create properties table
CREATE TABLE properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'UGX',
    property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'land', 'commercial', 'condo')),
    status TEXT NOT NULL CHECK (status IN ('available', 'sold', 'rented', 'pending')) DEFAULT 'available',
    location JSONB NOT NULL,
    features JSONB,
    bedrooms INTEGER,
    bathrooms INTEGER,
    size DECIMAL(10,2),
    year_built INTEGER,
    images TEXT[],
    documents JSONB,
    verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Properties are viewable by everyone"
    ON properties FOR SELECT
    USING (true);

CREATE POLICY "Agents can insert properties"
    ON properties FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('agent', 'admin')
        )
    );

CREATE POLICY "Owners can update their properties"
    ON properties FOR UPDATE
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 