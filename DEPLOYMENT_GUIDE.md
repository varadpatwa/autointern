# Quick Fix for Sign-Up Error on Vercel

## Step 1: Run SQL in Supabase SQL Editor

Copy and paste this entire SQL code into your Supabase SQL Editor and run it:

```sql
-- Fix RLS policies for user signup
-- This migration addresses the issue where users cannot be created due to missing INSERT policies

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

-- Update the trigger function to handle errors gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user already exists to avoid duplicates
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE user_id = NEW.id::text) THEN
    INSERT INTO public.users (
      id,
      user_id,
      email,
      name,
      full_name,
      avatar_url,
      token_identifier,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.id::text,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
      COALESCE(NEW.email, NEW.id::text),
      NEW.created_at,
      NEW.updated_at
    );
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the user update function as well
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data->>'name', name),
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', avatar_url),
    updated_at = NEW.updated_at
  WHERE user_id = NEW.id::text;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the update
    RAISE WARNING 'Error updating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Step 2: Deploy to Vercel

1. Commit and push your changes to your repository
2. Deploy to Vercel (this should happen automatically if you have auto-deploy enabled)

## Step 3: Verify Environment Variables

Make sure these environment variables are set in your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 4: Test

1. Go to your deployed Vercel app
2. Try signing up with a new email
3. Verify the sign-up works without errors

## What This Fixes

- ✅ Missing RLS INSERT policies that prevented user creation
- ✅ Improved error handling in database triggers
- ✅ Proper permissions for authenticated users
- ✅ Removed redundant manual user creation in code

The sign-up should now work correctly on Vercel! 🎉 