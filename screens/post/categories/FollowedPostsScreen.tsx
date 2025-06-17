import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Post, postRepository } from '../../../api/postRepository';
import PostCard from '../../../components/postPage/PostCard';
import { useSavedPosts } from '../../../context/SavedPostsContext';

interface FollowedPostsScreenProps {
  searchTerm?: string;
}

const FollowedPostsScreen: React.FC<FollowedPostsScreenProps> = ({ searchTerm }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toggleSavePost, isPostSaved } = useSavedPosts();

  const fetchFollowedPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedPosts = await postRepository.getFollowedUsersPosts();
      setPosts(fetchedPosts);
    } catch (e: any) {
      if (e.message.includes('User not authenticated')) {
        setError('Please log in to see posts from users you follow.');
      } else {
        setError(e.message || 'Failed to fetch posts from followed users');
      }
      console.error(e);
      setPosts([]); // Clear posts on auth error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowedPosts();
  }, [fetchFollowedPosts]);

  useEffect(() => {
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.title?.toLowerCase().includes(lowerSearchTerm) ||
            post.content?.toLowerCase().includes(lowerSearchTerm) ||
            post.author_username?.toLowerCase().includes(lowerSearchTerm)
        )
      );
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFollowedPosts();
    setRefreshing(false);
  }, [fetchFollowedPosts]);

  if (loading && posts.length === 0) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>Error: {error}</Text></View>;
  }

  if (filteredPosts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>{searchTerm ? 'No posts match your search from followed users.' : 'No posts from users you follow yet, or you might need to log in.'}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredPosts}
      keyExtractor={(item) => item.id!}
      renderItem={({ item }) => (
        <View style={styles.postContainer}>
          <PostCard
            postId={item.id!}
            userId={item.author_id.toString()}
            userName={item.author_username || 'Unknown User'}
            userImage={item.author_profile_picture || null}
            title={item.title}
            categories={[]} // Replace with actual categories if available
            description={item.content}
            photos={item.image ? [item.image] : []}
            initialLikes={item.likes_count}
          />
           {/* <Button title={isPostSaved(item.id!) ? "Unsave" : "Save"} onPress={() => toggleSavePost(item)} /> */}
        </View>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  postContainer: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  }
});

export default FollowedPostsScreen;
