import { useAuth } from '@/context/AuthContext';
import { LogOut, Wifi } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SimpleAuthHeader = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.statusBar}>
        <View style={styles.statusInfo}>
          <Wifi size={14} color="#10b981" />
          <Text style={styles.statusText}>
            Conectado como {user?.username || 'Usuario'} 
          </Text>
          <Text style={styles.statusText}>
            {user?.email || 'Email Desconocido'}
          </Text>
          <Text style={styles.statusText}>
            {user?.id || 'ID Desconocido'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <LogOut size={14} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 6,
  },
  logoutButton: {
    padding: 4,
  },
});

export default SimpleAuthHeader;