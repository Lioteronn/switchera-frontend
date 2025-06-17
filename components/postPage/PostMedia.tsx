import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

interface PostMediaProps {
    photos: string[];
    onImageSize?: (width: number, height: number) => void;
}

const { height, width } = Dimensions.get('window');
const imageHeight = Math.round(height * 1);
const imageWidth = Math.round(width * 1);

const PostMedia: React.FC<PostMediaProps> = ({ photos, onImageSize }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(1);    useEffect(() => {
        if (photos.length > 0) {
            console.log('🖼️ Loading image with URI:', photos[0]);
            Image.getSize(photos[0], (w, h) => {
                console.log('✅ Image size retrieved:', { width: w, height: h });
                if (onImageSize) onImageSize(w, h);
                setAspectRatio(w / h);
            }, (error) => {
                console.error('❌ Error getting image size:', error);
                console.error('❌ Failed image URI:', photos[0]);
            });
        }
    }, [photos, onImageSize]);

    if (!photos || photos.length === 0) {
        return null;
    }

    const openModal = (photo: string) => {
        setSelectedPhoto(photo);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedPhoto(null);
    };

    const renderPhotos = () => {
        if (photos.length === 1) {
            return (                <TouchableOpacity onPress={() => openModal(photos[0])} style={styles.singlePhotoContainer}>
                    <Image
                        source={{ uri: photos[0] }}
                        style={[styles.singlePhoto, aspectRatio ? { aspectRatio } : {}]}
                        resizeMode="cover"
                        onError={(error) => {
                            console.error('❌ Image load error:', error.nativeEvent.error);
                            console.error('❌ Failed to load image URI:', photos[0]);
                        }}
                        onLoad={() => {
                            console.log('✅ Image loaded successfully:', photos[0]);
                        }}
                    />
                </TouchableOpacity>
            );
        }
        if (photos.length === 2) {
            return (
                <FlatList
                    data={photos}
                    horizontal
                    pagingEnabled
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openModal(item)} style={{ width: imageWidth }}>
                            <Image
                                source={{ uri: item }}
                                style={[styles.singlePhoto, { width: imageHeight }]}
                            />
                        </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            );
        }
        if (photos.length === 3) {
            return (
                <View>
                    <View style={styles.rowContainer}>
                        <TouchableOpacity onPress={() => openModal(photos[0])} style={{ width: '49%' }}>
                            <Image
                                source={{ uri: photos[0] }}
                                style={styles.halfWidthPhoto}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModal(photos[1])} style={{ width: '49%' }}>
                            <Image
                                source={{ uri: photos[1] }}
                                style={styles.halfWidthPhoto}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 6 }}>
                        <TouchableOpacity onPress={() => openModal(photos[2])} style={{ width: '100%' }}>
                            <Image
                                source={{ uri: photos[2] }}
                                style={styles.singlePhoto}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        // Si hay más de 4, solo mostramos las 4 primeras
        return (
            <View style={styles.gridContainer}>
                {photos.slice(0, 4).map((photo, index) => (
                    <TouchableOpacity key={index} onPress={() => openModal(photo)} style={{ width: '49%' }}>
                        <Image
                            source={{ uri: photo }}
                            style={styles.gridPhoto}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderPhotos()}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalBackground}>
                    <Pressable style={styles.modalBackground} onPress={closeModal}>
                        {selectedPhoto && (
                            <Image
                                source={{ uri: selectedPhoto }}
                                style={styles.fullscreenPhoto}
                                resizeMode="contain"
                            />
                            
                        )}
                    </Pressable>
                </View>
            </Modal>
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
        width: '100%',
        height: 400,
        borderRadius: 8,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridPhoto: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        marginBottom: '2%',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenPhoto: {
        width: '90%',
        height: '70%',
        zIndex: 4,
        borderRadius: 12,
    },
});

export default PostMedia;