import Badges from '@/components/profilePage/Badges';
// Update the import path below if the actual location is different
import ProfileInfo from '@/components/profilePage/ProfileInfo';
import SkillsPanel from '@/components/profilePage/SkillsPanel';
import StatisticsPanel from '@/components/profilePage/StatisticsPanel';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import FriendsList from '../../components/profilePage/FriendsList';

// Constants for responsive design
const MAX_CONTENT_WIDTH = 1200; // Wider desktop layout
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ProfileScreen() {
  // Get device dimensions to adapt layout
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  // TODO: Replace these with real values from your authentication/user context
  const userId = 'demoUserId';
  const currentUserId = 'demoUserId'; // Set same as userId for demo to show owner view

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: MAX_CONTENT_WIDTH,
      alignSelf: 'center',
      padding: isDesktop ? 24 : 16,
    },
    contentWrapper: {
      flexDirection: isDesktop ? 'row' : 'column',
      gap: 16,
    },
    scrollContent: {
      flexGrow: 1,
    },
    mainColumn: {
      flex: isDesktop ? 2 : undefined,
      width: isDesktop ? undefined : '100%',
      gap: 16,
    },
    sideColumn: {
      flex: isDesktop ? 1 : undefined,
      width: isDesktop ? undefined : '100%',
      gap: 16,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    sectionSpacing: {
      height: 16,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            {/* Main content column */}
            <View style={styles.mainColumn}>
              {/* Profile Info Card */}
              <View style={styles.card}>
                <ProfileInfo userId={userId} currentUserId={currentUserId} />
              </View>
              
              {/* Skills Panel (Teaching/Learning) */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Skills & Services</Text>
                <SkillsPanel userId={userId} isCurrentUser={userId === currentUserId} />
              </View>
              
              {/* Statistics Panel */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Activity Statistics</Text>
                <StatisticsPanel userId={userId} />
              </View>
            </View>
            
            {/* Side column for desktop, or below main content for mobile */}
            <View style={styles.sideColumn}>
              {/* Badges */}
              <View style={styles.card}>
                <Badges userId={userId} showFeaturedOnly={true} />
              </View>
              
              {/* Friends List */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Friends</Text>
                <FriendsList 
                  userId={userId} 
                  isCurrentUser={userId === currentUserId} 
                  showSuggested={userId === currentUserId}
                  maxVisibleFriends={isDesktop ? 6 : 4}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}