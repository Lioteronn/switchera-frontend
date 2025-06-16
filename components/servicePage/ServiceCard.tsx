import { profileApi } from '@/api/profile'; // Import profileApi
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Clock, MapPin, MessageCircle, Star, Video, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';


export type ServiceCardProps = {
  userId: string;
  userImage: string;
  userName: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  ratingCount: number;
  duration: 30 | 45 | 60 | 90;
  modality: 'online' | 'in-person' | 'both';
  category?: string;
  imageUrl?: string;
  onPress?: () => void;
  fullDescription?: string;
  userServices?: {
    id: string;
    title: string;
    imageUrl?: string;
    duration: number;
    modality: 'online' | 'in-person' | 'both';
  }[];
  timeAvailability?: { [date: string]: string[] }; // Key is date in YYYY-MM-DD format, value is array of times in HH:MM format
  serviceId: string; // Add this prop for API calls
};

const ServiceCard = ({
  userImage,
  userName,
  title,
  description,
  price,
  rating,
  ratingCount,
  duration,
  modality,
  category,
  imageUrl,
  onPress,
  fullDescription = description,
  userServices = [],
  serviceId,
}: ServiceCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'book' | 'exchange'>('details');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedExchangeServiceId, setSelectedExchangeServiceId] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} size={16} color="#f59e0b" fill="#f59e0b" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half-star" size={16} color="#f59e0b" />);
    }
    for (let i = 0; i < 5 - fullStars - (hasHalfStar ? 1 : 0); i++) {
      stars.push(<Star key={`empty-star-${i}`} size={16} color="#f59e0b" />);
    }
    return stars;
  };

  const getModalityIcon = () => {
    switch (modality) {
      case 'online':
        return <Video size={16} color="#6b7280" />;
      case 'in-person':
        return <MapPin size={16} color="#6b7280" />;
      case 'both':
        return (
          <HStack space="xs">
            <Video size={16} color="#6b7280" />
            <Text className="text-gray-400">/</Text>
            <MapPin size={16} color="#6b7280" />
          </HStack>
        );
    }
  };

  const getModalityText = () => {
    switch (modality) {
      case 'online':
        return 'Online';
      case 'in-person':
        return 'In Person';
      case 'both':
        return 'Online / In Person';
    }
  };

  // Booking handler
  const handleBook = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      // Replace with your actual booking API call
      // Example: await profileApi.bookService({ serviceId, ...otherData });
      await profileApi.bookService?.({ serviceId }); // Add this method to profileApi if not present
      setFeedback('Booking confirmed!');
    } catch (err) {
      setFeedback('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  // Exchange handler
  const handleProposeExchange = async () => {
    if (!selectedExchangeServiceId) {
      setFeedback('Please select a service to exchange.');
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      // Replace with your actual exchange API call
      // Example: await profileApi.proposeExchange({ serviceId, offeredServiceId: selectedExchangeServiceId });
      await profileApi.proposeExchange?.({ serviceId, offeredServiceId: selectedExchangeServiceId }); // Add this method to profileApi if not present
      setFeedback('Exchange proposal sent!');
    } catch (err) {
      setFeedback('Exchange failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Pressable onPress={onPress}>
        <Card style={{ borderRadius: 12, marginBottom: 16, overflow: 'hidden', backgroundColor: 'white' }}>
          {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: 160 }}
          resizeMode="cover"
          alt={title}
        />
          )}
          <View style={{ padding: 16 }}>
        <HStack space="md" className="mb-3 items-center">
          <Image
            source={{ uri: userImage }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            resizeMode="cover"
            alt={userName}
          />
          <VStack>
            <Text className="font-bold">{userName}</Text>
            <HStack className="items-center">
          {renderStars(rating)}
          <Text className="ml-1 text-gray-600 text-sm">({ratingCount})</Text>
            </HStack>
          </VStack>
        </HStack>
        <Heading size="md" className="mb-1">{title}</Heading>
        {category && <Text className="text-blue-500 text-xs mb-2">{category}</Text>}
        <Text className="text-gray-600 mb-3" numberOfLines={2}>{description}</Text>
        <HStack space="md" className="mb-4 flex-wrap">
          <HStack space="xs" className="items-center bg-gray-100 px-2 py-1 rounded-full">
            <Clock size={16} color="#6b7280" />
            <Text className="text-gray-600 text-xs">{duration} min</Text>
          </HStack>
          <HStack space="xs" className="items-center bg-gray-100 px-2 py-1 rounded-full">
            {getModalityIcon()}
            <Text className="text-gray-600 text-xs">{getModalityText()}</Text>
          </HStack>
        </HStack>
        <HStack className="justify-between items-center">
          <Text className="text-lg font-bold text-blue-700">
            {price > 0 ? `$${price.toFixed(2)}` : 'Exchange Only'}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}
            onPress={() => { setModalVisible(true); setActiveTab('details'); }}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>View Details</Text>
          </TouchableOpacity>
        </HStack>
          </View>
        </Card>
      </Pressable>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            width: '94%', maxWidth: 500, maxHeight: '90%',
            backgroundColor: 'white', borderRadius: 12, overflow: 'hidden'
          }}>
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
            }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>{title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: activeTab === 'details' ? 2 : 0, borderBottomColor: '#3B82F6' }}
                onPress={() => setActiveTab('details')}
              >
                <Text style={{ fontSize: 14, fontWeight: activeTab === 'details' ? '600' : '500', color: activeTab === 'details' ? '#3B82F6' : '#6B7280' }}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: activeTab === 'book' ? 2 : 0, borderBottomColor: '#3B82F6' }}
                onPress={() => setActiveTab('book')}
              >
                <Text style={{ fontSize: 14, fontWeight: activeTab === 'book' ? '600' : '500', color: activeTab === 'book' ? '#3B82F6' : '#6B7280' }}>Book</Text>
              </TouchableOpacity>
              {price === 0 && (
                <TouchableOpacity
                  style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: activeTab === 'exchange' ? 2 : 0, borderBottomColor: '#3B82F6' }}
                  onPress={() => setActiveTab('exchange')}
                >
                  <Text style={{ fontSize: 14, fontWeight: activeTab === 'exchange' ? '600' : '500', color: activeTab === 'exchange' ? '#3B82F6' : '#6B7280' }}>Exchange</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView style={{ padding: 16 }}>
              {activeTab === 'details' && (
                <View>
                  {imageUrl && (
                    <Image
                      source={{ uri: imageUrl }}
                      style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
                      resizeMode="cover"
                      alt={title}
                    />
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Image
                      source={{ uri: userImage }}
                      style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
                      resizeMode="cover"
                      alt={userName}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>{userName}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {renderStars(rating)}
                        <Text style={{ marginLeft: 4, fontSize: 14, color: '#6B7280' }}>({ratingCount})</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>About this service</Text>
                    <Text style={{ fontSize: 15, lineHeight: 1.2, color: '#4B5563' }}>{fullDescription}</Text>
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>Service Details</Text>
                    <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Clock size={20} color="#4B5563" />
                        <View style={{ marginLeft: 12 }}>
                          <Text style={{ fontSize: 14, color: '#6B7280' }}>Duration</Text>
                          <Text style={{ fontSize: 15, fontWeight: '500', color: '#111827' }}>{duration} minutes</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        {modality === 'online' ? (
                          <Video size={20} color="#4B5563" />
                        ) : modality === 'in-person' ? (
                          <MapPin size={20} color="#4B5563" />
                        ) : (
                          <Video size={20} color="#4B5563" />
                        )}
                        <View style={{ marginLeft: 12 }}>
                          <Text style={{ fontSize: 14, color: '#6B7280' }}>Modality</Text>
                          <Text style={{ fontSize: 15, fontWeight: '500', color: '#111827' }}>{getModalityText()}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0 }}>
                        <MessageCircle size={20} color="#4B5563" />
                        <View style={{ marginLeft: 12 }}>
                          <Text style={{ fontSize: 14, color: '#6B7280' }}>Communication</Text>
                          <Text style={{ fontSize: 15, fontWeight: '500', color: '#111827' }}>In-app messaging</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{
                    backgroundColor: '#EFF6FF', borderRadius: 8, padding: 16,
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#1E40AF' }}>Price</Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E40AF' }}>
                      {price > 0 ? `$${price.toFixed(2)}` : 'Exchange Only'}
                    </Text>
                  </View>
                </View>
              )}
              {activeTab === 'book' && (
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>Book this service</Text>
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#374151', marginBottom: 8 }}>Select a date and time</Text>
                    <View style={{
                      height: 100, backgroundColor: '#F3F4F6', borderRadius: 8,
                      justifyContent: 'center', alignItems: 'center', marginBottom: 16
                    }}>

                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#374151', marginBottom: 8 }}>Available time slots</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
                      {['9:00 AM', '10:00 AM', '2:00 PM', '4:30 PM'].map((time, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{
                            backgroundColor: index === 0 ? '#DBEAFE' : '#F3F4F6',
                            paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16,
                            marginRight: 8, marginBottom: 8,
                            borderWidth: index === 0 ? 1 : 0,
                            borderColor: index === 0 ? '#3B82F6' : undefined
                          }}
                        >
                          <Text style={{
                            color: index === 0 ? '#1E40AF' : '#4B5563',
                            fontWeight: index === 0 ? '600' : '500'
                          }}>{time}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={{
                      backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16, marginTop: 16
                    }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ color: '#6B7280' }}>Service</Text>
                        <Text style={{ color: '#111827', fontWeight: '500' }}>{title}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ color: '#6B7280' }}>Date</Text>
                        <Text style={{ color: '#111827', fontWeight: '500' }}>June 15, 2025</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ color: '#6B7280' }}>Time</Text>
                        <Text style={{ color: '#111827', fontWeight: '500' }}>9:00 AM</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ color: '#6B7280' }}>Duration</Text>
                        <Text style={{ color: '#111827', fontWeight: '500' }}>{duration} minutes</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0 }}>
                        <Text style={{ color: '#6B7280' }}>Total</Text>
                        <Text style={{ color: '#1E40AF', fontWeight: '700', fontSize: 16 }}>${price.toFixed(2)}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: loading ? '#93C5FD' : '#3B82F6',
                        borderRadius: 8,
                        padding: 14,
                        alignItems: 'center',
                        marginTop: 20,
                        opacity: loading ? 0.7 : 1,
                      }}
                      onPress={handleBook}
                      disabled={loading}
                    >
                      <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                        {loading ? 'Booking...' : 'Confirm Booking'}
                      </Text>
                    </TouchableOpacity>
                    {feedback && (
                      <Text style={{ color: feedback.includes('failed') ? 'red' : 'green', marginTop: 10, textAlign: 'center' }}>
                        {feedback}
                      </Text>
                    )}
                  </View>
                </View>
              )}
              {activeTab === 'exchange' && price === 0 && (
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>Propose an Exchange</Text>
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 15, color: '#4B5563', lineHeight: 22 }}>
                      This service is available for exchange. Select one of your services to propose a swap.
                    </Text>
                  </View>
                  {userServices.length > 0 ? (
                    <View style={{ marginTop: 8 }}>
                      {userServices.map((service, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{
                            flexDirection: 'row', borderWidth: 1, borderColor: '#E5E7EB',
                            borderRadius: 8, marginBottom: 12, padding: 10, alignItems: 'center',
                            borderColor: selectedExchangeServiceId === service.id ? '#3B82F6' : '#E5E7EB',
                            borderWidth: selectedExchangeServiceId === service.id ? 2 : 1,
                          }}
                          onPress={() => setSelectedExchangeServiceId(service.id)}
                        >
                          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            {service.imageUrl ? (
                              <Image
                                source={{ uri: service.imageUrl }}
                                style={{ width: 60, height: 60, borderRadius: 6, marginRight: 12 }}
                                resizeMode="cover"
                              />
                            ) : (
                              <View style={{
                                width: 60, height: 60, borderRadius: 6, backgroundColor: '#F3F4F6', marginRight: 12
                              }} />
                            )}
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 15, fontWeight: '500', color: '#111827', marginBottom: 4 }}>{service.title}</Text>
                              <HStack space="xs" className="items-center">
                                <Clock size={14} color="#6b7280" />
                                <Text style={{ fontSize: 13, color: '#6b7280', marginRight: 8 }}>{service.duration} min</Text>
                                {service.modality === 'online' ? (
                                  <Video size={14} color="#6b7280" />
                                ) : service.modality === 'in-person' ? (
                                  <MapPin size={14} color="#6b7280" />
                                ) : (
                                  <View style={{ flexDirection: 'row' }}>
                                    <Video size={14} color="#6b7280" />
                                    <Text style={{ color: '#6b7280' }}>/</Text>
                                    <MapPin size={14} color="#6b7280" />
                                  </View>
                                )}
                              </HStack>
                            </View>
                          </View>
                          <View style={{ marginLeft: 12 }}>
                            <View style={{
                              width: 20, height: 20, borderRadius: 10,
                              borderWidth: 2, borderColor: '#3B82F6'
                            }} />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={{
                      backgroundColor: '#F3F4F6', borderRadius: 8, padding: 20, alignItems: 'center', marginTop: 8
                    }}>
                      <Text style={{ fontSize: 15, color: '#6B7280', marginBottom: 12, textAlign: 'center' }}>
                        You don t have any services to exchange yet.
                      </Text>
                      <TouchableOpacity style={{
                        backgroundColor: '#3B82F6', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16
                      }}>
                        <Text style={{ color: 'white', fontWeight: '500' }}>Create a Service</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {userServices.length > 0 && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: loading ? '#93C5FD' : '#3B82F6',
                        borderRadius: 8,
                        padding: 14,
                        alignItems: 'center',
                        marginTop: 20,
                        opacity: loading ? 0.7 : 1,
                      }}
                      onPress={handleProposeExchange}
                      disabled={loading}
                    >
                      <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                        {loading ? 'Proposing...' : 'Propose Exchange'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {feedback && (
                    <Text style={{ color: feedback.includes('failed') ? 'red' : 'green', marginTop: 10, textAlign: 'center' }}>
                      {feedback}
                    </Text>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ServiceCard;
