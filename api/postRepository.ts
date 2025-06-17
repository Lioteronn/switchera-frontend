import { getUserAuthStatus, supabase } from '../utils/supabase';

export interface Post {
  id?: string; // UUID
  author_id: number;
  title: string;
  content: string;
  image?: string | null; // Changed from image_url to image to match DB schema
  created_at?: string;
  updated_at?: string;
  likes_count?: number;
  comments_count?: number;
  author_username?: string;
  author_profile_picture?: string;
  is_liked_by_user?: boolean;
}

export interface PostComment {
  id?: number;
  post_id: string;
  user_id: number;
  comment_text: string;
  created_at?: string;
  user?: {
    username: string | null;
    avatar_url: string | null;
  };
}

interface UserPostLike {
  user_id: number;
  post_id: string;
}

// Changed userId to number
export const checkIfUserLikedPost = async (postId: string, userId: number): Promise<boolean> => {
  if (userId === undefined || userId === null) { // Check for undefined or null
    console.warn('⚠️ checkIfUserLikedPost: userId is invalid:', userId);
    return false;
  }
  console.log('🔍 Checking if user liked post:', { postId, userId });
  try {
    const { data, error } = await supabase
      .from('users_post_likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to return null if not found, instead of error

    if (error) {
      console.error('❌ Error checking if user liked post:', error.message);
      return false;
    }
    const isLiked = !!data;
    console.log('✅ User like status:', isLiked);
    return isLiked; // True if a record exists, false otherwise
  } catch (e) {
    const error = e as Error;
    console.error('❌ Exception in checkIfUserLikedPost:', error.message);
    return false;
  }
};

export const getPostLikeCount = async (postId: string): Promise<number> => {
  console.log('🔍 Getting like count for post:', postId);
  try {
    const { count, error } = await supabase
      .from('users_post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) {
      console.error('❌ Error getting post like count:', error.message);
      return 0;
    }
    const likeCount = count ?? 0;
    console.log('✅ Like count:', likeCount);
    return likeCount;
  } catch (e) {
    const error = e as Error;
    console.error('❌ Exception in getPostLikeCount:', error.message);
    return 0;
  }
}

export const postRepository = {
  // --- Post CRUD ---
  async createPost(postData: { title: string; content: string; image?: string | null; imageUri?: string | null }): Promise<Post> {
    const authStatus = await getUserAuthStatus();
    if (!authStatus.isAuthenticated || !authStatus.userId) {
      throw new Error('User not authenticated or user ID not found');
    }

    console.log('🔍 Creating post with data:', { ...postData, imageUri: postData.imageUri ? 'present' : 'null' });

    let imageUrl = postData.image;

    // If we have a local image URI, upload it first
    if (postData.imageUri && !postData.image) {
      try {
        console.log('🔍 Uploading image before creating post...');
        imageUrl = await this.uploadImage(postData.imageUri, 'post-image');
        console.log('✅ Image upload successful, URL:', imageUrl);
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError);
        // Continue without image rather than failing the entire post creation
        imageUrl = null;
      }
    }

    const { data, error } = await supabase
      .from('users_post')
      .insert([{ 
        title: postData.title, 
        content: postData.content, 
        image: imageUrl, // Use the uploaded URL or null
        author_id: authStatus.userId // author_id is added here
      }])
      .select('*, author:auth_user(username, users_profile(profile_picture))')
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw new Error(`Failed to create post: ${error.message}`);
    }
    return {
        ...data,
        author_username: data.author?.username,
        author_profile_picture: data.author?.users_profile[0]?.profile_picture,
    } as Post;
  },

  async getAllPosts(): Promise<Post[]> {
    const authStatus = await getUserAuthStatus();

    const { data, error } = await supabase
      .from('users_post')
      .select(`
        *,
        author:auth_user(username, users_profile(profile_picture)),
        likes_count:users_post_likes(count),
        comments_count:users_post_comments(count),
        is_liked_by_user:users_post_likes!left(user_id)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all posts:', error);
      throw error;
    }
    
    return data.map(post => ({
        ...post,
        author_username: post.author?.username,
        author_profile_picture: post.author?.users_profile[0]?.profile_picture,
        likes_count: post.likes_count[0]?.count || 0,
        comments_count: post.comments_count[0]?.count || 0,
        is_liked_by_user: authStatus.isAuthenticated && authStatus.userId && Array.isArray(post.is_liked_by_user) ? post.is_liked_by_user.some((like: UserPostLike) => like.user_id === authStatus.userId) : false,
    })) as Post[];
  },

  async getFollowedUsersPosts(): Promise<Post[]> {
    const authStatus = await getUserAuthStatus();
    if (!authStatus.isAuthenticated || !authStatus.userId) {
      throw new Error('User not authenticated or user ID not found');
    }

    const { data: followedUsers, error: followError } = await supabase
      .from('users_userfollow')
      .select('following_id')
      .eq('follower_id', authStatus.userId);

    if (followError) {
      console.error('Error fetching followed users:', followError);
      throw followError;
    }

    const followedUserIds = followedUsers.map(f => f.following_id);

    if (followedUserIds.length === 0) {
      return []; // No followed users, so no posts
    }

    const { data, error } = await supabase
      .from('users_post')
      .select(`
        *,
        author:auth_user(username, users_profile(profile_picture)),
        likes_count:users_post_likes(count),
        comments_count:users_post_comments(count),
        is_liked_by_user:users_post_likes!left(user_id)
      `)
      .in('author_id', followedUserIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching followed users posts:', error);
      throw error;
    }
    
    return data.map(post => ({
        ...post,
        author_username: post.author?.username,
        author_profile_picture: post.author?.users_profile[0]?.profile_picture,
        likes_count: post.likes_count[0]?.count || 0,
        comments_count: post.comments_count[0]?.count || 0,
        is_liked_by_user: authStatus.isAuthenticated && authStatus.userId && Array.isArray(post.is_liked_by_user) ? post.is_liked_by_user.some((like: UserPostLike) => like.user_id === authStatus.userId) : false,
    })) as Post[];
  },
  
  async getPostById(postId: string): Promise<Post | null> {
    const authStatus = await getUserAuthStatus();
    const { data, error } = await supabase
      .from('users_post')
      .select(`
        *,
        author:auth_user(username, users_profile(profile_picture)),
        likes_count:users_post_likes(count),
        comments_count:users_post_comments(count),
        is_liked_by_user:users_post_likes!left(user_id)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Post not found
      console.error('Error fetching post by ID:', error);
      throw error;
    }
    if (!data) return null;

    return {
        ...data,
        author_username: data.author?.username,
        author_profile_picture: data.author?.users_profile[0]?.profile_picture,
        likes_count: data.likes_count[0]?.count || 0,
        comments_count: data.comments_count[0]?.count || 0,
        is_liked_by_user: authStatus.isAuthenticated && authStatus.userId && Array.isArray(data.is_liked_by_user) ? data.is_liked_by_user.some((like: UserPostLike) => like.user_id === authStatus.userId) : false,
    } as Post;
  },

  async getPostsByIds(postIds: string[]): Promise<Post[]> {
    if (postIds.length === 0) {
        return [];
    }
    const authStatus = await getUserAuthStatus();
    const { data, error } = await supabase
        .from('users_post')
        .select(`
            *,
            author:auth_user(username, users_profile(profile_picture)),
            likes_count:users_post_likes(count),
            comments_count:users_post_comments(count),
            is_liked_by_user:users_post_likes!left(user_id)
        `)
        .in('id', postIds)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts by IDs:', error);
        throw error;
    }

    return data.map(post => ({
        ...post,
        author_username: post.author?.username,
        author_profile_picture: post.author?.users_profile[0]?.profile_picture,
        likes_count: post.likes_count[0]?.count || 0,
        comments_count: post.comments_count[0]?.count || 0,
        is_liked_by_user: authStatus.isAuthenticated && authStatus.userId && Array.isArray(post.is_liked_by_user) ? post.is_liked_by_user.some((like: UserPostLike) => like.user_id === authStatus.userId) : false,
    })) as Post[];
  },

  // --- Likes ---
  async likePost(postId: string): Promise<{ success: boolean; isLiked: boolean; likesCount: number }> {
    const authStatus = await getUserAuthStatus();
    console.log('🔍 Like Post - Auth Status:', {
        isAuthenticated: authStatus.isAuthenticated,
        userId: authStatus.userId,
        userIdType: typeof authStatus.userId
    });

    if (!authStatus.isAuthenticated || !authStatus.userId) {
      console.error('❌ Like Post - User not authenticated:', authStatus);
      throw new Error('User not authenticated');
    }

    // Convert userId to number if it's a string
    const userId = typeof authStatus.userId === 'string' ? parseInt(authStatus.userId, 10) : authStatus.userId;
    if (isNaN(userId)) {
      console.error('❌ Like Post - Invalid user ID:', authStatus.userId);
      throw new Error('Invalid user ID');
    }

    console.log('🔍 Like Post - Starting operation:', { postId, userId });

    try {
      // Check if already liked
      const { data: existingLike, error: likeError } = await supabase
        .from('users_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (likeError) {
        console.error('❌ Like Post - Error checking existing like:', likeError);
        throw likeError;
      }

      console.log('🔍 Like Post - Existing like check:', { existingLike });

      let isLikedNow = false;
      if (existingLike) {
        // Unlike
        console.log('👎 Like Post - Removing existing like');
        const { error: unlikeError } = await supabase
          .from('users_post_likes')
          .delete()
          .match({ post_id: postId, user_id: userId });

        if (unlikeError) {
          console.error('❌ Like Post - Error unliking:', unlikeError);
          throw unlikeError;
        }
        isLikedNow = false;
        console.log('✅ Like Post - Successfully unliked');
      } else {
        // Like
        console.log('👍 Like Post - Adding new like');
        const { error: insertLikeError } = await supabase
          .from('users_post_likes')
          .insert({ post_id: postId, user_id: userId });

        if (insertLikeError) {
          console.error('❌ Like Post - Error liking:', insertLikeError);
          throw insertLikeError;
        }
        isLikedNow = true;
        console.log('✅ Like Post - Successfully liked');
      }

      // Get updated likes count
      const { count, error: countError } = await supabase
        .from('users_post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (countError) {
        console.error('❌ Like Post - Error getting updated count:', countError);
        throw countError;
      }

      const result = { success: true, isLiked: isLikedNow, likesCount: count ?? 0 };
      console.log('✅ Like Post - Final result:', result);
      return result;
    } catch (error) {
      console.error('❌ Like Post - Unexpected error:', error);
      throw error;
    }
  },

  // --- Comments ---
  async createComment(postId: string, commentText: string): Promise<PostComment> {
    const authStatus = await getUserAuthStatus();
    console.log('🔍 Create Comment - Auth Status:', {
      isAuthenticated: authStatus.isAuthenticated,
      userId: authStatus.userId,
      userIdType: typeof authStatus.userId
    });

    if (!authStatus.isAuthenticated || !authStatus.userId) {
      console.error('❌ Create Comment - User not authenticated:', authStatus);
      throw new Error('User not authenticated');
    }

    // Convert userId to number if it's a string
    const userId = typeof authStatus.userId === 'string' ? parseInt(authStatus.userId, 10) : authStatus.userId;
    if (isNaN(userId)) {
      console.error('❌ Create Comment - Invalid user ID:', authStatus.userId);
      throw new Error('Invalid user ID');
    }

    console.log('🔍 Create Comment - Starting operation:', { 
      postId, 
      userId,
      commentText: commentText.substring(0, 20) + '...' 
    });

    try {
      // Insert the comment
      const { data: newCommentData, error: insertError } = await supabase
        .from('users_post_comments')
        .insert([{ 
          post_id: postId, 
          user_id: userId, 
          comment_text: commentText.trim() // Ensure we trim the comment text
        }])
        .select('id, post_id, user_id, comment_text, created_at')
        .single();

      if (insertError) {
        console.error('❌ Create Comment - Error inserting comment:', insertError);
        throw insertError;
      }

      if (!newCommentData) {
        console.error('❌ Create Comment - No data returned after insert');
        throw new Error('Failed to create comment or retrieve its data.');
      }

      console.log('✅ Create Comment - Comment created:', newCommentData);

      // Fetch user profile information
      const { data: userProfile, error: profileError } = await supabase
        .from('auth_user')
        .select('username, users_profile(profile_picture)')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('❌ Create Comment - Error fetching user profile:', profileError);
        // Continue with default values if profile fetch fails
      }

      const commentResult = {
        id: newCommentData.id,
        post_id: newCommentData.post_id,
        user_id: newCommentData.user_id,
        comment_text: newCommentData.comment_text || commentText.trim(), // Fallback to original text if needed
        created_at: newCommentData.created_at,
        user: {
          username: userProfile?.username || 'Unknown User',
          avatar_url: userProfile?.users_profile?.[0]?.profile_picture || null
        }
      } as PostComment;

      console.log('✅ Create Comment - Final result:', commentResult);
      return commentResult;
    } catch (error) {
      console.error('❌ Create Comment - Unexpected error:', error);
      throw error;
    }
  },

  async getPostComments(postId: string): Promise<PostComment[]> {
    console.log('🔍 Fetching comments for post:', postId);
    
    // Step 1: Fetch all comments for the post
    const { data: commentsData, error: commentsError } = await supabase
      .from('users_post_comments')
      .select('id, post_id, user_id, comment_text, created_at')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('❌ Error fetching comments:', commentsError);
      throw commentsError;
    }
    if (!commentsData || commentsData.length === 0) {
      console.log('📝 No comments found for post:', postId);
      return [];
    }

    console.log('✅ Comments fetched:', commentsData.length, 'comments');

    // Step 2: Get all unique integer user_ids from these comments
    const userIds = [...new Set(commentsData.map(c => c.user_id).filter(id => id != null))] as number[];
    console.log('🔍 Unique user IDs from comments:', userIds);

    if (userIds.length === 0) {
      // Return comments with default user info if no valid user_ids
      console.log('⚠️ No valid user IDs found, returning comments with default user info');
      return commentsData.map(comment => ({
        ...comment,
        user: { username: 'Unknown User', avatar_url: null }
      } as PostComment));
    }

    // Step 3: Fetch all user profiles from auth_user table
    console.log('🔍 Fetching user profiles for IDs:', userIds);
    
    const { data: userProfiles, error: profilesError } = await supabase
      .from('auth_user')
      .select('id, username, users_profile(profile_picture)')
      .in('id', userIds);

    if (profilesError) {
      console.error('❌ Error fetching user profiles:', profilesError);
      // Return comments with default user info if profiles fetch fails
      return commentsData.map(comment => ({
        ...comment,
        user: { username: 'Unknown User', avatar_url: null }
      } as PostComment));
    }

    console.log('✅ User profiles fetched:', userProfiles?.length || 0, 'profiles');

    // Create user profiles map
    const userProfilesMap = new Map(userProfiles?.map(user => [
      user.id,
      {
        username: user.username || 'Unknown User',
        avatar_url: user.users_profile?.[0]?.profile_picture || null
      }
    ]));

    // Step 4: Map user profiles back to comments
    const result = commentsData.map(comment => {
      const userProfile = comment.user_id ? userProfilesMap.get(comment.user_id) : null;
      return {
        ...comment,
        user: userProfile || { username: 'Unknown User', avatar_url: null }
      } as PostComment;
    });

    console.log('✅ Final comments with user profiles:', result);
    return result;
  },

  // --- Image Upload (Placeholder for actual implementation) ---
  async uploadImage(imageUri: string, fileName: string): Promise<string> {
    const authStatus = await getUserAuthStatus();
    if (!authStatus.isAuthenticated || !authStatus.userId) {
      throw new Error('User not authenticated');
    }

    console.log('🔍 Uploading image:', { imageUri, fileName });

    try {
      // Convert URI to Blob for upload
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Generate unique file name with user ID prefix
      const fileExtension = imageUri.split('.').pop() || 'jpg';
      const uniqueFileName = `posts/${authStatus.userId}/${Date.now()}-${fileName}.${fileExtension}`;

      console.log('🔍 Uploading as:', uniqueFileName);      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('post-images') // Bucket name - needs to be created in Supabase
        .upload(uniqueFileName, blob, {
          contentType: `image/${fileExtension}`,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Error uploading image:', error);
        if (error.message.includes('Bucket not found')) {
          throw new Error('Image upload is not yet configured. Please create the "post-images" bucket in your Supabase Storage dashboard.');
        }
        throw error;
      }

      console.log('✅ Image uploaded successfully:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(uniqueFileName);

      const publicUrl = urlData.publicUrl;
      console.log('✅ Public URL generated:', publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('❌ Exception in uploadImage:', error);
      throw error;
    }
  },
};
