import * as ImagePicker from 'expo-image-picker';
import { Camera, Trash, Upload, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

// Define service categories
const SERVICE_CATEGORIES = [
  'Programming',
  'Design',
  'Languages',
  'Music',
  'Wellness',
  'Cooking',
  'Education',
  'Business',
  'Art',
  'Technology',
  'Fitness',
  'Other'
];

// Define service durations
const SERVICE_DURATIONS = [30, 45, 60, 90];

// Define service modalities
const SERVICE_MODALITIES = ['online', 'in-person', 'both'] as const;

interface ServiceAddModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (serviceData: {
    title: string;
    description: string;
    price: number;
    duration: 30 | 45 | 60 | 90;
    modality: 'online' | 'in-person' | 'both';
    category: string;
    imageUri?: string;
  }) => Promise<void>;
}

const ServiceAddModal = ({ visible, onClose, onSubmit }: ServiceAddModalProps) => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState<30 | 45 | 60 | 90>(60);
  const [modality, setModality] = useState<'online' | 'in-person' | 'both'>('online');
  const [category, setCategory] = useState('Programming');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form state
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setDuration(60);
    setModality('online');
    setCategory('Programming');
    setImageUri(undefined);
    setError(null);
  };

  // Close modal and reset form
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    
    const priceValue = price ? parseFloat(price) : 0;
    if (isNaN(priceValue) || priceValue < 0) {
      setError('Price must be a valid number');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await onSubmit({
        title,
        description,
        price: priceValue,
        duration,
        modality,
        category,
        imageUri,
      });
      
      // Success - reset form and close modal
      resetForm();
      onClose();
    } catch (err) {
      setError('Failed to create service. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pick an image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Take a photo with the camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Remove the selected image
  const removeImage = () => {
    setImageUri(undefined);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Service</Text>
            <Pressable
              style={styles.closeButton}
              onPress={handleClose}
            >
              <X size={24} color="#666" />
            </Pressable>
          </View>

          <ScrollView style={styles.formScrollView}>
            {/* Error message if any */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter service title"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description*</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your service"
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
              />
            </View>

            {/* Price */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Price (€) - Enter 0 for free services</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            {/* Duration */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Duration (minutes)</Text>
              <View style={styles.optionsRow}>
                {SERVICE_DURATIONS.map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionButton,
                      duration === option && styles.optionButtonSelected
                    ]}
                    onPress={() => setDuration(option as 30 | 45 | 60 | 90)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        duration === option && styles.optionTextSelected
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Modality */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Modality</Text>
              <View style={styles.optionsRow}>
                {SERVICE_MODALITIES.map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionButton,
                      modality === option && styles.optionButtonSelected
                    ]}
                    onPress={() => setModality(option)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        modality === option && styles.optionTextSelected
                      ]}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Category */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoriesGrid}>
                {SERVICE_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryButton,
                      category === cat && styles.categoryButtonSelected
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text 
                      style={[
                        styles.categoryText,
                        category === cat && styles.categoryTextSelected
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Image Upload */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Service Image (Optional)</Text>

              {imageUri ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  <Pressable style={styles.removeImageButton} onPress={removeImage}>
                    <Trash size={20} color="white" />
                  </Pressable>
                </View>
              ) : (
                <View style={styles.imageButtons}>
                  <Pressable style={styles.imageButton} onPress={takePhoto}>
                    <Camera size={24} color="#4b5563" />
                    <Text style={styles.imageButtonText}>Camera</Text>
                  </Pressable>
                  <Pressable style={styles.imageButton} onPress={pickImage}>
                    <Upload size={24} color="#4b5563" />
                    <Text style={styles.imageButtonText}>Upload</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <Pressable
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitText}>Create Service</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  formScrollView: {
    padding: 16,
    maxHeight: '70%',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    minWidth: 70,
    backgroundColor: 'white',
  },
  optionButtonSelected: {
    backgroundColor: '#84cc16',
    borderColor: '#84cc16',
  },
  optionText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: 'white',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    margin: 4,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    minWidth: '30%',
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#84cc16',
    borderColor: '#84cc16',
  },
  categoryText: {
    color: '#4b5563',
  },
  categoryTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    backgroundColor: '#f9fafb',
    minWidth: 120,
  },
  imageButtonText: {
    marginTop: 8,
    color: '#4b5563',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    height: 180,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  submitButton: {
    backgroundColor: '#84cc16',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
  },
});

export default ServiceAddModal;