import { createAuthenticatedSupabaseClient, getUserAuthStatus, Profile, supabase, User } from '@/utils/supabase';

export interface ProfileWithUser extends Profile {
    auth_user?: User;
    servicesCount?: number;
}

export interface ProfileUpdateData {
    bio?: string;
    birth_date?: string;
    location?: string;
    interests?: string;
    speciality?: string;
    profile_picture?: string | null;
    voxel_space_id?: string;
}

export class SupabaseProfileRepository {    /**
     * Get profile by user ID with user information
     * Uses a smart fallback strategy to handle authentication issues
     */
    async getProfileByUserId(userId: number): Promise<ProfileWithUser | null> {
        console.log('🔍 Fetching profile for user_id:', userId);
        
        // First, verify the user is authenticated
        const authStatus = await getUserAuthStatus();
        if (!authStatus.isAuthenticated) {
            throw new Error('User not authenticated');
        }
        
        console.log('✅ User authentication verified');

        // For now, use the regular client due to JWT signature issues
        // TODO: Fix JWT validation in Supabase or implement proper RLS policies
        const client = supabase;
        console.log('🔧 Using regular client (RLS should be disabled for testing)');        const { data, error } = await client
            .from('users_profile')
            .select(`
        *,
        auth_user (
          id,
          username,
          first_name,
          last_name,
          email,
          is_active
        )
      `)
            .eq('user_id', userId)
            .single();if (error) {
            if (error.code === 'PGRST301' || error.message?.includes('JWSError')) {
                console.error('❌ RLS blocking request - you need to disable RLS temporarily:', error);
                throw new Error(`Database access denied. Please disable RLS on users_profile table: ${error.message}`);
            }
            
            console.error('❌ Error fetching profile:', error);
            console.error('📋 Error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            });
            throw new Error(`Failed to fetch profile: ${error.message}`);
        }

        if (data) {
            // Fetch services count separately and add to profile data
            const servicesCount = await this.getServicesCount(userId);
            const profileWithServices = {
                ...data,
                servicesCount
            };
            
            console.log('✅ Profile fetched successfully with services count:', servicesCount);
            return profileWithServices;
        }

        console.log('✅ Profile fetched successfully:', data ? 'Profile found' : 'No profile');
        return data;
    }

    /**
     * Get current user's profile (requires auth)
     */
    async getMyProfile(): Promise<ProfileWithUser | null> {
        // Get current user from Supabase Auth
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Not authenticated');
        }

        // For now, we'll need to match by email or implement proper auth integration
        // This is a temporary solution - in production you'd want proper user mapping
        const { data: authUser, error: authError } = await supabase
            .from('auth_user')
            .select('id')
            .eq('email', user.email)
            .single();

        if (authError || !authUser) {
            throw new Error('User not found in database');
        }

        return this.getProfileByUserId(authUser.id);
    }    /**
     * Update profile - will create if doesn't exist
     * Uses a smart fallback strategy to handle authentication issues
     */
    async updateProfile(userId: number, updateData: ProfileUpdateData): Promise<Profile> {
        console.log('🔄 Attempting to update profile for user_id:', userId);
        console.log('📝 Update data:', updateData);

        // First, verify the user is authenticated
        const authStatus = await getUserAuthStatus();
        if (!authStatus.isAuthenticated) {
            throw new Error('User not authenticated');
        }
        
        console.log('✅ User authentication verified');

        // For now, use the regular client due to JWT signature issues
        // TODO: Fix JWT validation in Supabase or implement proper RLS policies
        const client = supabase;
        console.log('🔧 Using regular client (RLS should be disabled for testing)');

        // First, try to get the existing profile
        const { data: existingProfile, error: fetchError } = await client
            .from('users_profile')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            // If error is not "no rows returned", check if it's an auth error
            if (fetchError.code === 'PGRST301' || fetchError.message?.includes('JWSError')) {
                console.error('❌ RLS blocking request - you need to disable RLS temporarily:', fetchError);
                throw new Error(`Database access denied. Please disable RLS on users_profile table: ${fetchError.message}`);
            }
            
            console.error('❌ Error fetching existing profile:', fetchError);
            console.error('📋 Error details:', {
                code: fetchError.code,
                message: fetchError.message,
                details: fetchError.details,
                hint: fetchError.hint
            });
            throw new Error(`Failed to fetch profile: ${fetchError.message}`);
        }

        if (!existingProfile) {
            console.log('➕ No existing profile found, creating new one');
            // Create new profile if it doesn't exist
            const { data, error } = await client
                .from('users_profile')
                .insert({
                    user_id: userId,
                    ...updateData
                })
                .select()
                .single();

            if (error) {
                if (error.code === 'PGRST301' || error.message?.includes('JWSError')) {
                    console.error('❌ RLS blocking insert - you need to disable RLS temporarily:', error);
                    throw new Error(`Database access denied. Please disable RLS on users_profile table: ${error.message}`);
                }
                
                console.error('❌ Error creating profile:', error);
                console.error('📋 Error details:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                throw new Error(`Failed to create profile: ${error.message}`);
            }

            console.log('✅ Profile created successfully:', data);
            return data;
        } else {
            console.log('🔄 Updating existing profile');
            // Update existing profile
            const { data, error } = await client
                .from('users_profile')
                .update(updateData)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) {
                if (error.code === 'PGRST301' || error.message?.includes('JWSError')) {
                    console.error('❌ RLS blocking update - you need to disable RLS temporarily:', error);
                    throw new Error(`Database access denied. Please disable RLS on users_profile table: ${error.message}`);
                }
                
                console.error('❌ Error updating profile:', error);
                console.error('📋 Error details:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                throw new Error(`Failed to update profile: ${error.message}`);
            }

            console.log('✅ Profile updated successfully:', data);
            return data;
        }
    }

    /**
     * Create new profile
     */
    async createProfile(userId: number, profileData: Omit<ProfileUpdateData, 'user_id'> & { user_id: number }): Promise<Profile> {
        const { data, error } = await supabase
            .from('users_profile')
            .insert({
                ...profileData,
                user_id: userId
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating profile:', error);
            throw new Error(`Failed to create profile: ${error.message}`);
        }

        return data;
    }    /**
     * Upload profile picture to Supabase Storage
     */
    async uploadProfilePicture(userId: number, file: File | Blob, fileName: string): Promise<string> {
        console.log('📤 Uploading profile picture for user_id:', userId);
        
        // Get authenticated Supabase client
        const authClient = await createAuthenticatedSupabaseClient();
        console.log('✅ Using authenticated Supabase client for file upload');

        const fileExt = fileName.split('.').pop();
        const filePath = `profiles/${userId}/avatar.${fileExt}`;

        const { error: uploadError } = await authClient.storage
            .from('profile-pictures')
            .upload(filePath, file, {
                upsert: true
            });

        if (uploadError) {
            console.error('❌ Error uploading file:', uploadError);
            console.error('📋 Upload error details:', {
                code: uploadError.message,
                filePath,
                fileSize: file.size
            });
            throw new Error(`Failed to upload profile picture: ${uploadError.message}`);
        }

        // Get public URL (this doesn't need auth)
        const { data } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(filePath);

        console.log('✅ Profile picture uploaded successfully:', data.publicUrl);
        return data.publicUrl;
    }

    /**
     * Delete profile picture
     */
    async deleteProfilePicture(userId: number): Promise<void> {
        const { error } = await supabase.storage
            .from('profile-pictures')
            .remove([`profiles/${userId}/avatar.jpg`, `profiles/${userId}/avatar.png`]);

        if (error) {
            console.error('Error deleting profile picture:', error);
        }
    }

    /**
     * Search profiles by various criteria
     */
    async searchProfiles(query: string, limit: number = 10): Promise<ProfileWithUser[]> {
        const { data, error } = await supabase
            .from('users_profile')
            .select(`
        *,
        auth_user (
          id,
          username,
          first_name,
          last_name,
          email,
          is_active
        )
      `)
            .or(`bio.ilike.%${query}%,location.ilike.%${query}%,interests.ilike.%${query}%,speciality.ilike.%${query}%`)
            .limit(limit);

        if (error) {
            console.error('Error searching profiles:', error);
            throw new Error(`Failed to search profiles: ${error.message}`);
        }

        return data || [];
    }

    /**
     * Get profiles by location
     */
    async getProfilesByLocation(location: string, limit: number = 20): Promise<ProfileWithUser[]> {
        const { data, error } = await supabase
            .from('users_profile')
            .select(`
        *,
        auth_user (
          id,
          username,
          first_name,
          last_name,
          email,
          is_active
        )
      `)
            .ilike('location', `%${location}%`)
            .limit(limit);

        if (error) {
            console.error('Error fetching profiles by location:', error);
            throw new Error(`Failed to fetch profiles by location: ${error.message}`);
        }

        return data || [];
    }

    /**
     * Get profile statistics
     */
    async getProfileStats(userId: number): Promise<{
        profileId: number;
        totalProfiles: number;
        averageRating: number;
        profileCompleteness: number;
    }> {
        const profile = await this.getProfileByUserId(userId);

        if (!profile) {
            throw new Error('Profile not found');
        }

        // Calculate profile completeness
        const requiredFields = ['bio', 'birth_date', 'location', 'interests', 'speciality'];
        const completedFields = requiredFields.filter(field =>
            profile[field as keyof Profile] && profile[field as keyof Profile] !== ''
        ).length;
        const profileCompleteness = (completedFields / requiredFields.length) * 100;

        // Get total profiles count
        const { count } = await supabase
            .from('users_profile')
            .select('*', { count: 'exact', head: true });

        // Get average rating
        const { data: avgData } = await supabase
            .from('users_profile')
            .select('rating')
            .not('rating', 'is', null);

        const averageRating = avgData && avgData.length > 0
            ? avgData.reduce((sum, p) => sum + (p.rating || 0), 0) / avgData.length
            : 0;

        return {
            profileId: profile.id,
            totalProfiles: count || 0,
            averageRating,
            profileCompleteness
        };
    }

    /**
     * Test authentication with Supabase - for debugging purposes
     */
    async testAuthentication(): Promise<{ success: boolean; details: any }> {
        try {
            console.log('🧪 Testing Supabase authentication...');
            
            // Test with authenticated client
            const authClient = await createAuthenticatedSupabaseClient();
            
            // Try a simple query to test authentication
            const { data, error } = await authClient
                .from('users_profile')
                .select('id, user_id')
                .limit(1);
            
            if (error) {
                console.error('❌ Authentication test failed:', error);
                return {
                    success: false,
                    details: {
                        error: error.message,
                        code: error.code,
                        details: error.details,
                        hint: error.hint
                    }
                };
            }
            
            console.log('✅ Authentication test successful');
            return {
                success: true,
                details: {
                    message: 'Authentication working',
                    dataCount: data?.length || 0
                }
            };
            
        } catch (error) {
            console.error('❌ Authentication test error:', error);
            return {
                success: false,
                details: {
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            };
        }
    }

    /**
     * Get services count for a user
     */
    async getServicesCount(userId: number): Promise<number> {
        console.log('🔍 Fetching services count for user_id:', userId);
        
        const client = supabase;
        
        const { count, error } = await client
            .from('users_service')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) {
            console.error('❌ Error fetching services count:', error);
            return 0;
        }

        console.log('✅ Services count fetched:', count);
        return count || 0;
    }

    /**
     * Book a service (insert a booking row)
     */
    async bookService(serviceId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        const { error, data } = await supabase
            .from('service_bookings')
            .insert([{ service_id: serviceId, user_id: user.id }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    /**
     * Propose an exchange (insert an exchange proposal row)
     */
    async proposeExchange(serviceId: string, offeredServiceId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        const { error, data } = await supabase
            .from('service_exchanges')
            .insert([{
                requested_service_id: serviceId,
                offered_service_id: offeredServiceId,
                proposer_user_id: user.id,
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}

export const supabaseProfileRepository = new SupabaseProfileRepository();
