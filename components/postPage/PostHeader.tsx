import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { User } from 'lucide-react-native';
import React from 'react';
import { Image, View } from 'react-native';

interface PostHeaderProps {
    userId: string;
    userName: string;
    userImage: string | null;
}

const PostHeader: React.FC<PostHeaderProps> = ({ userId, userName, userImage }) => {
    return (
        <HStack className="items-center p-4">
            {userImage ? (
                <Image
                    source={{ uri: userImage }}
                    className="w-10 h-10 rounded-full mr-3"
                />
            ) : (
                <View className="w-10 h-10 rounded-full bg-gray-200 mr-3 items-center justify-center">
                    <User size={20} color="#4B5563" />
                </View>
            )}
            <Text className="font-semibold text-gray-800 text-base">{userName}</Text>
        </HStack>
    );
};

export default PostHeader;