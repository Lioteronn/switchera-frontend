-- QUICK FIX: Disable RLS for Profile Testing
-- Run this command in your Supabase SQL Editor to immediately fix the profile save issue

ALTER TABLE users_profile DISABLE ROW LEVEL SECURITY;

-- Optional: If you also have issues with auth_user table
-- ALTER TABLE auth_user DISABLE ROW LEVEL SECURITY;

-- IMPORTANT: This is for testing only! 
-- In production, you should create proper RLS policies instead.

-- Example of proper RLS policies for later (when you want to re-enable security):
-- 
-- First, re-enable RLS:
-- ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
--
-- Then create policies:
-- CREATE POLICY "Allow authenticated users to read profiles" ON users_profile
--   FOR SELECT USING (true);
--
-- CREATE POLICY "Allow users to manage their own profiles" ON users_profile
--   FOR ALL USING (auth.uid()::text = user_id::text);
--
-- Note: The above policies assume Supabase auth. For Django auth integration,
-- you'd need custom policies or a different authentication approach.
