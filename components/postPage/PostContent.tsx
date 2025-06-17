import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PostContentProps {
    title: string;
    categories: string[];
    description: string;
}

const PostContent: React.FC<PostContentProps> = ({ title, categories, description }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.categories}>
                {categories.map((category, index) => (
                    <View key={index} style={styles.categoryTag}>
                        <Text style={styles.categoryText}>{category}</Text>
                    </View>
                ))}
            </View>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
        gap: 6,
    },
    categoryTag: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 13,
        color: '#666',
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
        paddingVertical: 6,
    },
});

export default PostContent;