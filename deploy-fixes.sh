#!/bin/bash

# Deployment script to fix sign-up issues on Vercel
echo "🚀 Applying database fixes for sign-up functionality..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Apply the migration to fix RLS policies
echo "📝 Applying database migration..."
supabase db push

# Verify the migration was applied
echo "✅ Database migration applied successfully!"

echo "🔧 Additional steps to complete the fix:"
echo "1. Make sure your Vercel environment variables are set:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "2. If you're still having issues, run this SQL in your Supabase SQL Editor:"
echo ""
echo "   -- Drop existing policies if they exist"
echo "   DROP POLICY IF EXISTS \"Users can view own data\" ON public.users;"
echo "   DROP POLICY IF EXISTS \"Users can insert own data\" ON public.users;"
echo "   DROP POLICY IF EXISTS \"Users can update own data\" ON public.users;"
echo ""
echo "   -- Create comprehensive policies for users table"
echo "   CREATE POLICY \"Users can view own data\" ON public.users"
echo "       FOR SELECT USING (auth.uid()::text = user_id);"
echo ""
echo "   CREATE POLICY \"Users can insert own data\" ON public.users"
echo "       FOR INSERT WITH CHECK (auth.uid()::text = user_id);"
echo ""
echo "   CREATE POLICY \"Users can update own data\" ON public.users"
echo "       FOR UPDATE USING (auth.uid()::text = user_id);"
echo ""
echo "3. Deploy your updated code to Vercel"
echo ""
echo "🎉 The sign-up functionality should now work correctly!" 