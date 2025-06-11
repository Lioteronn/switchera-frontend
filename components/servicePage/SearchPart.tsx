import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Search as SearchIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

type SearchPartProps = {
  onSearch?: (text: string) => void;
  onCategoryChange?: (category: 'all' | 'booked' | 'saved') => void;
};

const SearchPart = ({ onSearch, onCategoryChange }: SearchPartProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'booked' | 'saved'>('all');

  return (
    <View className="mb-3">
      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-3">
        <SearchIcon size={18} color="#6B7280" />
        <TextInput
          className="flex-1 ml-2 text-base text-gray-800"
          placeholder="Search services..."
          placeholderTextColor="#9CA3AF"
          onChangeText={onSearch}
        />
      </View>
      
      {/* Tabs */}
      <HStack className="border-b border-gray-200">
        <Pressable 
          className="flex-1 items-center py-2.5 relative"
          onPress={() => {
            setActiveTab('all');
            if (onCategoryChange) onCategoryChange('all');
          }}
        >
          <Text className={`font-medium ${activeTab === 'all' ? 'text-blue-500' : 'text-gray-400'}`}>
            ALL
          </Text>
          {activeTab === 'all' && (
            <View 
              className="absolute bottom-0 w-1/5 h-0.5 bg-blue-500 rounded-full" 
              style={{ bottom: -1 }}
            />
          )}
        </Pressable>
        
        <Pressable 
          className="flex-1 items-center py-2.5 relative"
          onPress={() => {
            setActiveTab('booked');
            if (onCategoryChange) onCategoryChange('booked');
          }}
        >
          <Text className={`font-medium ${activeTab === 'booked' ? 'text-blue-500' : 'text-gray-400'}`}>
            BOOKED
          </Text>
          {activeTab === 'booked' && (
            <View 
              className="absolute bottom-0 w-1/5 h-0.5 bg-blue-500 rounded-full" 
              style={{ bottom: -1 }}
            />
          )}
        </Pressable>
        
        <Pressable 
          className="flex-1 items-center py-2.5 relative" 
          onPress={() => {
            setActiveTab('saved');
            if (onCategoryChange) onCategoryChange('saved');
          }}
        >
          <Text className={`font-medium ${activeTab === 'saved' ? 'text-blue-500' : 'text-gray-400'}`}>
            SAVED
          </Text>
          {activeTab === 'saved' && (
            <View 
              className="absolute bottom-0 w-1/5 h-0.5 bg-blue-500 rounded-full" 
              style={{ bottom: -1 }}
            />
          )}
        </Pressable>
      </HStack>
    </View>
  );
};

export default SearchPart;