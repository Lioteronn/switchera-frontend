import { postRepository } from '@/api/postRepository'; // Changed to named import
import CreatePostModal from '@/components/postPage/CreatePostModal';
import PostFilter from '@/components/postPage/PostFilter';
import SquareAddButton from '@/components/servicePage/SquareAddButton';
import { useAuth } from '@/context/AuthContext';
import { getUserAuthStatus } from '@/utils/supabase'; // Add this import
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';

// Import category screens
import AllPostsScreen from './categories/AllPostsScreen';
import FollowedPostsScreen from './categories/FollowedPostsScreen';
import SavedPostsScreen from './categories/SavedPostsScreen';

export type PostTabType = 'all' | 'followed' | 'saved';

const PostScreen = () => {
  const [activeTab, setActiveTab] = useState<PostTabType>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKeyAllPosts, setRefreshKeyAllPosts] = useState(0);

  const { user, isAuthenticated, isLoading } = useAuth();

  // Debug logging for auth state
  console.log('🔍 PostScreen auth state:', {
    user,
    isAuthenticated,
    isLoading,
    userId: user?.id
  });

  const handleTabChange = (tab: PostTabType) => {
    setActiveTab(tab);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };  // Adjusted newPostData.image type to match CreatePostModal's onSubmit prop
  const handleCreatePost = async (newPostData: { title: string; content: string; image?: string | null; imageUri?: string | null }) => {
    console.log('🔍 handleCreatePost called with user:', user);
    console.log('🔍 User ID available:', user?.id);
    console.log('🔍 User object full:', JSON.stringify(user, null, 2));
    
    // First check AuthContext user
    if (!user || !user.id) {
      console.log('🔍 AuthContext user not available, checking getUserAuthStatus...');
      
      // Fallback: check getUserAuthStatus directly
      try {
        const authStatus = await getUserAuthStatus();
        console.log('🔍 getUserAuthStatus result:', authStatus);
        
        if (!authStatus.isAuthenticated || !authStatus.userId) {
          Alert.alert('Error', 'You must be logged in to create a post.');
          console.error('User not authenticated for creating post', { 
            contextUser: user, 
            contextUserId: user?.id,
            authStatus 
          });
          return;
        }
        
        console.log('✅ User authenticated via getUserAuthStatus, proceeding...');
      } catch (authError) {
        console.error('❌ Error checking auth status:', authError);
        Alert.alert('Error', 'Authentication check failed. Please try logging in again.');
        return;
      }
    }

    try {
      setIsModalVisible(false);
      
      // First upload the image if it exists
      let finalImageUrl = null;
      if (newPostData.imageUri) {
        try {
          const imageUploadResult = await postRepository.uploadImage(newPostData.imageUri, newPostData.title);
          finalImageUrl = imageUploadResult.url;
          console.log('Image uploaded successfully:', finalImageUrl);
        } catch (imageError) {
          console.error('Failed to upload image:', imageError);
          Alert.alert('Warning', 'Failed to upload image, but proceeding with post creation.');
        }
      }

      const createdPost = await postRepository.createPost({
        title: newPostData.title,
        content: newPostData.content,
        image: finalImageUrl || newPostData.image || null,
        userId: user?.id || (await getUserAuthStatus()).userId, // Ensure userId is included
        imageUri: null, // We don't need to store the local URI
      });

      console.log('Post created successfully in DB:', createdPost);

      if (activeTab !== 'all') {
        setActiveTab('all');
      }
      setRefreshKeyAllPosts(prevKey => prevKey + 1);

    } catch (error) {
      console.error('Failed to create post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'all':
        return <AllPostsScreen searchTerm={searchTerm} key={`all-${searchTerm}-${refreshKeyAllPosts}`} />;
      case 'followed':
        return <FollowedPostsScreen searchTerm={searchTerm} key={`followed-${searchTerm}`} />;
      case 'saved':
        // Removed searchTerm prop as SavedPostsScreen might not use it directly
        // If client-side filtering is needed, it can be added within SavedPostsScreen itself
        return <SavedPostsScreen key={`saved-${searchTerm}`} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PostFilter onTabChange={handleTabChange} onSearch={handleSearch} activeTab={activeTab} />
        <View style={styles.contentContainer}>
          {renderActiveScreen()}
        </View>
        <SquareAddButton onPress={() => setIsModalVisible(true)} />
        {isModalVisible && (
          <CreatePostModal
            visible={isModalVisible} // Corrected from isVisible to visible
            onClose={() => setIsModalVisible(false)}
            onSubmit={handleCreatePost} // This should now be compatible
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  container: {
    flex: 1,
    paddingHorizontal: 16, 
    paddingTop: 16, 
  },
  contentContainer: {
    flex: 1,
    marginTop: 16, 
  },
});

export default PostScreen;