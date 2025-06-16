import { getUserAuthStatus } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import your components here when ready
import ChatDisplay from '@/components/activityPageNew/ChatDisplay';
import type { ContactProps } from '@/components/activityPageNew/ContactsList';
import ContactsList from '@/components/activityPageNew/ContactsList';
import { contacts as rawContacts } from '@/types/mockdata';

const { width } = Dimensions.get('window');

// Map contacts to ensure correct status type
const contacts: ContactProps[] = rawContacts.map((c) => ({
  ...c,
  status: c.status as 'online' | 'offline' | 'away' | undefined,
}));

export default function ActivityScreen() {
  const [selectedContact, setSelectedContact] = useState<ContactProps | null>(null);
  const [screenWidth, setScreenWidth] = useState(width);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const isWideScreen = screenWidth > 768; // Adjust this breakpoint as needed
  const isMediumScreen = screenWidth > 480 && screenWidth <= 768;
  const isMobile = screenWidth <= 480;

  useEffect(() => {
    // Get current user ID
    const getCurrentUser = async () => {
      const authStatus = await getUserAuthStatus();
      setCurrentUserId(authStatus.userId?.toString() || null);
    };
    getCurrentUser();
  }, []);


  useEffect(() => {
    const updateScreenData = () => {
      const { width } = Dimensions.get('window');
      setScreenWidth(width);
    };

    const subscription = Dimensions.addEventListener('change', updateScreenData);
    return () => subscription?.remove();
  }, []);

  const showBothPanels = isWideScreen;
  const showChatOnly = (isMediumScreen || isMobile) && selectedContact;
  const showContactsOnly = (isMediumScreen || isMobile) && !selectedContact;


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Left side - Contacts List */}
        {(showBothPanels || showContactsOnly) && (
          <View style={[
            styles.contactsContainer,
            isWideScreen && styles.wideContacts,
            isMediumScreen && styles.mediumContacts,
            isMobile && styles.mobileContacts,
          ]}>
            <ContactsList 
              contacts={contacts}
              onSelectContact={setSelectedContact}
              selectedContact={selectedContact}
              mode="chats"
            />
          </View>
        )}

        {/* Right side - Chat Display */}
        {(showBothPanels || showChatOnly) && (
          <View style={[
            styles.chatContainer,
            isWideScreen && styles.wideChat,
            isMediumScreen && styles.mediumChat,
            isMobile && styles.mobileChat,
          ]}>            <ChatDisplay 
              selectedContact={selectedContact}
              onBack={() => setSelectedContact(null)}
              currentUserId={currentUserId || "current-user-123"} // Use actual user ID or fallback
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2f1',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  contactsContainer: {
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e1dfdd',
  },
  chatContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  // Wide screen (Desktop) - Both panels visible
  wideContacts: {
    width: 320,
    minWidth: 280,
    maxWidth: 400,
  },
  wideChat: {
    flex: 1,
  },
  // Medium screen (iPad) - Single panel view
  mediumContacts: {
    width: '100%',
  },
  mediumChat: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Mobile - Single panel view
  mobileContacts: {
    width: '100%',
  },
  mobileChat: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});