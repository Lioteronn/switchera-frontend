import Badges from '@/components/profilePage/Badges';
import ProfileInfo from '@/components/profilePage/ProfileInfo';
import SkillsPanel from '@/components/profilePage/SkillsPanel';
import StatisticsPanel from '@/components/profilePage/StatisticsPanel';
import { ActivityIndicator, Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

import FriendsListCompact from '@/components/profilePage/FriendsListCompact';

import { profileApi } from '@/api/profile';
import { useAuth } from '@/context/AuthContext';
import { Friend } from '@/types/profile';
import { useRouter } from 'expo-router';
import { AlertCircle, ChevronRight, LogOut, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';

// Constants for responsive design
const MAX_CONTENT_WIDTH = 1200;

export default function ProfileScreen() {
  // Get device dimensions to adapt layout
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const router = useRouter();

  const { logout, user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [badges, setBadges] = useState([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [services, setServices] = useState([]);
  const [registeredServices, setRegisteredServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchAllProfileData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch user profile
      const profile = await profileApi.getMyProfile();
      setProfileData(profile);
      
      if (!profile.bio) {
        setShowOnboarding(true);
        setLoading(false);
        return;
      }
      
      // Fetch additional data in parallel
      const [badgesData, friendsData, servicesData, registrationsData] = await Promise.all([
        profileApi.getBadges(),
        profileApi.getFriends ? profileApi.getFriends() : Promise.resolve([]), 
        profileApi.getServices(),
        profileApi.getRegisteredServices()
      ]);
      
      setBadges(badgesData);
      setFriends(
        (Array.isArray(friendsData) ? friendsData : (friendsData?.data ?? []))
          .map((friend: any) => ({
            ...friend,
            image: friend.image === null ? undefined : friend.image,
          }))
      );
      setServices(servicesData);
      setRegisteredServices(registrationsData);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllProfileData();
    setRefreshing(false);
  };
  
  const handleOnboardingComplete = async (data: any) => {
    try {
      await profileApi.updateProfile(data);
      setShowOnboarding(false);
      await fetchAllProfileData();
    } catch (err) {
      console.error('Error completing onboarding:', err);
      Alert.alert('Error', 'Failed to save profile data. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAllProfileData();
    }
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const userId = user?.id ? String(user.id) : '';
  const currentUserId = user?.id ? String(user.id) : '';

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
    // Estilos para el botón de logout
    logoutSection: {
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      padding: 16,
      marginTop: 16,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fef2f2',
      borderWidth: 1,
      borderColor: '#fecaca',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    logoutText: {
      color: '#ef4444',
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 8,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EFF6FF',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    viewAllText: {
      color: '#3B82F6',
      fontSize: 14,
      fontWeight: '600',
      marginRight: 4,
    },
    authStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      padding: 8,
      backgroundColor: '#f0fdf4',
      borderRadius: 6,
    },
    authStatusText: {
      color: '#15803d',
      fontSize: 14,
      fontWeight: '500',
      marginLeft: 8,
    },
    // Loading styles
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: '#6B7280',
    },
    // Error styles
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      marginTop: 16,
      fontSize: 16,
      color: '#EF4444',
      textAlign: 'center',
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: '#3B82F6',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    retryButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    // Onboarding modal styles
    onboardingContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    onboardingContent: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      width: '90%',
      maxWidth: 500,
    },
  });

  // Show loading indicator while data is being fetched
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error message if something went wrong
  if (error && !refreshing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <View style={styles.errorContainer}>
          <AlertCircle size={40} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchAllProfileData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            {/* Main content column */}
            <View style={styles.mainColumn}>
              {/* Profile Info Card */}
              <View style={styles.card}>
                <ProfileInfo 
                  userId={userId} 
                  currentUserId={currentUserId} 
                  profile={profileData}
                  onProfileUpdate={handleOnboardingComplete}
                />
              </View>
              
              {/* Skills Panel (Teaching/Learning) */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Skills & Services</Text>
                <SkillsPanel 
                  userId={userId} 
                  isCurrentUser={userId === currentUserId}
                />
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
                <Badges 
                  userId={userId} 
                  showFeaturedOnly={true}
                  badges={badges}
                />
              </View>
              
              {/* Friends List */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Friends</Text>
                <FriendsListCompact 
                  showSuggested={userId === currentUserId}
                  userId={userId}
                  isCurrentUser={userId === currentUserId}
                  maxVisibleFriends={isDesktop ? 6 : 4}
                  friends={friends.map(friend => ({
                    ...friend,
                    image: friend.image === undefined ? null : friend.image,
                  }))}
                  onFriendRemoved={(id) => {
                    setFriends(friends.filter(friend => friend.id !== id));
                  }}
                  onFriendBlocked={(id) => {
                    setFriends(friends.map(friend => 
                      friend.id === id ? { ...friend, blocked: true } : friend
                    ));
                  }}
                  onFriendUnblocked={(id) => {
                    setFriends(friends.map(friend => 
                      friend.id === id ? { ...friend, blocked: false } : friend
                    ));
                  }}
                />
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => router.push('/(tabs)/profile/friends')}
                >
                  <Text style={styles.viewAllText}>View All Friends</Text>
                  <ChevronRight size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
              
              {/* Auth Status & Logout Section */}
              {isAuthenticated && (
                <View style={styles.logoutSection}>
                  {/* Estado de autenticación */}
                  <View style={styles.authStatus}>
                    <User size={16} color="#15803d" />
                    <Text style={styles.authStatusText}>Sesión activa</Text>
                  </View>
                  
                  {/* Botón de logout */}
                  <TouchableOpacity 
                    style={styles.logoutButton} 
                    onPress={handleLogout}
                  >
                    <LogOut size={20} color="#ef4444" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}