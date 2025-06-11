import SearchPart from '@/components/servicePage/SearchPart';
import ServiceAddModal from '@/components/servicePage/ServiceAddModal';
import ServiceCard from '@/components/servicePage/ServiceCard';
import SquareAddButton from '@/components/servicePage/SquareAddButton';
import { services } from '@/types/mockdata';
import { ServiceItem } from '@/types/props';
import { BookmarkIcon, CalendarIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

// Simple constants for consistent spacing and styling
const MAX_CONTENT_WIDTH = 1200;
const MOBILE_CARD_WIDTH = 320;
const ACCENT_COLOR = '#84cc16';
const SCREEN_HEIGHT = Dimensions.get('window').height;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  serviceCard: {
    width: '100%',
    maxWidth: MOBILE_CARD_WIDTH,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});


// API service module - in a real app, move this to a separate file
const apiService = {
  // Fetch all services
  getServices: async (): Promise<ServiceItem[]> => {
    try {
      // Replace with your actual API call
      // const response = await fetch('https://your-api.com/services');
      // const data = await response.json();
      // return data;

      // For now, return mock data
      return services;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Fetch services by category (all, booked, saved)
  getServicesByCategory: async (category: 'all' | 'booked' | 'saved'): Promise<ServiceItem[]> => {
    try {
      // Replace with your actual API call
      // const response = await fetch(`https://your-api.com/services?category=${category}`);
      // const data = await response.json();
      // return data;
      
      // For now, filter mock data
      if (category === 'all') {
        return services;
      }
      return services.filter(service => service.status === category);
    } catch (error) {
      console.error(`Error fetching ${category} services:`, error);
      throw error;
    }
  },

  // Search services
  searchServices: async (query: string, category: 'all' | 'booked' | 'saved'): Promise<ServiceItem[]> => {
    try {
      // Replace with your actual API call
      // const response = await fetch(`https://your-api.com/services/search?q=${query}&category=${category}`);
      // const data = await response.json();
      // return data;

      // For now, filter mock data
      let filtered = services;
      
      if (category !== 'all') {
        filtered = filtered.filter(service => service.status === category);
      }
      
      if (query.trim() !== '') {
        const q = query.toLowerCase();
        filtered = filtered.filter(service => 
          service.title.toLowerCase().includes(q) || 
          service.description.toLowerCase().includes(q) ||
          service.userName.toLowerCase().includes(q) ||
          (service.category && service.category.toLowerCase().includes(q))
        );
      }
      
      return filtered;
    } catch (error) {
      console.error('Error searching services:', error);
      throw error;
    }
  },

  // Book a service
  bookService: async (serviceId: string): Promise<boolean> => {
    try {
      // Mock success
      console.log(`Service booked: ${serviceId}`);
      return true;
    } catch (error) {
      console.error(`Error booking service ${serviceId}:`, error);
      throw error;
    }
  },

  // Save a service
  saveService: async (serviceId: string): Promise<boolean> => {
    try {
      // Mock success
      console.log(`Service saved: ${serviceId}`);
      return true;
    } catch (error) {
      console.error(`Error saving service ${serviceId}:`, error);
      throw error;
    }
  },

  // Unbook a service
  unbookService: async (serviceId: string): Promise<boolean> => {
    try {
      // Mock success
      console.log(`Service unbooked: ${serviceId}`);
      return true;
    } catch (error) {
      console.error(`Error unbooking service ${serviceId}:`, error);
      throw error;
    }
  },

  // Unsave a service
  unsaveService: async (serviceId: string): Promise<boolean> => {
    try {
      // Mock success
      console.log(`Service unsaved: ${serviceId}`);
      return true;
    } catch (error) {
      console.error(`Error unsaving service ${serviceId}:`, error);
      throw error;
    }
  }
};

const Services = () => {
  // Get device dimensions for responsive layout
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  // States for API interaction
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'booked' | 'saved'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);
  const [savingInProgress, setSavingInProgress] = useState<string | null>(null);

  // Constants for Modal visibility
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // Load initial data
  useEffect(() => {
    fetchServices();
  }, []);
  
  // Fetch services based on selected category
  useEffect(() => {
    fetchServicesByCategory(selectedCategory);
  }, [selectedCategory]);

  // Search and filter when query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServices(services);
    } else {
      searchServices(searchQuery, selectedCategory);
    }
  }, [searchQuery, services]);

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getServices();
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch services by category
  const fetchServicesByCategory = async (category: 'all' | 'booked' | 'saved') => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getServicesByCategory(category);
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      setError(`Failed to load ${category} services`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search services
  const searchServices = async (query: string, category: 'all' | 'booked' | 'saved') => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.searchServices(query, category);
      setFilteredServices(data);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle booking status
  const toggleBooking = async (serviceId: string, isCurrentlyBooked: boolean) => {
    try {
      setBookingInProgress(serviceId);
      
      let success: boolean;
      
      if (isCurrentlyBooked) {
        success = await apiService.unbookService(serviceId);
      } else {
        success = await apiService.bookService(serviceId);
      }
      
      if (success) {
        // Update local state to reflect the change
        const updatedServices = services.map(service => 
          service.id === serviceId 
            ? { ...service, isBooked: !isCurrentlyBooked } 
            : service
        );
        
        setServices(updatedServices);
        
        // Update filtered services too
        const updatedFilteredServices = filteredServices.map(service => 
          service.id === serviceId 
            ? { ...service, isBooked: !isCurrentlyBooked } 
            : service
        );
        
        setFilteredServices(updatedFilteredServices);
      }
    } catch (err) {
      console.error('Error toggling booking status:', err);
      // Show an error message to the user
    } finally {
      setBookingInProgress(null);
    }
  };

  // Toggle saved status
  const toggleSaved = async (serviceId: string, isCurrentlySaved: boolean) => {
    try {
      setSavingInProgress(serviceId);
      
      let success: boolean;
      
      if (isCurrentlySaved) {
        success = await apiService.unsaveService(serviceId);
      } else {
        success = await apiService.saveService(serviceId);
      }
      
      if (success) {
        // Update local state to reflect the change
        const updatedServices = services.map(service => 
          service.id === serviceId 
            ? { ...service, isSaved: !isCurrentlySaved } 
            : service
        );
        
        setServices(updatedServices);
        
        // Update filtered services too
        const updatedFilteredServices = filteredServices.map(service => 
          service.id === serviceId 
            ? { ...service, isSaved: !isCurrentlySaved } 
            : service
        );
        
        setFilteredServices(updatedFilteredServices);
      }
    } catch (err) {
      console.error('Error toggling saved status:', err);
      // Show an error message to the user
    } finally {
      setSavingInProgress(null);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchServicesByCategory(selectedCategory);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle search input
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Handle category change
  const handleCategoryChange = (category: 'all' | 'booked' | 'saved') => {
    setSelectedCategory(category);
  };

  // Render a service card
  const renderServiceCard = ({ item }: { item: ServiceItem }) => (
    <View className="w-full md:w-[48%] p-2 relative">
      {/* Action Buttons */}
      <View className="absolute top-4 right-4 flex-row z-10">
        {/* Book/Unbook Button */}
        <Pressable 
          className={`w-9 h-9 rounded-full bg-white justify-center items-center ml-2 shadow-sm ${item.isBooked ? 'bg-green-100' : ''}`}
          onPress={() => toggleBooking(item.id, item.isBooked || false)}
          disabled={bookingInProgress === item.id}
        >
          {bookingInProgress === item.id ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <CalendarIcon 
              size={20} 
              color={item.isBooked ? '#2d6a4f' : '#6B7280'} 
              fill={item.isBooked ? '#2d6a4f' : 'transparent'}
            />
          )}
        </Pressable>
        
        {/* Save/Unsave Button */}
        <Pressable 
          className={`w-9 h-9 rounded-full bg-white justify-center items-center ml-2 shadow-sm ${item.isSaved ? 'bg-amber-100' : ''}`}
          onPress={() => toggleSaved(item.id, item.isSaved || false)}
          disabled={savingInProgress === item.id}
        >
          {savingInProgress === item.id ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <BookmarkIcon 
              size={20} 
              color={item.isSaved ? '#f59e0b' : '#6B7280'} 
              fill={item.isSaved ? '#f59e0b' : 'transparent'}
            />
          )}
        </Pressable>
      </View>
      
      {/* Service Card */}
      <ServiceCard
        userId={item.userId}
        userImage={item.userImage}
        userName={item.userName}
        title={item.title}
        description={item.description}
        price={item.price}
        rating={item.rating}
        ratingCount={item.ratingCount}
        duration={item.duration}
        modality={item.modality}
        category={item.category}
        imageUrl={item.imageUrl}
        timeAvailability={item.timeAvailability}
        onPress={() => console.log('Card pressed:', item.id)}
      />
    </View>
  );

  // Update your handleCreateNewService function:
  const handleCreateNewService = () => {
    console.log('Create new service');
    setIsAddModalVisible(true);
  };
  
  // Add this new function to handle service creation:
  const handleServiceSubmit = async (serviceData: {
    title: string;
    description: string;
    price: number;
    duration: 30 | 45 | 60 | 90;
    modality: 'online' | 'in-person' | 'both';
    category: string;
    imageUri?: string;
  }) => {
    try {
      console.log('Creating new service:', serviceData);
      
      // In a real app, you'd upload the image first if it exists
      // Then create the service with the returned image URL
      
      // For now, let's create a mock service entry
      const newService: ServiceItem = {
        id: `service${Date.now()}`, // Generate a temporary ID
        userId: 'current-user-id', // In a real app, get from auth context
        userImage: 'https://randomuser.me/api/portraits/men/1.jpg', // User's profile image
        userName: 'Current User', // In a real app, get from auth context
        title: serviceData.title,
        description: serviceData.description,
        price: serviceData.price,
        rating: 0, // New services start with no ratings
        ratingCount: 0,
        duration: serviceData.duration,
        modality: serviceData.modality,
        category: serviceData.category,
        tags: [], // Tags can be added later
        imageUrl: serviceData.imageUri, // In a real app, this would be the uploaded image URL
        status: 'all',
        isBooked: false,
        isSaved: false
      };
      
      // In a real app, you'd call your API here
      // const response = await apiService.createService(newService);
      
      // For now, add to our mock data and state
      setServices([newService, ...services]);
      setFilteredServices([newService, ...filteredServices]);
      
      // Show success message
      console.log('Service created successfully!');
      
    } catch (error) {
      console.error('Failed to create service:', error);
      throw error; // This will be caught by the modal component
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50" style={styles.container}>
      <View className="w-full max-w-[1200px] mx-auto px-4 py-2 bg-white" style={styles.contentContainer}>
        <SearchPart
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
        />
      </View>

      {loading && !refreshing ? (
        <View className="h-[300px] justify-center items-center w-full max-w-[1200px] mx-auto" style={styles.contentContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : error ? (
        <View className="h-[300px] justify-center items-center w-full max-w-[1200px] mx-auto px-5" style={styles.contentContainer}>
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <Pressable 
            className="bg-blue-500 py-2 px-4 rounded-md"
            onPress={() => fetchServicesByCategory(selectedCategory)}
          >
            <Text className="text-white font-medium">Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            maxWidth: MAX_CONTENT_WIDTH,
            alignSelf: 'center',
            flex: 1,
            paddingHorizontal: 8,
          }}
        >
          <FlatList
            data={filteredServices}
            renderItem={renderServiceCard}
            keyExtractor={item => item.id}
            numColumns={2}
            key={'2-cols'}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              gap: 16,
            }}
            contentContainerStyle={{
              paddingVertical: 8,
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <View className="h-[300px] justify-center items-center w-full">
                <Text className="text-gray-500 text-center">No services found</Text>
                <Pressable 
                  className="mt-4 bg-blue-500 py-2 px-4 rounded-md"
                  onPress={() => {
                    setSearchQuery('');
                    fetchServicesByCategory('all');
                  }}
                >
                  <Text className="text-white font-medium">Reset Filters</Text>
                </Pressable>
              </View>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      )}

      {/* Add a + square for adding new ServicesCard*/}
      <SquareAddButton
        onPress={handleCreateNewService}
        color={ACCENT_COLOR}
        size={60}
        iconSize={32}
      />

      {/* Service Add Modal */}
      <ServiceAddModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={handleServiceSubmit}
      />  
    </SafeAreaView>
  );
};

export default Services;