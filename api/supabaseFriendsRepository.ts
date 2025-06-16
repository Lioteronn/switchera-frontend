import { supabase, User } from '@/utils/supabase';

export interface FriendRequest {
    id: string;
    user_id: number;
    friend_id: number;
    online: boolean;
    blocked: boolean;
    created_at: string;
    // User info joined from auth_user
    friend_user?: User;
}

export interface FollowRelation {
    id: number;
    follower_id: number;
    following_id: number;
    created_at: string;
    // User info joined from auth_user
    follower_user?: User;
    following_user?: User;
}

export interface UserWithProfile extends User {
    profile?: {
        id: number;
        bio: string;
        location: string;
        interests: any;
        speciality: any;
        profile_picture: string | null;
        rating: number | null;
    };
    is_friend?: boolean;
    is_following?: boolean;
    is_followed_by?: boolean;
}

export class SupabaseFriendsRepository {    private _ensureIntegerUserId(identifier: string | number): number {
        if (typeof identifier === 'number') {
            return identifier; // It's already an integer ID
        }

        // Try to parse string as integer
        const parsedId = parseInt(identifier, 10);
        if (!isNaN(parsedId)) {
            return parsedId;
        }

        // If we can't parse it, throw an error
        throw new Error(`Invalid user ID: ${identifier}. Expected integer or integer string.`);
    }

    /**
     * Get friends list for current user
     */    async getFriends(userId: number): Promise<FriendRequest[]> {
        console.log('🔍 Fetching friends for user:', userId);
        
        const { data, error } = await supabase
            .from('users_friends')
            .select(`
                *,
                friend_user:auth_user!users_friends_friend_id_15654ce9_fk_auth_user_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    email,
                    is_active,
                    profile:users_profile (
                        id,
                        bio,
                        location,
                        interests,
                        speciality,
                        profile_picture,
                        rating
                    )
                )
            `)
            .eq('user_id', userId)
            .eq('blocked', false)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error fetching friends:', error);
            throw new Error(`Failed to fetch friends: ${error.message}`);
        }

        console.log('✅ Friends fetched successfully:', data?.length || 0);
        return data || [];
    }/**
     * Get followers for a user
     */    async getFollowers(userId: number): Promise<FollowRelation[]> {
        console.log('🔍 Fetching followers for user:', userId);
        
        const { data, error } = await supabase
            .from('users_userfollow')
            .select(`
                *,
                follower_user:auth_user!users_userfollow_follower_id_a9097d10_fk_auth_user_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    email,
                    is_active
                )
            `)
            .eq('following_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error fetching followers:', error);
            throw new Error(`Failed to fetch followers: ${error.message}`);
        }

        console.log('✅ Followers fetched successfully:', data?.length || 0);
        return data || [];
    }

    /**
     * Get following list for a user
     */    async getFollowing(userId: number): Promise<FollowRelation[]> {
        console.log('🔍 Fetching following for user:', userId);
          const { data, error } = await supabase
            .from('users_userfollow')
            .select(`
                *,
                following_user:auth_user!users_userfollow_following_id_b3f559d3_fk_auth_user_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    email,
                    is_active
                )
            `)
            .eq('follower_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error fetching following:', error);
            throw new Error(`Failed to fetch following: ${error.message}`);
        }

        console.log('✅ Following fetched successfully:', data?.length || 0);
        return data || [];
    }

    /**
     * Add a friend
     */
    async addFriend(userId: number, friendId: number): Promise<FriendRequest> {
        console.log('👥 Adding friend relationship:', { userId, friendId });
        
        if (userId === friendId) {
            throw new Error('Cannot add yourself as a friend');
        }

        // Check if friendship already exists
        const { data: existing } = await supabase
            .from('users_friends')
            .select('*')
            .eq('user_id', userId)
            .eq('friend_id', friendId)
            .single();

        if (existing) {
            throw new Error('Friendship already exists');
        }
        const currentTime = new Date().toISOString();
        // Insert first friendship record (user -> friend)
        const newFriendshipId1 = crypto.randomUUID();
        const { data: friendship1, error: error1 } = await supabase
            .from('users_friends')
            .insert({
                id: newFriendshipId1,
                user_id: userId,
                friend_id: friendId,
                online: false,
                blocked: false,
                created_at: currentTime
            })
            .select(`
                *,
                friend_user:auth_user!users_friends_friend_id_15654ce9_fk_auth_user_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    email,
                    is_active,
                    profile:users_profile (
                        id,
                        bio,
                        location,
                        interests,
                        speciality,
                        profile_picture,
                        rating
                    )
                )
            `)
            .single();

        if (error1) {
            console.error('❌ Error adding first friendship:', error1);
            throw new Error(`Failed to add friend: ${error1.message}`);
        }

        // Insert second friendship record (friend -> user)
        const newFriendshipId2 = crypto.randomUUID();
        const { error: error2 } = await supabase
            .from('users_friends')
            .insert({
                id: newFriendshipId2,
                user_id: friendId,
                friend_id: userId,
                online: false,
                blocked: false,
                created_at: currentTime
            });

        if (error2) {
            console.error('❌ Error adding second friendship:', error2);
            // Try to rollback the first insert
            await supabase
                .from('users_friends')
                .delete()
                .eq('id', newFriendshipId1); // Rollback by the generated ID
            throw new Error(`Failed to add friend: ${error2.message}`);
        }

        console.log('✅ Friend added successfully');
        return friendship1;
    }

    /**
     * Remove a friend
     */
    async removeFriend(userId: number, friendId: number): Promise<void> {
        console.log('❌ Removing friend relationship:', { userId, friendId });
        
        // Remove both sides of the friendship
        const { error } = await supabase
            .from('users_friends')
            .delete()
            .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

        if (error) {
            console.error('❌ Error removing friend:', error);
            throw new Error(`Failed to remove friend: ${error.message}`);
        }

        console.log('✅ Friend removed successfully');
    }

    /**
     * Follow a user
     */
    async followUser(followerId: number, followingId: number): Promise<FollowRelation> {
        console.log('👥 Following user:', { followerId, followingId });
        
        if (followerId === followingId) {
            throw new Error('Cannot follow yourself');
        }

        // Check if already following
        const { data: existing } = await supabase
            .from('users_userfollow')
            .select('*')
            .eq('follower_id', followerId)
            .eq('following_id', followingId)
            .single();

        if (existing) {
            throw new Error('Already following this user');
        }

        const { data, error } = await supabase            .from('users_userfollow')
            .insert({
                follower_id: followerId,
                following_id: followingId,
                created_at: new Date().toISOString()
            })            .select(`
                *,
                following_user:auth_user!users_userfollow_following_id_b3f559d3_fk_auth_user_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    email,
                    is_active
                )
            `)
            .single();

        if (error) {
            console.error('❌ Error following user:', error);
            throw new Error(`Failed to follow user: ${error.message}`);
        }

        console.log('✅ User followed successfully');
        return data;
    }

    /**
     * Unfollow a user
     */
    async unfollowUser(followerId: number, followingId: number): Promise<void> {
        console.log('❌ Unfollowing user:', { followerId, followingId });
        
        const { error } = await supabase
            .from('users_userfollow')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', followingId);

        if (error) {
            console.error('❌ Error unfollowing user:', error);
            throw new Error(`Failed to unfollow user: ${error.message}`);
        }

        console.log('✅ User unfollowed successfully');
    }

    /**
     * Block a friend
     */
    async blockFriend(userId: number, friendId: number): Promise<void> {
        console.log('🚫 Blocking friend:', { userId, friendId });
        
        const { error } = await supabase
            .from('users_friends')
            .update({ blocked: true })
            .eq('user_id', userId)
            .eq('friend_id', friendId);

        if (error) {
            console.error('❌ Error blocking friend:', error);
            throw new Error(`Failed to block friend: ${error.message}`);
        }

        console.log('✅ Friend blocked successfully');
    }

    /**
     * Unblock a friend
     */
    async unblockFriend(userId: number, friendId: number): Promise<void> {
        console.log('✅ Unblocking friend:', { userId, friendId });
        
        const { error } = await supabase
            .from('users_friends')
            .update({ blocked: false })
            .eq('user_id', userId)
            .eq('friend_id', friendId);

        if (error) {
            console.error('❌ Error unblocking friend:', error);
            throw new Error(`Failed to unblock friend: ${error.message}`);
        }

        console.log('✅ Friend unblocked successfully');
    }

    /**
     * Search users by username or name
     */
    async searchUsers(query: string, currentUserIdInput: string | number, limit: number = 20): Promise<UserWithProfile[]> {
        console.log('🔍 Searching users:', { query, limit });        
        const currentUserId = this._ensureIntegerUserId(currentUserIdInput);
        
        const { data, error } = await supabase
            .from('auth_user')
            .select(`
                id,
                username,
                first_name,
                last_name,
                email,
                is_active,
                profile:users_profile (
                    id,
                    bio,
                    location,
                    interests,
                    speciality,
                    profile_picture,
                    rating
                )
            `)
            .neq('id', currentUserId) // Exclude current user (integer ID)
            .eq('is_active', true)
            .or(`username.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
            .limit(limit);

        if (error) {
            console.error('❌ Error searching users:', error);
            throw new Error(`Failed to search users: ${error.message}`);
        }

        // Check friendship and follow status for each user
        const usersWithStatus = await Promise.all(
            (data || []).map(async (user) => {
                // user.id here is already the integer id from auth_user
                const [friendStatus, followStatus] = await Promise.all([
                    this.checkFriendshipStatus(currentUserId, user.id),
                    this.checkFollowStatus(currentUserId, user.id)
                ]);

                return {
                    ...user,
                    profile: Array.isArray(user.profile) ? user.profile[0] : user.profile,
                    is_friend: friendStatus.is_friend,
                    is_following: followStatus.is_following,
                    is_followed_by: followStatus.is_followed_by
                };
            })
        );

        console.log('✅ Users search completed:', usersWithStatus.length);
        return usersWithStatus;
    }

    /**
     * Get user profile with friendship status
     */    async getUserProfile(userIdInput: string | number, currentUserIdInput: string | number): Promise<UserWithProfile | null> {
        const targetUserIdInt = this._ensureIntegerUserId(userIdInput);
        const currentUserIdInt = this._ensureIntegerUserId(currentUserIdInput);

        console.log('🔍 Fetching user profile for integer ID:', { targetUserIdInt, currentUserIdInt });
        
        const { data, error } = await supabase
            .from('auth_user')
            .select(`
                id,
                username,
                first_name,
                last_name,
                email,
                is_active,
                profile:users_profile (
                    id,
                    bio,
                    location,
                    interests,
                    speciality,
                    profile_picture,
                    rating
                )
            `)
            .eq('id', targetUserIdInt) // Use the resolved integer ID
            .eq('is_active', true)
            .single();

        if (error) {
            console.error('❌ Error fetching user profile:', error);
            return null;
        }

        if (!data) {
            return null;
        }

        // Check relationship status if not the same user
        let relationshipStatus = {
            is_friend: false,
            is_following: false,
            is_followed_by: false
        };

        if (targetUserIdInt !== currentUserIdInt) {
            const [friendStatus, followStatus] = await Promise.all([
                this.checkFriendshipStatus(currentUserIdInt, targetUserIdInt),
                this.checkFollowStatus(currentUserIdInt, targetUserIdInt)
            ]);

            relationshipStatus = {
                is_friend: friendStatus.is_friend,
                is_following: followStatus.is_following,
                is_followed_by: followStatus.is_followed_by
            };
        }

        const userWithStatus = {
            ...data,
            profile: Array.isArray(data.profile) ? data.profile[0] : data.profile,
            ...relationshipStatus
        };

        console.log('✅ User profile fetched successfully');
        return userWithStatus;
    }

    /**
     * Check friendship status between two users
     */
    async checkFriendshipStatus(userId: number, otherUserId: number): Promise<{ is_friend: boolean }> {
        const { data } = await supabase
            .from('users_friends')
            .select('id')
            .eq('user_id', userId)
            .eq('friend_id', otherUserId)
            .eq('blocked', false)
            .single();

        return { is_friend: !!data };
    }

    /**
     * Check follow status between two users
     */
    async checkFollowStatus(userId: number, otherUserId: number): Promise<{ is_following: boolean; is_followed_by: boolean }> {
        const [followingData, followerData] = await Promise.all([
            supabase
                .from('users_userfollow')
                .select('id')
                .eq('follower_id', userId)
                .eq('following_id', otherUserId)
                .single(),
            supabase
                .from('users_userfollow')
                .select('id')
                .eq('follower_id', otherUserId)
                .eq('following_id', userId)
                .single()
        ]);

        return {
            is_following: !!followingData.data,
            is_followed_by: !!followerData.data
        };
    }

    /**
     * Get user statistics (friends count, followers count, following count)
     */
    async getUserStats(userIdInput: string | number): Promise<{
        friends_count: number;
        followers_count: number;
        following_count: number;    }> {
        const userIdInt = this._ensureIntegerUserId(userIdInput);
        console.log('📊 Fetching user stats for integer ID:', userIdInt);
        
        const [friendsCount, followersCount, followingCount] = await Promise.all([
            supabase
                .from('users_friends')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userIdInt) // Use resolved integer ID
                .eq('blocked', false),
            supabase
                .from('users_userfollow')
                .select('*', { count: 'exact', head: true })
                .eq('following_id', userIdInt), // Use resolved integer ID
            supabase
                .from('users_userfollow')
                .select('*', { count: 'exact', head: true })
                .eq('follower_id', userIdInt) // Use resolved integer ID
        ]);

        const stats = {
            friends_count: friendsCount.count || 0,
            followers_count: followersCount.count || 0,
            following_count: followingCount.count || 0
        };

        console.log('✅ User stats fetched:', stats);
        return stats;
    }    /**
     * Get mutual friends between two users
     */
    async getMutualFriends(userId1: number, userId2: number, limit: number = 10): Promise<FriendRequest[]> {
        console.log('🤝 Fetching mutual friends between:', { userId1, userId2 });
        
        // First get friends of userId2
        const { data: user2Friends } = await supabase
            .from('users_friends')
            .select('friend_id')
            .eq('user_id', userId2)
            .eq('blocked', false);

        const user2FriendIds = user2Friends?.map(f => f.friend_id) || [];
        
        if (user2FriendIds.length === 0) {
            console.log('✅ No mutual friends found - user2 has no friends');
            return [];        }        // Now get mutual friends
        const { data, error } = await supabase
            .from('users_friends')
            .select(`
                *,
                friend_user:auth_user!users_friends_friend_id_15654ce9_fk_auth_user_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    email,
                    is_active
                )
            `)
            .eq('user_id', userId1)
            .eq('blocked', false)
            .in('friend_id', user2FriendIds)
            .limit(limit);

        if (error) {
            console.error('❌ Error fetching mutual friends:', error);
            throw new Error(`Failed to fetch mutual friends: ${error.message}`);
        }

        console.log('✅ Mutual friends fetched:', data?.length || 0);
        return data || [];
    }    /**
     * Get friends of a specific user (for "People you may know" feature)
     */    async getFriendsOfUser(userIdInput: string | number, currentUserIdInput: string | number, limit: number = 15): Promise<UserWithProfile[]> {
        const userId = this._ensureIntegerUserId(userIdInput);
        const currentUserId = this._ensureIntegerUserId(currentUserIdInput);

        console.log('👥 Fetching friends of user (integer IDs):', { userId, excludeUserId: currentUserId });
        // First get all friends of the target user
        const { data: friendsData, error } = await supabase
            .from('users_friends')
            .select(`
                *,
                friend_user:auth_user!users_friends_friend_id_15654ce9_fk_auth_user_id (
                    id,
                    username,
                    first_name,
                    last_name,
                    email,
                    is_active,
                    profile:users_profile (
                        id,
                        bio,
                        location,
                        interests,
                        speciality,
                        profile_picture,
                        rating
                    )
                )
            `)
            .eq('user_id', userId) // Use resolved integer ID
            .eq('blocked', false)
            .neq('friend_id', currentUserId) // Exclude current user (integer ID)
            .limit(limit);

        if (error) {
            console.error('❌ Error fetching friends of user:', error);
            throw new Error(`Failed to fetch friends of user: ${error.message}`);
        }

        // Transform and add relationship status
        const friendsWithStatus = await Promise.all(
            (friendsData || []).map(async (item) => {
                if (!item.friend_user) return null;
                
                const user = Array.isArray(item.friend_user) ? item.friend_user[0] : item.friend_user;
                if (!user) return null;
                
                // Ensure user.id is integer before calling checkFriendshipStatus and checkFollowStatus
                const [friendStatus, followStatus] = await Promise.all([
                    this.checkFriendshipStatus(currentUserId, user.id), // user.id from friend_user is already integer
                    this.checkFollowStatus(currentUserId, user.id)    // user.id from friend_user is already integer
                ]);

                return {
                    ...user,
                    profile: Array.isArray(user.profile) ? user.profile[0] : user.profile,
                    is_friend: friendStatus.is_friend,
                    is_following: followStatus.is_following,
                    is_followed_by: followStatus.is_followed_by
                };
            })
        );

        // Filter out null values
        const validFriends = friendsWithStatus.filter((friend): friend is UserWithProfile => friend !== null);

        console.log('✅ Friends of user fetched:', validFriends.length);
        return validFriends;
    }

    /**
     * Get suggested friends based on mutual connections and interests
     */    async getSuggestedFriends(currentUserIdInput: string | number, limit: number = 20): Promise<UserWithProfile[]> {
        const currentUserId = this._ensureIntegerUserId(currentUserIdInput);
        console.log('💡 Fetching suggested friends for user (integer ID):', currentUserId);
        
        try {
            // Get users who are friends with current user's friends (friends of friends)
            // but are not already friends with current user
            const { data, error } = await supabase
                .rpc('get_suggested_friends', {
                    current_user_id: currentUserId, // Pass integer ID to RPC
                    limit_count: limit
                });

            if (error) {
                console.error('❌ RPC function not available, falling back to basic suggestion');
                // Fallback: get random active users who are not friends
                return this.getFallbackSuggestions(currentUserId, limit); // Pass integer ID
            }

            // Add relationship status to suggestions
            const suggestionsWithStatus = await Promise.all(
                (data || []).map(async (user: any) => {
                    const [friendStatus, followStatus] = await Promise.all([
                        this.checkFriendshipStatus(currentUserId, user.id),
                        this.checkFollowStatus(currentUserId, user.id)
                    ]);

                    return {
                        ...user,
                        is_friend: friendStatus.is_friend,
                        is_following: followStatus.is_following,
                        is_followed_by: followStatus.is_followed_by
                    };
                })
            );

            console.log('✅ Suggested friends fetched:', suggestionsWithStatus.length);
            return suggestionsWithStatus;
        } catch (error) {
            console.error('❌ Error in getSuggestedFriends, using fallback:', error);
            return this.getFallbackSuggestions(currentUserId, limit); // Pass integer ID
        }
    }

    /**
     * Fallback method for friend suggestions when RPC is not available
     */
    private async getFallbackSuggestions(currentUserId: number, limit: number): Promise<UserWithProfile[]> { // currentUserId is already number here
        console.log('🔄 Using fallback friend suggestions for integer ID:', currentUserId);
        
        // Get current user's friends to exclude them
        const { data: currentFriends } = await supabase
            .from('users_friends')
            .select('friend_id')
            .eq('user_id', currentUserId)
            .eq('blocked', false);

        const excludeIds = [currentUserId, ...(currentFriends?.map(f => f.friend_id) || [])];

        // Get random active users who are not already friends
        const { data, error } = await supabase
            .from('auth_user')
            .select(`
                id,
                username,
                first_name,
                last_name,
                email,
                is_active,
                profile:users_profile (
                    id,
                    bio,
                    location,
                    interests,
                    speciality,
                    profile_picture,
                    rating
                )
            `)
            .eq('is_active', true)
            .not('id', 'in', `(${excludeIds.join(',')})`)
            .limit(limit);

        if (error) {
            console.error('❌ Error in fallback suggestions:', error);
            return [];
        }

        // Add relationship status (should be false for all since we excluded friends)
        const suggestions = (data || []).map(user => ({
            ...user,
            profile: Array.isArray(user.profile) ? user.profile[0] : user.profile,
            is_friend: false,
            is_following: false,
            is_followed_by: false
        }));

        console.log('✅ Fallback suggestions generated:', suggestions.length);
        return suggestions;
    }

    /**
     * Get recent activity (new follows, new friends)
     */
    async getRecentActivity(userIdInput: string | number, limit: number = 10): Promise<{
        new_friends: FriendRequest[];
        new_followers: FollowRelation[];
    }> {        const userId = this._ensureIntegerUserId(userIdInput);
        console.log('📈 Fetching recent activity for user (integer ID):', userId);
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const [newFriends, newFollowers] = await Promise.all([
            supabase
                .from('users_friends')
                .select(`
                    *,
                    friend_user:auth_user!users_friends_friend_id_15654ce9_fk_auth_user_id (
                        id,
                        username,
                        first_name,
                        last_name,
                        email,
                        is_active
                    )
                `)
                .eq('user_id', userId)
                .eq('blocked', false)
                .gte('created_at', oneWeekAgo.toISOString())
                .order('created_at', { ascending: false })
                .limit(limit),
            supabase
                .from('users_userfollow')
                .select(`
                    *,
                    follower_user:auth_user!users_userfollow_follower_id_a9097d10_fk_auth_user_id (
                        id,
                        username,
                        first_name,
                        last_name,
                        email,
                        is_active
                    )
                `)
                .eq('following_id', userId)
                .gte('created_at', oneWeekAgo.toISOString())
                .order('created_at', { ascending: false })
                .limit(limit)
        ]);

        const activity = {
            new_friends: newFriends.data || [],
            new_followers: newFollowers.data || []
        };

        console.log('✅ Recent activity fetched:', {
            new_friends: activity.new_friends.length,
            new_followers: activity.new_followers.length
        });
        
        return activity;
    }
}

export const supabaseFriendsRepository = new SupabaseFriendsRepository();
