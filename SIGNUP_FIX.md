# Sign-Up Issue Fix

## Problem
When deploying on Vercel, users were getting an error during sign-up due to database permission issues. The error was related to Row Level Security (RLS) policies that prevented user creation.

## Root Cause
1. **Missing RLS Policies**: The database had RLS enabled on the `users` table but was missing INSERT policies
2. **Redundant Manual Insertion**: The sign-up action was trying to manually create user records when database triggers should handle this
3. **Permission Issues**: The trigger function didn't have proper permissions to insert records

## Solution

### 1. Database Migration
Run the following SQL in your Supabase SQL Editor:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;

-- Create comprehensive policies for users table
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Create policies for subscriptions table
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Ensure the trigger function has proper permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.subscriptions TO authenticated;
```

### 2. Code Changes
The sign-up action has been simplified to rely on database triggers instead of manual user creation.

### 3. Environment Variables
Ensure these environment variables are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Files Modified
1. `supabase/migrations/initial-setup.sql` - Updated RLS policies
2. `supabase/migrations/fix-rls-policies.sql` - New migration for fixing policies
3. `src/app/actions.ts` - Simplified sign-up action
4. `deploy-fixes.sh` - Deployment script

## Testing
After applying the fixes:
1. Deploy to Vercel
2. Try signing up with a new email
3. Verify the user is created successfully
4. Check that the user can sign in

## Troubleshooting
If issues persist:
1. Check Vercel logs for specific error messages
2. Verify environment variables are set correctly
3. Ensure the database migration was applied successfully
4. Check Supabase logs for any trigger function errors 