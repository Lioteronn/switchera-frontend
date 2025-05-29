import React from "react";
                import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from "react-native";

                interface PriceRange {
                    min: number;
                    max: number;
                    label: string;
                }

                interface Props {
                    activeCategory: string;
                    setActiveCategory: (cat: string) => void;
                    selectedPriceRange: string;
                    setSelectedPriceRange: (label: string) => void;
                    setPriceRange: (range: [number, number]) => void;
                    isOnline: boolean;
                    setIsOnline: (val: boolean) => void;
                    isInPerson: boolean;
                    setIsInPerson: (val: boolean) => void;
                    selectedDuration: string[];
                    setSelectedDuration: (arr: string[]) => void;
                    PRICE_RANGES: PriceRange[];
                    onApply?: () => void;
                    onReset?: () => void;
                }

                const CATEGORIES = ["All Categories", "Music", "Languages", "Fitness", "Technology", "Art", "Finance"];
                const DURATIONS = ["30 minutos", "45 minutos", "60 minutos", "90+ minutos"];

                export default function FilterServicesOptions({
                    activeCategory,
                    setActiveCategory,
                    selectedPriceRange,
                    setSelectedPriceRange,
                    setPriceRange,
                    isOnline,
                    setIsOnline,
                    isInPerson,
                    setIsInPerson,
                    selectedDuration,
                    setSelectedDuration,
                    PRICE_RANGES,
                    onApply,
                    onReset,
                }: Props) {
                    return (
                        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                            <Text style={styles.filterTitle}>Filtros</Text>

                            <Text style={styles.filterSectionTitle}>Categoría</Text>
                            <ScrollView style={styles.filterCategoriesScroll}>
                                {CATEGORIES.map(category => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.filterCategoryOption,
                                            activeCategory === category && styles.activeFilterCategory
                                        ]}
                                        onPress={() => setActiveCategory(category)}
                                    >
                                        <Text
                                            style={[
                                                styles.filterCategoryText,
                                                activeCategory === category && styles.activeFilterCategoryText
                                            ]}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.filterSectionTitle}>Rango de precio</Text>
                            <View style={styles.priceRangesContainer}>
                                {PRICE_RANGES.map(range => (
                                    <TouchableOpacity
                                        key={range.label}
                                        style={[
                                            styles.priceRangeOption,
                                            selectedPriceRange === range.label && styles.selectedPriceRange
                                        ]}
                                        onPress={() => {
                                            setSelectedPriceRange(range.label);
                                            setPriceRange([range.min, range.max]);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.priceRangeText,
                                                selectedPriceRange === range.label && styles.selectedPriceRangeText
                                            ]}
                                        >
                                            {range.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.filterSectionTitle}>Ubicación</Text>
                            <View style={styles.locationContainer}>
                                <View style={styles.locationOption}>
                                    <Text>Online</Text>
                                    <Switch
                                        value={isOnline}
                                        onValueChange={setIsOnline}
                                        trackColor={{ false: "#ddd", true: "#2563eb" }}
                                    />
                                </View>
                                <View style={styles.locationOption}>
                                    <Text>En persona</Text>
                                    <Switch
                                        value={isInPerson}
                                        onValueChange={setIsInPerson}
                                        trackColor={{ false: "#ddd", true: "#2563eb" }}
                                    />
                                </View>
                            </View>

                            <Text style={styles.filterSectionTitle}>Duración</Text>
                            <View style={styles.durationContainer}>
                                {DURATIONS.map(duration => (
                                    <TouchableOpacity
                                        key={duration}
                                        style={[
                                            styles.durationOption,
                                            selectedDuration.includes(duration) && styles.selectedDuration
                                        ]}
                                        onPress={() => {
                                            if (selectedDuration.includes(duration)) {
                                                setSelectedDuration(selectedDuration.filter(d => d !== duration));
                                            } else {
                                                setSelectedDuration([...selectedDuration, duration]);
                                            }
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.durationText,
                                                selectedDuration.includes(duration) && styles.selectedDurationText
                                            ]}
                                        >
                                            {duration}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.filterButtons}>
                                <TouchableOpacity style={styles.applyButton} onPress={onApply}>
                                    <Text style={styles.applyButtonText}>Aplicar filtros</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.resetButton} onPress={onReset}>
                                    <Text style={styles.resetButtonText}>Restablecer</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    );
                }

                const styles = StyleSheet.create({
                    filterTitle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 20,
                    },
                    filterSectionTitle: {
                        fontSize: 15,
                        fontWeight: '600',
                        marginBottom: 10,
                        marginTop: 15,
                    },
                    filterCategoriesScroll: {
                        maxHeight: 150,
                    },
                    filterCategoryOption: {
                        paddingVertical: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f3f4f6',
                    },
                    activeFilterCategory: {
                        backgroundColor: '#f0f7ff',
                    },
                    filterCategoryText: {
                        fontSize: 14,
                        color: '#333',
                    },
                    activeFilterCategoryText: {
                        color: '#2563eb',
                        fontWeight: '500',
                    },
                    priceRangesContainer: {
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: 10,
                    },
                    priceRangeOption: {
                        backgroundColor: '#f3f4f6',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 6,
                        margin: 4,
                    },
                    selectedPriceRange: {
                        backgroundColor: '#2563eb',
                    },
                    priceRangeText: {
                        fontSize: 13,
                        color: '#333',
                    },
                    selectedPriceRangeText: {
                        color: '#fff',
                    },
                    locationContainer: {
                        marginBottom: 15,
                    },
                    locationOption: {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 8,
                    },
                    durationContainer: {
                        marginBottom: 20,
                    },
                    durationOption: {
                        marginVertical: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 6,
                    },
                    durationText: {
                        color: '#333',
                    },
                    selectedDuration: {
                        borderColor: '#2563eb',
                        backgroundColor: '#e9f0ff',
                    },
                    selectedDurationText: {
                        color: '#2563eb',
                    },
                    filterButtons: {
                        marginTop: 20,
                    },
                    applyButton: {
                        backgroundColor: '#2563eb',
                        borderRadius: 8,
                        paddingVertical: 10,
                        alignItems: 'center',
                        marginBottom: 10,
                    },
                    applyButtonText: {
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: 15,
                    },
                    resetButton: {
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        paddingVertical: 10,
                        alignItems: 'center',
                    },
                    resetButtonText: {
                        color: '#666',
                        fontWeight: '600',
                        fontSize: 15,
                    },
                });