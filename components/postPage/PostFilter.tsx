import { Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface PostFilterProps {
  activeTab: 'all' | 'followed' | 'saved';
  onTabChange: (tab: 'all' | 'followed' | 'saved') => void;
  onSearch: (searchTerm: string) => void;
}

const PostFilter: React.FC<PostFilterProps> = ({ activeTab, onTabChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    onSearch(text);
  };

  return (
    <View className="bg-white px-4 pb-2">
      <View className="flex-row items-center bg-gray-100 rounded-lg px-3 mb-3">
        <Search size={18} color="#6B7280" style={{ marginRight: 8 }} />
        <TextInput
          className="flex-1 py-2 text-base"
          placeholder="Buscar publicaciones..."
          value={searchTerm}
          onChangeText={handleSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 px-4 ${activeTab === 'all' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => onTabChange('all')}
        >
          <Text className={`text-base font-medium text-center ${activeTab === 'all' ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}>
        Para ti
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 py-3 px-4 ${activeTab === 'followed' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => onTabChange('followed')}
        >
          <Text className={`text-base font-medium text-center ${activeTab === 'followed' ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}>
        Siguiendo
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`flex-1 py-3 px-4 ${activeTab === 'saved' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => onTabChange('saved')}
        >
          <Text className={`text-base font-medium text-center ${activeTab === 'saved' ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}>
        Guardados
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostFilter;
