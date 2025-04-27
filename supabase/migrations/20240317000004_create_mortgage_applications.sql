-- Create mortgage_applications table
CREATE TABLE mortgage_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    monthly_income DECIMAL(12,2) NOT NULL,
    employment_status TEXT NOT NULL CHECK (employment_status IN ('employed', 'business_owner', 'self_employed')),
    employment_duration INTEGER NOT NULL,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    down_payment_percentage DECIMAL(5,2) NOT NULL,
    loan_term INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE mortgage_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own mortgage applications"
    ON mortgage_applications FOR SELECT
    USING (
        applicant_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can create mortgage applications"
    ON mortgage_applications FOR INSERT
    WITH CHECK (
        applicant_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can update their own mortgage applications"
    ON mortgage_applications FOR UPDATE
    USING (
        applicant_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create trigger for updating updated_at
CREATE TRIGGER update_mortgage_applications_updated_at
    BEFORE UPDATE ON mortgage_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 