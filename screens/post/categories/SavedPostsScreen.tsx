import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { Post, postRepository } from '../../../api/postRepository';
import PostCard from '../../../components/postPage/PostCard'; // Adjust path as needed
import { useSavedPosts } from '../../../context/SavedPostsContext';

const SavedPostsScreen = () => {
  const { savedPosts: savedPostSummaries, toggleSavePost, isPostSaved } = useSavedPosts();
  const [detailedSavedPosts, setDetailedSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedPostDetails = async () => {
      if (savedPostSummaries.length === 0) {
        setDetailedSavedPosts([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const postIds = savedPostSummaries.map(p => p.id!).filter(id => id);
        if (postIds.length > 0) {
            const posts = await postRepository.getPostsByIds(postIds);
            // Filter out posts that might have been unsaved while fetching
            const currentSavedIds = new Set(savedPostSummaries.map(p => p.id));
            const relevantPosts = posts.filter(p => currentSavedIds.has(p.id));
            setDetailedSavedPosts(relevantPosts);
        } else {
            setDetailedSavedPosts([]);
        }
      } catch (e: any) {
        setError(e.message || 'Failed to fetch saved posts');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPostDetails();
  }, [savedPostSummaries]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text>Error: {error}</Text></View>;
  }

  if (detailedSavedPosts.length === 0) {
    return <View style={styles.centered}><Text>No posts saved yet.</Text></View>;
  }

  return (
    <FlatList
      data={detailedSavedPosts}
      keyExtractor={(item) => item.id!}
      renderItem={({ item }) => (
        <View style={styles.postContainer}>
          <PostCard 
            postId={item.id!} 
            userId={item.author_id.toString()} // Assuming author_id is number, PostCard might expect string
            userName={item.author_username || 'Unknown User'} 
            userImage={item.author_profile_picture || null}
            title={item.title}
            categories={[]} // Assuming categories are not part of the Post interface from API yet
            description={item.content}
            photos={item.image ? [item.image] : []} // Assuming item.image is a single URL string
            initialLikes={item.likes_count}
            // initialComments={item.comments_count} // PostCard might not need this if it fetches its own
          /> 
          <Button 
            title={isPostSaved(item.id!) ? "Unsave Post" : "Save Post"} 
            onPress={() => toggleSavePost(item)} 
          />
        </View>
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    marginBottom: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContent: {
    paddingHorizontal: 8,
  }
});

export default SavedPostsScreen;
