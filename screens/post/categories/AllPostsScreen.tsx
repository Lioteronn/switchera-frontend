import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Post, postRepository } from '../../../api/postRepository';
import PostCard from '../../../components/postPage/PostCard'; // Adjust path as needed
import { useSavedPosts } from '../../../context/SavedPostsContext'; // To toggle save state

interface AllPostsScreenProps {
  searchTerm?: string;
}

const AllPostsScreen: React.FC<AllPostsScreenProps> = ({ searchTerm }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toggleSavePost, isPostSaved } = useSavedPosts();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedPosts = await postRepository.getAllPosts();
      setPosts(fetchedPosts);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch posts');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.title?.toLowerCase().includes(lowerSearchTerm) ||
            post.content?.toLowerCase().includes(lowerSearchTerm) ||
            post.author_username?.toLowerCase().includes(lowerSearchTerm)
          // Add more fields to search if needed, e.g., categories if they exist on Post
        )
      );
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  if (loading && posts.length === 0) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text>Error: {error}</Text></View>;
  }

  if (filteredPosts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>{searchTerm ? 'No posts match your search.' : 'No posts available yet.'}</Text>
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
            categories={[]} // Replace with actual categories if available on 'item'
            description={item.content}
            photos={item.image ? [item.image] : []} 
            initialLikes={item.likes_count}
            // initialComments={item.comments_count} // PostCard might fetch its own
          />
          {/* Example: Add a save button, if PostCard doesn't handle it internally */}
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
    paddingHorizontal: 8, // Apply horizontal padding here if cards don't have their own
    // borderBottomWidth: 1, // Or let PostCard handle its own styling
    // borderBottomColor: '#eee',
  },
  listContent: {
    paddingVertical: 8, // Add vertical padding for the list itself
  }
});

export default AllPostsScreen;
