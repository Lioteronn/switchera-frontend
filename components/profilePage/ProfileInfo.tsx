import * as ImagePicker from 'expo-image-picker';
import { Camera, Check, Edit2, ExternalLink, Instagram, Mail, Phone, Star, Twitter, User, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SocialLink {
  type: 'twitter' | 'instagram' | 'email' | 'phone';
  url: string;
  visible: boolean;
}

interface UserProfile {
  id: string;
  username: string;
  photo: string | null;
  rating: number;
  description: string;
  socials: SocialLink[];
}

interface ProfileInfoProps {
  userId: string;
  currentUserId: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userId, currentUserId }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const isOwner = userId === currentUserId;

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      if (isOwner) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'We need camera roll permissions to let you update your profile photo.'
          );
        }
      }
    })();
  }, [isOwner]);
  
  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, replace with actual API call
      // const response = await fetch(`/api/users/${userId}/profile`);
      // const data = await response.json();
      
      // Simulating API fetch with mock data
      const data = await mockFetchUserProfile(userId);
      setProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = () => {
    setEditedProfile({...profile!});
    setIsEditing(true);
  };
  
  const handleSave = async () => {
    if (!editedProfile) return;
    
    setIsSaving(true);
    try {
      // In a real app, send update to server
      // await fetch(`/api/users/${userId}/profile`, {
      //   method: 'PUT',
      //   body: JSON.stringify(editedProfile),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Simulate API update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state with edited profile
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(null);
  };
  
  const toggleSocialVisibility = (index: number) => {
    if (!editedProfile) return;
    
    const updatedSocials = [...editedProfile.socials];
    updatedSocials[index] = {
      ...updatedSocials[index],
      visible: !updatedSocials[index].visible
    };
    
    setEditedProfile({
      ...editedProfile,
      socials: updatedSocials
    });
  };
  
  const updateSocialLink = (index: number, value: string) => {
    if (!editedProfile) return;
    
    const updatedSocials = [...editedProfile.socials];
    updatedSocials[index] = {
      ...updatedSocials[index],
      url: value
    };
    
    setEditedProfile({
      ...editedProfile,
      socials: updatedSocials
    });
  };

  // Image picker function
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Update edited profile with selected image
        if (editedProfile) {
          setEditedProfile({
            ...editedProfile,
            photo: result.assets[0].uri
          });
        }

        // In a real app, you'd upload the image to a server here
        // and get back a URL to store in the profile
        // const formData = new FormData();
        // formData.append('photo', {
        //   uri: result.assets[0].uri,
        //   type: 'image/jpeg', // Or detect the type
        //   name: 'profile-photo.jpg'
        // });
        // await fetch('/api/upload', { method: 'POST', body: formData });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };
  
  const renderSocialIcon = (type: string) => {
    switch (type) {
      case 'twitter':
        return <Twitter size={20} color="#1DA1F2" />;
      case 'instagram':
        return <Instagram size={20} color="#E1306C" />;
      case 'email':
        return <Mail size={20} color="#4285F4" />;
      case 'phone':
        return <Phone size={20} color="#0F9D58" />;
      default:
        return <ExternalLink size={20} color="#718096" />;
    }
  };
  
  const getSocialLabel = (type: string) => {
    switch (type) {
      case 'twitter':
        return 'Twitter';
      case 'instagram':
        return 'Instagram';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      default:
        return 'Link';
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }
  
  // Error state
  if (error || !profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Profile not found'}</Text>
        <TouchableOpacity onPress={fetchUserProfile}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.photoContainer}>
            {profile.photo ? (
              <Image source={{ uri: profile.photo }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.placeholderPhoto}>
                <User size={50} color="#9CA3AF" />
              </View>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{profile.username}</Text>
            <View style={styles.ratingContainer}>
              <Star 
                size={16} 
                color="#FBBF24" 
                fill="#FBBF24" 
                style={styles.starIcon} 
              />
              <Text style={styles.ratingText}>{profile.rating.toFixed(1)}</Text>
            </View>
          </View>
          
          {isOwner && (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Edit2 size={20} color="#4B5563" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.profileBody}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {profile.description || 'No description provided'}
          </Text>
          
          {profile.socials && profile.socials.length > 0 && (
            <View style={styles.socialsSection}>
              <Text style={styles.sectionTitle}>Connect</Text>
              <View style={styles.socialLinks}>
                {profile.socials
                  .filter(social => social.visible && social.url)
                  .map((social, index) => (
                    <TouchableOpacity 
                      key={`${social.type}-${index}`}
                      style={styles.socialLink}
                      onPress={() => {
                        // Handle opening the link based on type
                        // For example, email links would use mailto:, phone would use tel:, etc.
                      }}
                    >
                      {renderSocialIcon(social.type)}
                      <Text style={styles.socialLinkText}>
                        {getSocialLabel(social.type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          )}
        </View>
      </View>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCancel}
              >
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {editedProfile && (
                <>
                  {/* Profile photo picker */}
                  <View style={styles.photoPickerContainer}>
                    <TouchableOpacity
                      style={styles.photoPicker}
                      onPress={pickImage}
                    >
                      {editedProfile.photo ? (
                        <Image 
                          source={{ uri: editedProfile.photo }} 
                          style={styles.photoPreview} 
                        />
                      ) : (
                        <View style={styles.photoPlaceholder}>
                          <User size={40} color="#9CA3AF" />
                        </View>
                      )}
                      <View style={styles.cameraIconContainer}>
                        <Camera size={16} color="#fff" />
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.photoPickerText}>
                      Tap to change profile photo
                    </Text>
                  </View>

                  <Text style={styles.fieldLabel}>Username</Text>
                  <TextInput
                    style={styles.input}
                    value={editedProfile.username}
                    onChangeText={(text) => setEditedProfile({...editedProfile, username: text})}
                    placeholder="Your username"
                  />
                  
                  <Text style={styles.fieldLabel}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editedProfile.description}
                    onChangeText={(text) => setEditedProfile({...editedProfile, description: text})}
                    placeholder="Tell us about yourself"
                    multiline
                    numberOfLines={4}
                  />
                  
                  <Text style={styles.fieldLabel}>Social Links</Text>
                  {editedProfile.socials.map((social, index) => (
                    <View key={`edit-${social.type}-${index}`} style={styles.socialEditRow}>
                      <View style={styles.socialTypeContainer}>
                        {renderSocialIcon(social.type)}
                        <Text style={styles.socialTypeText}>{getSocialLabel(social.type)}</Text>
                      </View>
                      
                      <TextInput
                        style={styles.socialInput}
                        value={social.url}
                        onChangeText={(text) => updateSocialLink(index, text)}
                        placeholder={`Your ${getSocialLabel(social.type)}`}
                      />
                      
                      <TouchableOpacity 
                        style={[
                          styles.visibilityToggle,
                          social.visible ? styles.visibilityOn : styles.visibilityOff
                        ]}
                        onPress={() => toggleSocialVisibility(index)}
                      >
                        {social.visible ? (
                          <Check size={16} color="#fff" />
                        ) : (
                          <X size={16} color="#fff" />
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Mock data fetching function
const mockFetchUserProfile = async (userId: string): Promise<UserProfile> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data
  return {
    id: userId,
    username: "SwitcheraUser",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8,
    description: "Hello! I'm a passionate developer who loves creating amazing applications with React Native and TypeScript. I enjoy sharing knowledge and connecting with other developers.",
    socials: [
      {
        type: "twitter",
        url: "https://twitter.com/yourusername",
        visible: true
      },
      {
        type: "instagram",
        url: "https://instagram.com/yourusername",
        visible: true
      },
      {
        type: "email",
        url: "user@example.com",
        visible: false
      },
      {
        type: "phone",
        url: "+1234567890",
        visible: false
      }
    ]
  };
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoContainer: {
    marginRight: 16,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  placeholderPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
  profileBody: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  socialsSection: {
    marginTop: 8,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  socialLinkText: {
    marginLeft: 6,
    color: '#4B5563',
    fontWeight: '500',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    padding: 16,
  },
  photoPickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoPicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
    marginBottom: 8,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  photoPickerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  socialEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    marginRight: 8,
  },
  socialTypeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4B5563',
  },
  socialInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginRight: 8,
    backgroundColor: '#F9FAFB',
  },
  visibilityToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visibilityOn: {
    backgroundColor: '#10B981',
  },
  visibilityOff: {
    backgroundColor: '#9CA3AF',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProfileInfo;