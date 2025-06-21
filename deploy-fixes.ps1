# Deployment script to fix sign-up issues on Vercel
Write-Host "🚀 Applying database fixes for sign-up functionality..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Apply the migration to fix RLS policies
Write-Host "📝 Applying database migration..." -ForegroundColor Yellow
try {
    supabase db push
    Write-Host "✅ Database migration applied successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to apply database migration" -ForegroundColor Red
    Write-Host "Please run the SQL manually in your Supabase SQL Editor" -ForegroundColor Yellow
}

Write-Host "`n🔧 Additional steps to complete the fix:" -ForegroundColor Cyan
Write-Host "1. Make sure your Vercel environment variables are set:" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "2. If you're still having issues, run this SQL in your Supabase SQL Editor:" -ForegroundColor White
Write-Host ""
Write-Host "   -- Drop existing policies if they exist" -ForegroundColor Gray
Write-Host "   DROP POLICY IF EXISTS `"Users can view own data`" ON public.users;" -ForegroundColor Gray
Write-Host "   DROP POLICY IF EXISTS `"Users can insert own data`" ON public.users;" -ForegroundColor Gray
Write-Host "   DROP POLICY IF EXISTS `"Users can update own data`" ON public.users;" -ForegroundColor Gray
Write-Host ""
Write-Host "   -- Create comprehensive policies for users table" -ForegroundColor Gray
Write-Host "   CREATE POLICY `"Users can view own data`" ON public.users" -ForegroundColor Gray
Write-Host "       FOR SELECT USING (auth.uid()::text = user_id);" -ForegroundColor Gray
Write-Host ""
Write-Host "   CREATE POLICY `"Users can insert own data`" ON public.users" -ForegroundColor Gray
Write-Host "       FOR INSERT WITH CHECK (auth.uid()::text = user_id);" -ForegroundColor Gray
Write-Host ""
Write-Host "   CREATE POLICY `"Users can update own data`" ON public.users" -ForegroundColor Gray
Write-Host "       FOR UPDATE USING (auth.uid()::text = user_id);" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy your updated code to Vercel" -ForegroundColor White
Write-Host ""
Write-Host "🎉 The sign-up functionality should now work correctly!" -ForegroundColor Green 