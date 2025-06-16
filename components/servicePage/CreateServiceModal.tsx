// components/ServiceCategorySelector.tsx
import {
    Baby,
    BookOpen,
    Briefcase,
    Building,
    Calculator,
    Camera,
    Car,
    Code,
    Dumbbell,
    Gamepad2,
    Globe,
    GraduationCap,
    Heart,
    Home,
    Languages,
    Monitor,
    Music,
    Palette,
    PenTool,
    Plane,
    Scissors,
    Search,
    Shirt,
    Stethoscope,
    Utensils,
    Wrench,
    X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// ⚡ Categorías específicas para servicios
export const SERVICE_CATEGORIES = [
  // Tecnología
  { id: 'programming', name: 'Programming & Development', icon: Code, color: '#3B82F6' },
  { id: 'web-design', name: 'Web Design', icon: Monitor, color: '#8B5CF6' },
  { id: 'mobile-dev', name: 'Mobile Development', icon: Monitor, color: '#06B6D4' },
  { id: 'data-science', name: 'Data Science', icon: Calculator, color: '#10B981' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: Wrench, color: '#EF4444' },
  
  // Diseño y Creatividad
  { id: 'graphic-design', name: 'Graphic Design', icon: Palette, color: '#F59E0B' },
  { id: 'photography', name: 'Photography', icon: Camera, color: '#EC4899' },
  { id: 'video-editing', name: 'Video Editing', icon: Camera, color: '#8B5CF6' },
  { id: 'illustration', name: 'Illustration', icon: PenTool, color: '#06B6D4' },
  { id: 'ui-ux', name: 'UI/UX Design', icon: Palette, color: '#F59E0B' },
  
  // Educación y Tutorías
  { id: 'tutoring', name: 'Academic Tutoring', icon: GraduationCap, color: '#3B82F6' },
  { id: 'language-teaching', name: 'Language Teaching', icon: Languages, color: '#10B981' },
  { id: 'music-lessons', name: 'Music Lessons', icon: Music, color: '#8B5CF6' },
  { id: 'coding-bootcamp', name: 'Coding Bootcamp', icon: Code, color: '#EF4444' },
  { id: 'exam-prep', name: 'Exam Preparation', icon: BookOpen, color: '#F59E0B' },
  
  // Negocios y Consultoría
  { id: 'business-consulting', name: 'Business Consulting', icon: Briefcase, color: '#1F2937' },
  { id: 'marketing', name: 'Digital Marketing', icon: Globe, color: '#EC4899' },
  { id: 'accounting', name: 'Accounting & Finance', icon: Calculator, color: '#059669' },
  { id: 'legal-services', name: 'Legal Services', icon: Building, color: '#DC2626' },
  { id: 'project-management', name: 'Project Management', icon: Briefcase, color: '#7C3AED' },
  
  // Salud y Bienestar
  { id: 'fitness-coaching', name: 'Fitness Coaching', icon: Dumbbell, color: '#EF4444' },
  { id: 'nutrition', name: 'Nutrition Consulting', icon: Heart, color: '#10B981' },
  { id: 'mental-health', name: 'Mental Health', icon: Heart, color: '#8B5CF6' },
  { id: 'yoga', name: 'Yoga & Meditation', icon: Heart, color: '#06B6D4' },
  { id: 'medical-consulting', name: 'Medical Consulting', icon: Stethoscope, color: '#DC2626' },
  
  // Servicios Domésticos
  { id: 'cleaning', name: 'Cleaning Services', icon: Home, color: '#059669' },
  { id: 'gardening', name: 'Gardening', icon: Home, color: '#10B981' },
  { id: 'home-repair', name: 'Home Repair', icon: Wrench, color: '#F59E0B' },
  { id: 'interior-design', name: 'Interior Design', icon: Home, color: '#EC4899' },
  { id: 'pet-care', name: 'Pet Care', icon: Heart, color: '#8B5CF6' },
  
  // Transporte y Viajes
  { id: 'driving-lessons', name: 'Driving Lessons', icon: Car, color: '#3B82F6' },
  { id: 'travel-planning', name: 'Travel Planning', icon: Plane, color: '#06B6D4' },
  { id: 'delivery', name: 'Delivery Services', icon: Car, color: '#F59E0B' },
  
  // Estilo y Belleza
  { id: 'hairstyling', name: 'Hairstyling', icon: Scissors, color: '#EC4899' },
  { id: 'makeup', name: 'Makeup Services', icon: Palette, color: '#F59E0B' },
  { id: 'fashion-consulting', name: 'Fashion Consulting', icon: Shirt, color: '#8B5CF6' },
  
  // Alimentación
  { id: 'cooking-lessons', name: 'Cooking Lessons', icon: Utensils, color: '#EF4444' },
  { id: 'catering', name: 'Catering Services', icon: Utensils, color: '#F59E0B' },
  { id: 'meal-prep', name: 'Meal Preparation', icon: Utensils, color: '#10B981' },
  
  // Entretenimiento
  { id: 'gaming-coaching', name: 'Gaming Coaching', icon: Gamepad2, color: '#8B5CF6' },
  { id: 'event-planning', name: 'Event Planning', icon: Building, color: '#EC4899' },
  { id: 'childcare', name: 'Childcare', icon: Baby, color: '#F59E0B' },
  
  // Otros
  { id: 'translation', name: 'Translation Services', icon: Languages, color: '#3B82F6' },
  { id: 'writing', name: 'Content Writing', icon: PenTool, color: '#1F2937' },
  { id: 'virtual-assistant', name: 'Virtual Assistant', icon: Monitor, color: '#059669' },
  { id: 'other', name: 'Other Services', icon: Briefcase, color: '#6B7280' },
];

interface ServiceCategorySelectorProps {
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
  mode?: 'inline' | 'modal';
  placeholder?: string;
  style?: any;
  showSearch?: boolean;
}

const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect,
  mode = 'inline',
  placeholder = 'Select a service category',
  style,
  showSearch = true,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ⚡ Filter categories based on search
  const filteredCategories = SERVICE_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ⚡ Get selected category details
  const selectedCategoryData = SERVICE_CATEGORIES.find(
    cat => cat.id === selectedCategory
  );

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
    if (mode === 'modal') {
      setIsModalVisible(false);
    }
    setSearchQuery('');
  };

  const renderCategoryItem = (category: typeof SERVICE_CATEGORIES[0], index: number) => {
    const IconComponent = category.icon;
    const isSelected = selectedCategory === category.id;

    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryItem,
          isSelected && styles.selectedCategoryItem,
          { borderColor: category.color }
        ]}
        onPress={() => handleCategorySelect(category.id)}
      >
        <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
          <IconComponent size={20} color={category.color} />
        </View>
        <Text style={[
          styles.categoryText,
          isSelected && styles.selectedCategoryText
        ]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderInlineSelector = () => (
    <View style={[styles.container, style]}>
      {showSearch && (
        <View style={styles.searchContainer}>
          <Search size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      )}
      
      <ScrollView 
        style={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesGrid}>
          {filteredCategories.map(renderCategoryItem)}
        </View>
      </ScrollView>
    </View>
  );

  const renderModalSelector = () => (
    <>
      <TouchableOpacity
        style={[styles.selectorButton, style]}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          {selectedCategoryData ? (
            <>
              <View style={[
                styles.selectedIconContainer, 
                { backgroundColor: selectedCategoryData.color + '20' }
              ]}>
                <selectedCategoryData.icon size={16} color={selectedCategoryData.color} />
              </View>
              <Text style={styles.selectedText}>{selectedCategoryData.name}</Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>{placeholder}</Text>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Service Category</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {showSearch && (
            <View style={styles.modalSearchContainer}>
              <Search size={16} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search categories..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <ScrollView style={styles.modalCategoriesContainer}>
            <View style={styles.categoriesGrid}>
              {filteredCategories.map(renderCategoryItem)}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );

  return mode === 'modal' ? renderModalSelector() : renderInlineSelector();
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },
  categoriesContainer: {
    maxHeight: 300,
  },
  categoriesGrid: {
    padding: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  selectedCategoryItem: {
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  selectorButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  selectedIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  placeholderText: {
    flex: 1,
    fontSize: 14,
    color: '#9CA3AF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalCategoriesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default ServiceCategorySelector;