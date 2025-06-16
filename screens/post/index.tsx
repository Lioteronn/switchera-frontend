import CreatePostModal from '@/components/postPage/CreatePostModal';
import PostCard from '@/components/postPage/PostCard';
import PostFilter from '@/components/postPage/PostFilter';
import { getSavedPosts } from '@/components/postPage/PostUtils';
import SquareAddButton from '@/components/servicePage/SquareAddButton';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';



// Constants for responsive design
const MAX_CONTENT_WIDTH = 1200; // Wider desktop layout
const MOBILE_CARD_WIDTH = 500;
const ACCENT_COLOR = '#84cc16'; // Yellowish green accent color
const SCREEN_HEIGHT = Dimensions.get('window').height;



// Datos simulados para publicaciones
const mockPosts = [
  {
    id: 'post1',
    userId: 'user123',
    userName: 'switchera',
    userImage: 'assets/images/default-profile.png',
    title: 'Aprendiendo React Native',
    categories: ['Programación', 'Móvil'],
    description: '¡Acabo de terminar mi primera app en React Native! El camino fue desafiante pero muy gratificante. Comparto algunos aprendizajes y consejos para principiantes.',
    photos: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c'],
    likes: 24,
    comments: 5
  },
  {
    id: 'post2',
    userId: 'user456',
    userName: 'Maria Garcia',
    userImage: null,
    title: 'Photography Tips for Beginners',
    categories: ['Photography', 'Art'],
    description: 'Here are some essential photography tips I learned over the years. Proper lighting makes all the difference!',
    photos: [
      'https://images.unsplash.com/photo-1554080353-a576cf803bda',
      'https://images.unsplash.com/photo-1552168324-d612d77725e3'
    ],
    likes: 42,
    comments: 8
  },
  {
    id: 'post3',
    userId: 'user789',
    userName: 'John Smith',
    userImage: 'https://randomuser.me/api/portraits/men/65.jpg',
    title: 'My Travel Adventures',
    categories: ['Travel', 'Lifestyle'],
    description: 'Sharing some amazing moments from my trip around Europe. Visit these places if you get a chance!',
    photos: [
      'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
      'https://images.unsplash.com/photo-1528127269322-539801943592',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
    ],
    likes: 78,
    comments: 15
  }
];

// Mock followed users
const followedUsers = ['user123'];

const PostScreen = () => {

  const { width} = Dimensions.get('window');
  const isDesktop = width > MAX_CONTENT_WIDTH;

  const [posts, setPosts] = useState(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  const [activeTab, setActiveTab] = useState<'all' | 'followed' | 'saved'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle creating a new post
  type Post = typeof mockPosts[number];

  // Function to filter posts based on tab and search term
  useEffect(() => {
    filterPosts(activeTab, searchTerm);
  }, [activeTab, searchTerm, posts]);

  const filterPosts = async (tab: 'all' | 'followed' | 'saved', search: string) => {
    let filtered = [...posts];
    
    // Filter by tab
    if (tab === 'followed') {
      filtered = filtered.filter(post => followedUsers.includes(post.userId));
    } else if (tab === 'saved') {
      const savedPostIds = await getSavedPosts();
      filtered = filtered.filter(post => savedPostIds.includes(post.id));
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower) ||
        post.categories.some(cat => cat.toLowerCase().includes(searchLower)) ||
        post.userName.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredPosts(filtered);
  };

  const handleTabChange = (tab: 'all' | 'followed' | 'saved') => {
    setActiveTab(tab);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.container}>
      <PostFilter  
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSearch={handleSearch}
      />

      <ScrollView style={styles.scrollView}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <View key={post.id} style={styles.cardContainer}>
              <PostCard 
                postId={post.id}
                userId={post.userId}
                userName={post.userName}
                userImage={post.userImage}
                title={post.title}
                categories={post.categories}
                description={post.description}
                photos={post.photos}
                initialLikes={post.likes}
                initialComments={post.comments}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'all' ? 
                'No posts found. Try a different search term.' : 
                activeTab === 'followed' ? 
                  'No posts from followed users. Try following someone!' : 
                  'No saved posts yet. Save posts to see them here!'}
            </Text>
          </View>
        )}
      </ScrollView>

      <SquareAddButton
        onPress={() => setIsModalVisible(true)}
        color={ACCENT_COLOR}
        size={60}
        iconSize={32}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreatePost}
      />


      {isModalVisible && (
        <CreatePostModal 
          visible={isModalVisible} 
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleCreatePost}
        />
      )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  container: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  }
});

export default PostScreen;