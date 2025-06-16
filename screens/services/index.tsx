import { ServicesRepository } from '@/api/servicesRepository';
import CreateServiceForm from '@/components/servicePage/CreateServiceForm';
import SearchPart from '@/components/servicePage/SearchPart';
import ServiceCard from '@/components/servicePage/ServiceCard';
import SquareAddButton from '@/components/servicePage/SquareAddButton';
import { UserService } from '@/types/profile';
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


// Mapper function to convert UserService (API) to ServiceItem (UI)
const mapUserServiceToServiceItem = (service: UserService): ServiceItem => {
  // Ensure time_availability is always a stringified JSON
  let timeAvailabilityString: string | undefined;
  if (service.time_availability) {
    if (typeof service.time_availability === 'string') {
      timeAvailabilityString = service.time_availability;
    } else {
      // If it's an object, stringify it
      timeAvailabilityString = JSON.stringify(service.time_availability);
    }
  }

  return {
    id: service.id,
    userId: service.user_id,
    userImage: service.user_image || '',
    userName: service.user_name,
    title: service.title,
    description: service.description,
    price: parseFloat(service.price) || 0,
    rating: service.rating || 0,
    ratingCount: service.rating_count || 0,
    duration: service.duration || 30,
    modality: service.modality || 'online',
    tags: service.tags || [],
    category: service.category,
    imageUrl: service.image_url,
    status: 'all',
    isBooked: service.is_booked === 'true' || false,
    isSaved: service.is_saved === 'true' || false,
    timeAvailability: timeAvailabilityString,
  };
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
      
      const response = await ServicesRepository.listServices();
      if (response && response.data) {
        console.log("antes de service items")
        const serviceItems = Array.isArray(response.data) 
          ? response.data.map(mapUserServiceToServiceItem)
          : [];
        
          console.log(serviceItems)
        
        setServices(serviceItems);
        setFilteredServices(serviceItems);
      } else {
        setError('Failed to load services');
      }
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
      
      const response = await ServicesRepository.listServices();
      console.log(response);
      
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    }
  };

  // Search services
  const searchServices = async (query: string, category: 'all' | 'booked' | 'saved') => {
    try {
      setLoading(true);
      setError(null);
      
      // No direct search API, so fetch all and filter client-side
      const response = await ServicesRepository.listServices();
      
      if (response && response.data) {
        let serviceItems = Array.isArray(response.data)
          ? response.data.map(mapUserServiceToServiceItem)
          : [];
        
        // Filter by category if necessary
        if (category !== 'all') {
          serviceItems = serviceItems.filter(service => {
            if (category === 'booked') return service.isBooked;
            if (category === 'saved') return service.isSaved;
            return true;
          });
        }
        
        // Filter by search query
        if (query.trim() !== '') {
          const q = query.toLowerCase();
          serviceItems = serviceItems.filter(service => 
            service.title.toLowerCase().includes(q) || 
            service.description.toLowerCase().includes(q) ||
            service.userName.toLowerCase().includes(q) ||
            (service.category && service.category.toLowerCase().includes(q))
          );
        }
        
        setFilteredServices(serviceItems);
      } else {
        setError('Search failed');
      }
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle booking status (register/unregister)
  const toggleBooking = async (serviceId: string, isCurrentlyBooked: boolean) => {
    try {
      setBookingInProgress(serviceId);
      
      let response;
      
      if (isCurrentlyBooked) {
        response = await ServicesRepository.unregisterFromService(serviceId);
      } else {
        response = await ServicesRepository.registerForService(serviceId);
      }
      
      if (response && response.status >= 200 && response.status < 300) {
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
      } else {
        // Show an error toast or notification here
        console.error('Failed to update booking status');
      }
    } catch (err) {
      console.error('Error toggling booking status:', err);
      // Show an error message to the user
    } finally {
      setBookingInProgress(null);
    }
  };

  // Toggle saved status
  // Note: The API doesn't currently have a "save" feature, so this is a placeholder
  // In a real implementation, you would use an API endpoint for this
  const toggleSaved = async (serviceId: string, isCurrentlySaved: boolean) => {
    try {
      setSavingInProgress(serviceId);
      
      // This is a placeholder until the API supports saving services
      // For now, we'll just update the UI state
      
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
        serviceId={item.id} // <-- Add this line
      />
    </View>
  );

  // Update your handleCreateNewService function:
  const handleCreateNewService = () => {
    console.log('Create new service');
    setIsAddModalVisible(true);
  };
  
  // Handle service creation with the real API
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
      
      // Prepare data for the API
      const apiServiceData = {
        title: serviceData.title,
        description: serviceData.description,
        price: serviceData.price,
        duration: serviceData.duration,
        modality: serviceData.modality,
        category: serviceData.category,
        tags: [] as string[], // Tags can be added later
      };
      
      // In a real app, you'd handle image upload separately
      // and attach the image URL to the service
      
      // Call the API to create the service
      const response = await ServicesRepository.create(apiServiceData);
      
      if (response && response.data) {
        // Convert the API response to a ServiceItem
        const newService = mapUserServiceToServiceItem(response.data);
        
        // Add to our local state
        setServices([newService, ...services]);
        setFilteredServices([newService, ...filteredServices]);
        
        // Show success message
        console.log('Service created successfully!');
        // No return value needed
      } else {
        console.error('Failed to create service: Invalid API response');
        throw new Error('Failed to create service');
      }
      
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
          {/* Add button inside the services container */}
          {!isAddModalVisible && (
            <SquareAddButton
              onPress={handleCreateNewService}
              color={ACCENT_COLOR}
              size={60}
              iconSize={32}
            />
          )}

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

      {/* Modal for creating new service */}
      {isAddModalVisible && (
        <CreateServiceForm
          visible={isAddModalVisible}
          onServiceCreated={() => setIsAddModalVisible(false)}
          onCancel={() => setIsAddModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default Services;