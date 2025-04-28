/**
 * Validates required environment variables
 * Call this function at the start of your application
 */
export function validateEnvVariables() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
    
    // In development, we can throw an error to prevent the app from starting
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
      );
    }
    
    // In production, we'll log the error but allow the app to start
    // This prevents the app from crashing in production
    return false;
  }

  // Validate Supabase URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
    console.error('Invalid Supabase URL format');
    return false;
  }

  return true;
} 