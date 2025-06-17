import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (postData: { title: string; content: string; image?: string | null; imageUri?: string | null }) => void; // Added imageUri
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ visible, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryInput, setCategoryInput] = useState('');
    const [photos, setPhotos] = useState<string[]>([]); // These are local URIs from ImagePicker
    const [error, setError] = useState('');

    const handleAddCategory = () => {
        if (!categoryInput.trim()) return;
        
        if (categories.length >= 5) {
            setError('You can only add up to 5 categories');
            return;
        }
        
        if (!categories.includes(categoryInput.trim())) {
            setCategories([...categories, categoryInput.trim()]);
            setCategoryInput('');
            setError('');
        }
    };

    const handleRemoveCategory = (index: number) => {
        const newCategories = [...categories];
        newCategories.splice(index, 1);
        setCategories(newCategories);
    };

    const pickImage = async () => {
        if (photos.length >= 4) {
            setError('You can only add up to 4 photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsMultipleSelection: true,
            selectionLimit: 4 - photos.length,
        });

        if (!result.canceled && result.assets) {
            const newPhotos = [...photos];
            result.assets.forEach(asset => {
                if (newPhotos.length < 4) {
                    newPhotos.push(asset.uri);
                }
            });
            setPhotos(newPhotos);
        }
    };

    const handleSubmit = () => {
        if (!title.trim() || !description.trim()) {
            setError('Title and description are required');
            return;
        }

        // Categories are not sent for now as they are not in the backend model
        // if (categories.length === 0) {
        //     setError('Please add at least one category');
        //     return;
        // }        // Image handling: Pass the first selected image URI for upload
        const postDataToSubmit = {
            title: title.trim(),
            content: description.trim(),
            image: null, // Will be set after upload
            imageUri: photos.length > 0 ? photos[0] : null, // Pass the first image URI for upload
        };

        onSubmit(postDataToSubmit);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategories([]);
        setCategoryInput('');
        setPhotos([]);
        setError('');
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Create New Post</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter post title"
                        />

                        <Text style={styles.label}>Categories</Text>
                        <View style={styles.categoryInputContainer}>
                            <TextInput
                                style={styles.categoryInput}
                                value={categoryInput}
                                onChangeText={setCategoryInput}
                                placeholder="Add category"
                            />
                            <TouchableOpacity 
                                style={styles.addCategoryButton}
                                onPress={handleAddCategory}
                            >
                                <Plus size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.categoriesContainer}>
                            {categories.map((category, index) => (
                                <TouchableOpacity 
                                    key={index}
                                    style={styles.category}
                                    onPress={() => handleRemoveCategory(index)}
                                >
                                    <Text style={styles.categoryText}>{category}</Text>
                                    <X size={14} color="#1D4ED8" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Write your post description"
                            multiline
                            numberOfLines={4}
                        />

                        <Text style={styles.label}>Photos (up to 4)</Text>
                        <View style={styles.photosContainer}>
                            {photos.map((photo, index) => (
                                <Image 
                                    key={index} 
                                    source={{ uri: photo }} 
                                    style={styles.photoPreview} 
                                />
                            ))}
                            
                            {photos.length < 4 && (
                                <TouchableOpacity 
                                    style={styles.addPhotoButton}
                                    onPress={pickImage}
                                >
                                    <ImageIcon size={24} color="#6B7280" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity 
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        width: '90%',
        maxHeight: '80%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: 16,
        maxHeight: '70%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categoryInputContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    categoryInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    addCategoryButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        padding: 12,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    category: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DBEAFE',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 4,
    },
    categoryText: {
        color: '#1D4ED8',
        marginRight: 4,
    },
    photosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    photoPreview: {
        width: 80,
        height: 80,
        borderRadius: 8,
        margin: 4,
    },
    addPhotoButton: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
    },
    errorText: {
        color: '#EF4444',
        marginBottom: 16,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CreatePostModal;