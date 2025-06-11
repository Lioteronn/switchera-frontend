import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface PostMediaProps {
    photos: string[];
}

const PostMedia: React.FC<PostMediaProps> = ({ photos }) => {
    if (!photos || photos.length === 0) {
        return null;
    }
    
    const renderPhotos = () => {
        switch (photos.length) {
            case 1:
                return (
                    <View style={styles.singlePhotoContainer}>
                        <Image 
                            source={{ uri: photos[0] }} 
                            style={styles.singlePhoto} 
                            resizeMode="cover"
                        />
                    </View>
                );
            case 2:
                return (
                    <View style={styles.rowContainer}>
                        {photos.map((photo, index) => (
                            <Image 
                                key={index} 
                                source={{ uri: photo }} 
                                style={styles.halfWidthPhoto} 
                                resizeMode="cover"
                            />
                        ))}
                    </View>
                );
            case 3:
                return (
                    <View style={styles.threePhotoContainer}>
                        <Image 
                            source={{ uri: photos[0] }} 
                            style={styles.mainPhoto} 
                            resizeMode="cover"
                        />
                        <View style={styles.overlayContainer}>
                            <Text style={styles.overlayText}>+2</Text>
                        </View>
                    </View>
                );
            case 4:
                return (
                    <View style={styles.gridContainer}>
                        {photos.map((photo, index) => (
                            <Image 
                                key={index} 
                                source={{ uri: photo }} 
                                style={styles.gridPhoto} 
                                resizeMode="cover"
                            />
                        ))}
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {renderPhotos()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    singlePhotoContainer: {
        width: '100%',
    },
    singlePhoto: {
        width: '100%',
        height: 300,
        borderRadius: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidthPhoto: {
        width: '49%',
        height: 200,
        borderRadius: 8,
    },
    threePhotoContainer: {
        width: '100%',
        position: 'relative',
    },
    mainPhoto: {
        width: '100%',
        height: 300,
        borderRadius: 8,
    },
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    overlayText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridPhoto: {
        width: '49%',
        height: 150,
        borderRadius: 8,
        marginBottom: '2%',
    },
});

export default PostMedia;