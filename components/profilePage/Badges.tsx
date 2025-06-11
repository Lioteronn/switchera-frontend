import { ArrowLeft, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';

// Badge interfaces
interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    level: number;
    progress: number;
    maxProgress: number;
    unlocked: boolean;
    featured: boolean;
}

interface BadgesProps {
    userId: string;
    showFeaturedOnly?: boolean;
    onBadgePress?: (badge: Badge) => void;
}

const Badges: React.FC<BadgesProps> = ({ userId, showFeaturedOnly = true, onBadgePress }) => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [featuredBadges, setFeaturedBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    //Fetch badges from API

    useEffect(() => {
        const fetchBadges = async () => {
            setLoading(true);
            try {
                //Aqui va la api en teoria
                // await fetch('https://localhost:8000/users/${userId}/badges')
                const data = await mockFetchBadges(userId);
                const sortedBadges = data.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    if (a.unlocked && !b.unlocked) return -1;
                    if (!a.unlocked && b.unlocked) return 1;
                    return b.progress / b.maxProgress - a.progress / a.maxProgress;
                });
                setBadges(sortedBadges);
                setFeaturedBadges(sortedBadges.filter(badge => badge.featured).slice(0, 3));
            } catch (err) {
                setError('Failed to load badges');
            } finally {
                setLoading(false);
            }
        };
        fetchBadges();
    }, [userId]);

    const handleBadgePress = (badge: Badge) => {
        setSelectedBadge(badge);
        setDetailModalVisible(true);
        if (onBadgePress) {
            onBadgePress(badge);
        }
    };

    const toggleFeatured = async (badgeId: string) => {
        const updatedBadges = badges.map(badge => {
            if (badge.id === badgeId) {
                return { ...badge, featured: !badge.featured };
            }
            if (!badge.featured && badges.filter(b => b.featured).length >= 3) {
                const currentFeatured = badges.filter(b => b.featured);
                if (currentFeatured.indexOf(badge) === 0) {
                    return { ...badge, featured: false };
                }
            }
            return badge;
        });
        setBadges(updatedBadges);
        setFeaturedBadges(updatedBadges.filter(badge => badge.featured).slice(0, 3));
    };

    const renderBadgeCard = (badge: Badge) => (
        <TouchableOpacity
            key={badge.id}
            className={`w-[30%] mr-2.5 rounded-xl p-3 items-center shadow bg-white ${badge.unlocked ? '' : 'bg-gray-100'}`}
            activeOpacity={0.7}
            onPress={() => handleBadgePress(badge)}
        >
            <Image
                source={{ uri: badge.icon }}
                className={`w-12 h-12 mb-2 ${!badge.unlocked ? 'opacity-40' : ''}`}
            />
            <Text className="text-sm font-bold text-center mb-1" numberOfLines={1}>{badge.name}</Text>
            {badge.unlocked ? (
                badge.level > 0 ? (
                    <Text className="text-xs text-green-600 font-medium mb-1">Level {badge.level}</Text>
                ) : null
            ) : (
                <Text className="text-xs text-gray-400 font-medium mb-1">Locked</Text>
            )}
            <View className="w-full h-1 bg-gray-200 rounded overflow-hidden">
                <View
                    className={`h-full rounded ${badge.unlocked ? 'bg-blue-500' : 'bg-gray-400'}`}
                    style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                />
            </View>
            <Text className="text-[10px] text-gray-500 text-center mt-1">
                {badge.progress}/{badge.maxProgress}
            </Text>
        </TouchableOpacity>
    );

    const renderBadgeItem = ({ item }: { item: Badge }) => (
        <TouchableOpacity
            className="w-[32%] mx-[0.66%] mb-4 items-center"
            activeOpacity={0.7}
            onPress={() => handleBadgePress(item)}
        >
            <View className={`w-20 h-20 rounded-full ${item.unlocked ? 'bg-white' : 'bg-gray-100'} justify-center items-center shadow mb-2 relative`}>
                <Image
                    source={{ uri: item.icon }}
                    className={`w-12 h-12 ${!item.unlocked ? 'opacity-40' : ''}`}
                />
                {item.featured && <View className="absolute w-4 h-4 rounded-full bg-yellow-400 border-2 border-white top-0 right-0" />}
            </View>
            <Text className="text-sm font-medium text-center mb-1 w-full" numberOfLines={1}>{item.name}</Text>
            <View className="w-4/5 h-1 bg-gray-200 rounded overflow-hidden">
                <View
                    className="h-full rounded bg-blue-500"
                    style={{ width: `${(item.progress / item.maxProgress) * 100}%` }}
                />
            </View>
        </TouchableOpacity>
    );

    if (loading && showFeaturedOnly) {
        return (
            <View className="p-5 items-center justify-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="mt-2 text-gray-500 text-base">Loading badges...</Text>
            </View>
        );
    }

    if (error && showFeaturedOnly) {
        return (
            <View className="p-5 items-center justify-center">
                <Text className="text-red-500 text-base mb-2">{error}</Text>
                <TouchableOpacity onPress={() => setBadges([])}>
                    <Text className="text-blue-500 text-sm font-medium">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="py-4">
            {showFeaturedOnly ? (
                <>
                    <View className="flex-row justify-between items-center px-4 mb-3">
                        <Text className="text-lg font-bold text-gray-800">Featured Badges</Text>
                        <TouchableOpacity className="p-1.5" onPress={() => setModalVisible(true)}>
                            <Text className="text-blue-500 text-sm font-medium">Show All</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row px-4">
                        {featuredBadges.length > 0 ? (
                            featuredBadges.map(renderBadgeCard)
                        ) : (
                            <Text className="text-sm text-gray-500 text-center p-5 w-full">No badges yet</Text>
                        )}
                    </View>
                </>
            ) : (
                <View className="flex-1">
                    <FlatList
                        data={badges}
                        renderItem={renderBadgeItem}
                        keyExtractor={item => item.id}
                        numColumns={3}
                        contentContainerStyle={{ padding: 12 }}
                        ListEmptyComponent={
                            <Text className="text-sm text-gray-500 text-center p-5 w-full">No badges yet</Text>
                        }
                    />
                </View>
            )}

            {/* Modal for showing all badges */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-gray-50">
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-white">
                        <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1">
                            <ArrowLeft size={24} color="#000" />
                        </TouchableOpacity>
                        <Text className="text-lg font-bold text-gray-900">All Badges</Text>
                        <View style={{ width: 24 }} />
                    </View>
                    {loading ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text className="mt-2 text-gray-500 text-base">Loading badges...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={badges}
                            renderItem={renderBadgeItem}
                            keyExtractor={item => item.id}
                            numColumns={3}
                            contentContainerStyle={{ padding: 12 }}
                            ListEmptyComponent={
                                <Text className="text-sm text-gray-500 text-center p-5 w-full">No badges yet</Text>
                            }
                        />
                    )}
                </View>
            </Modal>

            {/* Modal for badge details */}
            <Modal
                visible={detailModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setDetailModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center p-5">
                    <View className="bg-white rounded-2xl p-6 w-[90%] max-w-[400px] items-center relative">
                        <TouchableOpacity
                            className="absolute right-4 top-4 p-1"
                            onPress={() => setDetailModalVisible(false)}
                        >
                            <X size={24} color="#000" />
                        </TouchableOpacity>
                        {selectedBadge && (
                            <>
                                <Image
                                    source={{ uri: selectedBadge.icon }}
                                    className="w-24 h-24 mb-4"
                                />
                                <Text className="text-xl font-bold text-center mb-2">{selectedBadge.name}</Text>
                                {selectedBadge.unlocked ? (
                                    <View className="flex-row items-center mb-4">
                                        <Text className="text-base text-green-500 font-bold mr-2">Unlocked</Text>
                                        {selectedBadge.level > 0 && (
                                            <Text className="text-base text-indigo-500 font-medium">Level {selectedBadge.level}</Text>
                                        )}
                                    </View>
                                ) : (
                                    <Text className="text-base text-gray-400 font-bold mb-4">Locked</Text>
                                )}
                                <Text className="text-base text-gray-700 text-center mb-5 leading-6">
                                    {selectedBadge.description}
                                </Text>
                                <View className="w-full mb-6 items-center">
                                    <View className="w-full h-2 bg-gray-200 rounded mb-2 overflow-hidden">
                                        <View
                                            className="h-full bg-blue-500 rounded"
                                            style={{ width: `${(selectedBadge.progress / selectedBadge.maxProgress) * 100}%` }}
                                        />
                                    </View>
                                    <Text className="text-base text-gray-500">
                                        {selectedBadge.progress}/{selectedBadge.maxProgress}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    className={`bg-blue-500 py-3 px-5 rounded-lg self-stretch items-center ${selectedBadge.featured ? 'bg-red-500' : ''}`}
                                    onPress={() => toggleFeatured(selectedBadge.id)}
                                >
                                    <Text className="text-white font-bold text-lg">
                                        {selectedBadge.featured ? 'Remove from Featured' : 'Add to Featured'}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Mock data fetching function
const mockFetchBadges = async (userId: string): Promise<Badge[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        {
            id: '1',
            name: 'Early Adopter',
            description: 'Joined during the beta phase of the platform.',
            icon: 'https://cdn-icons-png.flaticon.com/512/2534/2534004.png',
            level: 1,
            progress: 1,
            maxProgress: 1,
            unlocked: true,
            featured: true
        },
        {
            id: '2',
            name: 'Community Builder',
            description: 'Created a community that reached 100 members.',
            icon: 'https://cdn-icons-png.flaticon.com/512/2534/2534031.png',
            level: 2,
            progress: 250,
            maxProgress: 500,
            unlocked: true,
            featured: true
        },
        {
            id: '3',
            name: 'Content Creator',
            description: 'Published 10 posts that received at least 50 likes each.',
            icon: 'https://cdn-icons-png.flaticon.com/512/2534/2534018.png',
            level: 0,
            progress: 6,
            maxProgress: 10,
            unlocked: false,
            featured: false
        },
        {
            id: '4',
            name: 'Helping Hand',
            description: 'Answered 25 questions in help forums.',
            icon: 'https://cdn-icons-png.flaticon.com/512/2534/2534129.png',
            level: 3,
            progress: 25,
            maxProgress: 25,
            unlocked: true,
            featured: true
        },
        {
            id: '5',
            name: 'Trend Setter',
            description: 'Started a hashtag that was used by over 1000 users.',
            icon: 'https://cdn-icons-png.flaticon.com/512/2534/2534210.png',
            level: 0,
            progress: 420,
            maxProgress: 1000,
            unlocked: false,
            featured: false
        },
        {
            id: '6',
            name: 'Power User',
            description: 'Logged in for 30 consecutive days.',
            icon: 'https://cdn-icons-png.flaticon.com/512/2534/2534127.png',
            level: 1,
            progress: 30,
            maxProgress: 30,
            unlocked: true,
            featured: false
        },
        {
            id: '7',
            name: 'Networker',
            description: 'Connected with 50 other users.',
            icon: 'https://cdn-icons-png.flaticon.com/512/2534/2534126.png',
            level: 0,
            progress: 32,
            maxProgress: 50,
            unlocked: false,
            featured: false
        }
    ];
};

export default Badges;
