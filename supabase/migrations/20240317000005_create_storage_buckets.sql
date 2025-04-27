-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
    ('property-images', 'property-images', true),
    ('user-documents', 'user-documents', false),
    ('mortgage-documents', 'mortgage-documents', false);

-- Set up storage policies for property-images
CREATE POLICY "Property images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'property-images' AND
        auth.role() = 'authenticated'
    );

-- Set up storage policies for user-documents
CREATE POLICY "Users can view their own documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can upload their own documents"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'user-documents' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Set up storage policies for mortgage-documents
CREATE POLICY "Users can view their own mortgage documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'mortgage-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can upload their own mortgage documents"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'mortgage-documents' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    ); 