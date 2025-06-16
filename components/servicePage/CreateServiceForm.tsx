import { CreateServiceRequest, ServicesRepository } from '@/api/servicesRepository';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';



interface CreateServiceFormProps {
  visible: boolean;  // Add this
  onServiceCreated: () => void;
  onCancel: () => void;
  onSubmit?: (serviceData: any) => Promise<void>;
}
const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ onServiceCreated, onCancel, onSubmit, visible }) => {
  const [formData, setFormData] = useState<CreateServiceRequest>({
    title: '',
    description: '',
    price: 0,
    duration: 30,
    modality: 'online',
    tags: [],
    category: ''
    
  });



  // Estados para tags
  const [tagInput, setTagInput] = useState('');

  // Estados para fecha de disponibilidad
  const [timeAvailability, setTimeAvailability] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [includeDateAvailability, setIncludeDateAvailability] = useState(false);

  // Estados de loading y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para añadir tags
  const addTag = () => {
    console.log(' Adding tag:', tagInput.trim());
    
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
      
      console.log(' Tag added. Current tags:', [...formData.tags, tagInput.trim()]);
    } else {
      console.log(' Tag not added - empty or duplicate');
    }
  };

  // Función para remover tags
  const removeTag = (tagToRemove: string) => {
    console.log(' Removing tag:', tagToRemove);
    
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    
    console.log(' Tag removed. Remaining tags:', formData.tags.filter(tag => tag !== tagToRemove));
  };

  // Función para manejar el cambio de fecha
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || timeAvailability;
    setShowDatePicker(Platform.OS === 'ios');
    setTimeAvailability(currentDate);
    
    console.log(' Date selected:', currentDate?.toISOString());
  };

  // Función para validar el formulario
  const validateForm = (): boolean => {
    console.log(' Validating form...');
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    
    if (!formData.price || formData.price <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    
    if (formData.tags.length === 0) {
      setError('At least one tag is required');
      return false;
    }
    
    console.log(' Form validation passed');
    return true;
  };

  // Función para manejar el submit
  const handleSubmit = async () => {
    console.log(' Starting service creation...');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar datos para enviar
      const serviceDataToSend = {
        ...formData,
        // Añadir time_availability si está seleccionada
        ...(includeDateAvailability && timeAvailability && {
          time_availability: timeAvailability.toISOString()
        })
      };

      console.log(' Service data to submit:', {
        title: serviceDataToSend.title,
        description: serviceDataToSend.description.substring(0, 50) + '...',
        price: serviceDataToSend.price,
        duration: serviceDataToSend.duration,
        modality: serviceDataToSend.modality,
        tags: serviceDataToSend.tags,
        category: serviceDataToSend.category,
        hasTimeAvailability: !!serviceDataToSend.time_availability
      });

      const response = await ServicesRepository.create(serviceDataToSend);
      
      if (response && response.data) {
        console.log(' Service created successfully!', response.data);
        
        Alert.alert(
          'Success', 
          'Service created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                resetForm();
                onServiceCreated?.();
              }
            }
          ]
        );
      } else {
        throw new Error('Service creation response is null or invalid');
      }

    } catch (err: any) {
      console.error(' Error creating service:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create service';
      setError(errorMessage);
      
      Alert.alert(
        'Error', 
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    console.log(' Resetting form...');
    
    setFormData({
      title: '',
      description: '',
      price: 0,
      duration: 30,
      modality: 'online',
      tags: [],
      category: ''
    });
    setTagInput('');
    setTimeAvailability(null);
    setIncludeDateAvailability(false);
    setError(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Service</Text>
        {onCancel && (
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Title */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, title: text }));
            setError(null);
          }}
          placeholder="Enter service title"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Description */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, description: text }));
            setError(null);
          }}
          placeholder="Describe your service in detail"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Price */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Price * (€)</Text>
        <TextInput
          style={styles.input}
          value={formData.price.toString()}
          onChangeText={(text) => {
            const numericValue = parseFloat(text) || 0;
            setFormData(prev => ({ ...prev, price: numericValue }));
            setError(null);
          }}
          placeholder="0.00"
          placeholderTextColor="#9ca3af"
          keyboardType="decimal-pad"
        />
      </View>

      {/* Category */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          value={formData.category}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, category: text }));
            setError(null);
          }}
          placeholder="e.g., Programming, Design, Marketing"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Duration */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <View style={styles.durationContainer}>
          {[30, 45, 60, 90].map((duration) => (
            <TouchableOpacity
              key={duration}
              style={[
                styles.durationButton,
                formData.duration === duration && styles.durationButtonSelected
              ]}
              onPress={() => {
                setFormData(prev => ({ ...prev, duration: duration as any }));
                console.log(' Duration selected:', duration);
              }}
            >
              <Text style={[
                styles.durationButtonText,
                formData.duration === duration && styles.durationButtonTextSelected
              ]}>
                {duration}min
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modality */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Modality</Text>
        <View style={styles.modalityContainer}>
          {[
            { value: 'online', label: 'Online' },
            { value: 'in-person', label: 'In Person' },
            { value: 'both', label: 'Both' }
          ].map((option) => ( 
            <TouchableOpacity
              key={option.value}
              style={[
                styles.modalityButton,
                formData.modality === option.value && styles.modalityButtonSelected
              ]}
              onPress={() => {
                setFormData(prev => ({ ...prev, modality: option.value as any }));
                console.log(' Modality selected:', option.value);
              }}
            >
              <Text style={[
                styles.modalityButtonText,
                formData.modality === option.value && styles.modalityButtonTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tags */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tags * (at least one required)</Text>
        <View style={styles.tagInputContainer}>
          <TextInput
            style={[styles.input, styles.tagInput]}
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="Add a tag"
            placeholderTextColor="#9ca3af"
            onSubmitEditing={addTag}
            returnKeyType="done"
          />
          <TouchableOpacity 
            style={styles.addTagButton} 
            onPress={addTag}
            disabled={!tagInput.trim()}
          >
            <Text style={styles.addTagButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Display tags */}
        {formData.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => removeTag(tag)}
              >
                <Text style={styles.tagText}>{tag} ×</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Time Availability */}
      <View style={styles.fieldContainer}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => {
              setIncludeDateAvailability(!includeDateAvailability);
              console.log(' Include date availability:', !includeDateAvailability);
            }}
          >
            {includeDateAvailability && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Set availability date (optional)</Text>
        </View>

        {includeDateAvailability && (
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {timeAvailability 
                  ? timeAvailability.toLocaleDateString() + ' ' + timeAvailability.toLocaleTimeString()
                  : 'Select date and time'
                }
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={timeAvailability || new Date()}
                mode="datetime"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
        )}
      </View>

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.loadingText}>Creating service...</Text>
          </View>
        ) : (
          <Text style={styles.submitButtonText}>Create Service</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width * 0.3,
    height: height * 0.6,
    alignSelf: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
  fieldContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  durationButton: {
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  durationButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  durationButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  durationButtonTextSelected: {
    color: '#fff',
  },
  modalityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalityButton: {
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    minWidth: 80,
    alignItems: 'center',
  },
  modalityButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modalityButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  modalityButtonTextSelected: {
    color: '#fff',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  addTagButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  addTagButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#374151',
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkmark: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
  },
  dateContainer: {
    marginTop: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default CreateServiceForm;