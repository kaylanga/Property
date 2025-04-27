-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('ADMIN', 'AGENT', 'USER');

-- Create enum for verification status
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- Modify profiles table to add security-related columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'USER',
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_status verification_status DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS verification_documents jsonb,
ADD COLUMN IF NOT EXISTS two_factor_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_login timestamp with time zone,
ADD COLUMN IF NOT EXISTS login_attempts integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_locked boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS account_locked_until timestamp with time zone;

-- Create table for rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    key text NOT NULL UNIQUE,
    count integer DEFAULT 1,
    timestamp timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Create table for security audit logs
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    event_type text NOT NULL,
    ip_address text,
    user_agent text,
    details jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Create table for user sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    session_token text NOT NULL UNIQUE,
    ip_address text,
    user_agent text,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now()
);

-- Create function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id uuid,
    p_event_type text,
    p_ip_address text,
    p_user_agent text,
    p_details jsonb
) RETURNS void AS $$
BEGIN
    INSERT INTO security_audit_logs (
        user_id,
        event_type,
        ip_address,
        user_agent,
        details
    ) VALUES (
        p_user_id,
        p_event_type,
        p_ip_address,
        p_user_agent,
        p_details
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle failed login attempts
CREATE OR REPLACE FUNCTION handle_failed_login() RETURNS trigger AS $$
BEGIN
    UPDATE profiles
    SET login_attempts = login_attempts + 1
    WHERE id = NEW.id;

    -- Lock account after 5 failed attempts
    IF NEW.login_attempts >= 5 THEN
        UPDATE profiles
        SET account_locked = true,
            account_locked_until = now() + interval '30 minutes'
        WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for failed login attempts
CREATE TRIGGER failed_login_trigger
    AFTER UPDATE OF login_attempts ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_failed_login();

-- Add RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Rate limits policies
CREATE POLICY "Rate limits are insertable by authenticated users"
    ON rate_limits FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Rate limits are viewable by authenticated users"
    ON rate_limits FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Rate limits are updatable by authenticated users"
    ON rate_limits FOR UPDATE
    TO authenticated
    USING (true);

-- Security audit logs policies
CREATE POLICY "Audit logs are viewable by admins only"
    ON security_audit_logs FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'ADMIN'
        )
    );

CREATE POLICY "Audit logs are insertable by the system"
    ON security_audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- User sessions policies
CREATE POLICY "Users can view own sessions"
    ON user_sessions FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
    ON user_sessions FOR DELETE
    TO authenticated
    USING (user_id = auth.uid()); 