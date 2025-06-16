import { ProfileUpdateData, ProfileWithUser, supabaseProfileRepository } from '@/api/supabaseProfileRepository';
import * as ImagePicker from 'expo-image-picker';
import { Briefcase, Calendar, Camera, Heart, MapPin, Save, User, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProfileEditModalProps {
    visible: boolean;
    onClose: () => void;
    profile: ProfileWithUser | null;
    userId: number;
    onProfileUpdated: (updatedProfile: ProfileWithUser) => void;
}

export default function ProfileEditModal({
    visible,
    onClose,
    profile,
    userId,
    onProfileUpdated,
}: ProfileEditModalProps) {
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState<{
        bio: string;
        birth_date: string;
        location: string;
        interests: string;
        speciality: string;
        profile_picture: string | null;
    }>({
        bio: '',
        birth_date: '',
        location: '',
        interests: '',
        speciality: '',
        profile_picture: null,
    });

    // Date picker state - separate day, month, year
    const [dateComponents, setDateComponents] = useState({
        day: '',
        month: '',
        year: ''
    });

    // Initialize form data when profile changes
    useEffect(() => {
        if (profile) {
            setFormData({
                bio: profile.bio || '',
                birth_date: profile.birth_date || '',
                location: profile.location || '',
                interests: profile.interests || '',
                speciality: profile.speciality || '',
                profile_picture: profile.profile_picture || null,
            });

            // Parse existing birth date
            if (profile.birth_date) {
                const dateParts = profile.birth_date.split('-');
                if (dateParts.length === 3) {
                    setDateComponents({
                        year: dateParts[0] || '',
                        month: dateParts[1] || '',
                        day: dateParts[2] || ''
                    });
                }
            }
        }
    }, [profile]);

    // Update birth_date when date components change
    useEffect(() => {
        if (dateComponents.year && dateComponents.month && dateComponents.day) {
            const formattedDate = `${dateComponents.year}-${dateComponents.month.padStart(2, '0')}-${dateComponents.day.padStart(2, '0')}`;
            setFormData(prev => ({ ...prev, birth_date: formattedDate }));
        } else {
            setFormData(prev => ({ ...prev, birth_date: '' }));
        }
    }, [dateComponents]);    const handleSave = async () => {
        console.log('=== PROFILE SAVE DEBUG ===');
        console.log('User ID:', userId, 'Type:', typeof userId);
        console.log('Form Data:', formData);
        console.log('Date Components:', dateComponents);
        
        // Check for valid userId first
        if (!userId || userId === 0 || isNaN(userId)) {
            console.error('Invalid user ID detected:', userId);
            Alert.alert('Error', 'Invalid user ID. Please try refreshing the page.');
            return;
        }

        // Basic validation
        if (!formData.bio.trim()) {
            Alert.alert('Validation Error', 'Bio is required. Please tell us about yourself.');
            return;
        }

        if (!formData.location.trim()) {
            Alert.alert('Validation Error', 'Location is required. Please specify your location.');
            return;
        }

        if (formData.birth_date && !isValidDate(formData.birth_date)) {
            console.error('Invalid date detected:', formData.birth_date);
            Alert.alert('Validation Error', 'Please enter a valid birth date.');
            return;
        }

        setLoading(true);
        try {
            const updateData: ProfileUpdateData = {
                bio: formData.bio.trim(),
                birth_date: formData.birth_date || undefined,
                location: formData.location.trim(),
                interests: formData.interests.trim(),
                speciality: formData.speciality.trim(),
                profile_picture: formData.profile_picture,
            };

            console.log('Sending update data to Supabase:', updateData);
            console.log('User ID being sent:', userId);
            
            const updatedProfile = await supabaseProfileRepository.updateProfile(userId, updateData);
            console.log('Profile updated successfully:', updatedProfile);

            // Get the full profile with user data
            const fullProfile = await supabaseProfileRepository.getProfileByUserId(userId);
            console.log('Full profile retrieved:', fullProfile);

            if (fullProfile) {
                onProfileUpdated(fullProfile);
            }

            Alert.alert('Success', 'Profile updated successfully!');
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            console.error('Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                userId,
                formData
            });
            Alert.alert('Error', `Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const isValidDate = (dateString: string) => {
        if (!dateString) return true; // Empty date is valid (optional field)
        
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        const timestamp = date.getTime();

        if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;

        // Check if the date is in the past and not too far back
        const now = new Date();
        const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());

        return date < now && date > hundredYearsAgo;
    };

    const handleImagePick = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission required', 'Permission to access camera roll is required!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setImageUploading(true);
                try {
                    // Convert URI to blob for upload
                    const response = await fetch(result.assets[0].uri);
                    const blob = await response.blob();

                    const fileName = `profile-${Date.now()}.jpg`;
                    const imageUrl = await supabaseProfileRepository.uploadProfilePicture(
                        userId,
                        blob,
                        fileName
                    );

                    setFormData(prev => ({ ...prev, profile_picture: imageUrl }));
                } catch (error) {
                    console.error('Error uploading image:', error);
                    Alert.alert('Error', 'Failed to upload image. Please try again.');
                } finally {
                    setImageUploading(false);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const handleDateComponentChange = (component: 'day' | 'month' | 'year', value: string) => {
        setDateComponents(prev => ({ ...prev, [component]: value }));
    };

    // Get current year for validation
    const currentYear = new Date().getFullYear();

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <Save size={18} color="white" />
                                <Text style={styles.saveButtonText}>Save</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Profile Picture Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Profile Picture</Text>
                        <View style={styles.imageSection}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={
                                        formData.profile_picture
                                            ? { uri: formData.profile_picture }
                                            : require('@/assets/images/default-avatar.png')
                                    }
                                    style={styles.profileImage}
                                />
                                <TouchableOpacity
                                    style={styles.imageEditButton}
                                    onPress={handleImagePick}
                                    disabled={imageUploading}
                                >
                                    {imageUploading ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Camera size={16} color="white" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Bio Section */}
                    <View style={styles.section}>
                        <View style={styles.inputHeader}>
                            <User size={20} color="#6B7280" />
                            <Text style={styles.inputLabel}>Bio</Text>
                        </View>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={formData.bio}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                            placeholder="Tell us about yourself..."
                            multiline
                            numberOfLines={4}
                            maxLength={500}
                        />
                        <Text style={styles.charCount}>{formData.bio.length}/500</Text>
                    </View>

                    {/* Birth Date Section with Mobile-Friendly Date Inputs */}
                    <View style={styles.section}>
                        <View style={styles.inputHeader}>
                            <Calendar size={20} color="#6B7280" />
                            <Text style={styles.inputLabel}>Birth Date</Text>
                        </View>
                        
                        <View style={styles.datePickerContainer}>
                            {/* Day Selector */}
                            <View style={styles.dateSelector}>
                                <Text style={styles.dateSelectorLabel}>Day</Text>
                                <TextInput
                                    style={styles.dateInput}
                                    value={dateComponents.day}
                                    onChangeText={(value) => {
                                        const numValue = value.replace(/[^0-9]/g, '');
                                        if (numValue === '' || (parseInt(numValue) >= 1 && parseInt(numValue) <= 31)) {
                                            handleDateComponentChange('day', numValue);
                                        }
                                    }}
                                    placeholder="DD"
                                    keyboardType="numeric"
                                    maxLength={2}
                                />
                            </View>
                            
                            {/* Month Selector */}
                            <View style={styles.dateSelector}>
                                <Text style={styles.dateSelectorLabel}>Month</Text>
                                <TextInput
                                    style={styles.dateInput}
                                    value={dateComponents.month}
                                    onChangeText={(value) => {
                                        const numValue = value.replace(/[^0-9]/g, '');
                                        if (numValue === '' || (parseInt(numValue) >= 1 && parseInt(numValue) <= 12)) {
                                            handleDateComponentChange('month', numValue);
                                        }
                                    }}
                                    placeholder="MM"
                                    keyboardType="numeric"
                                    maxLength={2}
                                />
                            </View>
                              {/* Year Selector */}
                            <View style={styles.dateSelector}>
                                <Text style={styles.dateSelectorLabel}>Year</Text>
                                <TextInput
                                    style={styles.dateInput}
                                    value={dateComponents.year}
                                    onChangeText={(value) => {
                                        const numValue = value.replace(/[^0-9]/g, '');
                                        // Allow any 4-digit year or partial input
                                        if (numValue === '' || numValue.length <= 4) {
                                            // Only validate if it's a complete 4-digit year
                                            if (numValue.length === 4) {
                                                const yearNum = parseInt(numValue);
                                                if (yearNum >= 1900 && yearNum <= currentYear) {
                                                    handleDateComponentChange('year', numValue);
                                                }
                                            } else {
                                                // Allow partial input for years
                                                handleDateComponentChange('year', numValue);
                                            }
                                        }
                                    }}
                                    placeholder="YYYY"
                                    keyboardType="numeric"
                                    maxLength={4}
                                />
                            </View>
                        </View>
                        
                        {formData.birth_date && (
                            <Text style={styles.inputHint}>Selected: {formData.birth_date}</Text>
                        )}
                    </View>

                    {/* Location Section */}
                    <View style={styles.section}>
                        <View style={styles.inputHeader}>
                            <MapPin size={20} color="#6B7280" />
                            <Text style={styles.inputLabel}>Location</Text>
                        </View>
                        <TextInput
                            style={styles.textInput}
                            value={formData.location}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                            placeholder="City, Country"
                            maxLength={100}
                        />
                        <Text style={styles.inputHint}>Where are you based?</Text>
                    </View>

                    {/* Speciality Section */}
                    <View style={styles.section}>
                        <View style={styles.inputHeader}>
                            <Briefcase size={20} color="#6B7280" />
                            <Text style={styles.inputLabel}>Speciality</Text>
                        </View>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={formData.speciality}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, speciality: text }))}
                            placeholder="Your professional speciality or field of expertise..."
                            multiline
                            numberOfLines={3}
                            maxLength={300}
                        />
                        <Text style={styles.charCount}>{formData.speciality.length}/300</Text>
                    </View>

                    {/* Interests Section */}
                    <View style={styles.section}>
                        <View style={styles.inputHeader}>
                            <Heart size={20} color="#6B7280" />
                            <Text style={styles.inputLabel}>Interests</Text>
                        </View>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={formData.interests}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, interests: text }))}
                            placeholder="Your hobbies and interests..."
                            multiline
                            numberOfLines={3}
                            maxLength={300}
                        />
                        <Text style={styles.charCount}>{formData.interests.length}/300</Text>
                    </View>

                    {/* Bottom spacing */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    inputHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#111827',
        backgroundColor: 'white',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'right',
        marginTop: 4,
    },
    inputHint: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    datePickerContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    dateSelector: {
        flex: 1,
    },
    dateSelectorLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#111827',
        backgroundColor: 'white',
        textAlign: 'center',
    },
    imageSection: {
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
    },
    imageEditButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3B82F6',
        borderRadius: 18,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    bottomSpacing: {
        height: 20,
    },
});
