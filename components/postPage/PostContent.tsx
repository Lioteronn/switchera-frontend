import React from 'react';
import { Text, View } from 'react-native';
interface PostContentProps {
    title: string;
    categories: string[];
    description: string;
}

const PostContent: React.FC<PostContentProps> = ({ title, categories, description }) => {
    return (
        <React.Fragment>
            <View style={{ padding: 16 }}></View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{title}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
                {categories.map((category, index) => (
                <View
                    key={index}
                    style={{
                    backgroundColor: '#BFDBFE',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    marginRight: 8,
                    marginBottom: 4,
                    }}
                >
                    <Text style={{ color: '#1E40AF', fontSize: 12, fontWeight: '600' }}>
                    {category}
                    </Text>
                </View>
                ))}
            </View>
            <Text style={{ color: '#374151' }}>{description}</Text>
        </React.Fragment>
    );
};

export default PostContent;