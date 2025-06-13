import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  status?: 'online' | 'offline' | 'away';
}

export interface ContactProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  status?: 'online' | 'offline' | 'away';
}

interface ContactsListProps {
  contacts?: Contact[];
  selectedContact?: Contact | null;
  onSelectContact: (contact: Contact) => void;
  mode: 'contacts' | 'chats';
}

export default function ContactsList({ 
  contacts = [], 
  selectedContact, 
  onSelectContact, 
  mode 
}: ContactsListProps) {
  
  const renderContactItem = (contact: Contact) => (
    <TouchableOpacity
      key={contact.id}
      style={[
        styles.contactItem,
        selectedContact?.id === contact.id && styles.selectedItem
      ]}
      onPress={() => onSelectContact(contact)}
    >
      {/* Avatar placeholder */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {contact.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        
        {mode === 'chats' && contact.lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {contact.lastMessage}
          </Text>
        )}
        
        {mode === 'contacts' && contact.status && (
          <Text style={[styles.status, { color: getStatusColor(contact.status) }]}>
            {contact.status}
          </Text>
        )}
      </View>
      
      <View style={styles.rightSection}>
        {mode === 'chats' && contact.timestamp && (
          <Text style={styles.timestamp}>{contact.timestamp}</Text>
        )}
        
        {contact.unreadCount && contact.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {mode === 'contacts' ? 'Contacts' : 'Chats'}
        </Text>
      </View>
      
      {/* Contacts/Chats List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {contacts.length > 0 ? (
          contacts.map(renderContactItem)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {mode === 'contacts' ? 'No contacts found' : 'No chats available'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
});