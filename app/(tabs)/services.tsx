import React, { useState } from 'react';
import {
  View, StyleSheet, FlatList, useWindowDimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import ServiceCard from "@/components/ServiceCard";
import SearchFilter from "@/components/searchFilter";
import FilterServicesOptions from "@/components/filterServicesOptions";

interface ServiceItem {
  id: number;
  title: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  instructor: string;
  description: string;
  duration: string;
  location: string;
  availability: string;
  maxCapacity: number;
  tags: string[];
  image: string;
  mode: "teaching" | "learning";
}

const MOCK_SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: "Guitar Lessons for Beginners",
    price: 25,
    category: "Music",
    rating: 4.8,
    reviews: 24,
    instructor: "Jane Smith",
    description: "Learn the basics of guitar playing with personalized 1-on-1 lessons. Perfect for absolute beginners!",
    duration: "45 min",
    location: "Online",
    availability: "Mon, Wed, Fri",
    maxCapacity: 3,
    tags: ["beginner", "guitar", "music"],
    image: "https://source.unsplash.com/random/100x100/?guitar",
    mode: "teaching"
  },
  {
    id: 2,
    title: "Spanish Language Immersion",
    price: 30,
    category: "Languages",
    rating: 4.9,
    reviews: 32,
    instructor: "Carlos Rodriguez",
    description: "Conversational Spanish lessons with a native speaker. Improve your speaking skills fast!",
    duration: "60 min",
    location: "Online",
    availability: "Weekdays",
    maxCapacity: 1,
    tags: ["spanish", "language", "conversation"],
    image: "https://source.unsplash.com/random/100x100/?spanish",
    mode: "learning"
  },
  {
    id: 3,
    title: "Personal Yoga Sessions",
    price: 40,
    category: "Fitness",
    rating: 4.7,
    reviews: 18,
    instructor: "Maya Patel",
    description: "Private yoga sessions customized to your fitness level and goals. Focus on flexibility and mindfulness.",
    duration: "60 min",
    location: "In Person",
    availability: "Weekends",
    maxCapacity: 1,
    tags: ["yoga", "wellness", "fitness"],
    image: "https://source.unsplash.com/random/100x100/?yoga",
    mode: "teaching"
  },
  {
    id: 4,
    title: "Python Programming",
    price: 22,
    category: "Programming",
    rating: 4.8,
    reviews: 28,
    instructor: "Alex Kim",
    description: "Start coding in Python and build your first projects.",
    duration: "60 min",
    location: "Online",
    availability: "Tue, Thu",
    maxCapacity: 5,
    tags: ["python", "programming", "beginner"],
    image: "https://source.unsplash.com/random/100x100/?python",
    mode: "learning"
  },
  {
    id: 5,
    title: "Creative Writing Workshop",
    price: 18,
    category: "Writing",
    rating: 4.9,
    reviews: 14,
    instructor: "Emily Clark",
    description: "Unlock your creativity and learn storytelling techniques.",
    duration: "90 min",
    location: "Online",
    availability: "Saturdays",
    maxCapacity: 8,
    tags: ["writing", "creativity", "storytelling"],
    image: "https://source.unsplash.com/random/100x100/?writing",
    mode: "teaching"
  },
  {
    id: 6,
    title: "Photography Basics",
    price: 20,
    category: "Art",
    rating: 4.7,
    reviews: 9,
    instructor: "Liam Nguyen",
    description: "Learn how to use your camera and compose great photos.",
    duration: "60 min",
    location: "In Person",
    availability: "Weekends",
    maxCapacity: 6,
    tags: ["photography", "art", "camera"],
    image: "https://source.unsplash.com/random/100x100/?photography",
    mode: "teaching"
  },
  {
    id: 7,
    title: "Digital Marketing Essentials",
    price: 18,
    category: "Business",
    rating: 4.6,
    reviews: 11,
    instructor: "Sara Lopez",
    description: "Learn the basics of online marketing and social media.",
    duration: "60 min",
    location: "Online",
    availability: "Mon, Wed",
    maxCapacity: 10,
    tags: ["marketing", "digital", "business"],
    image: "https://source.unsplash.com/random/100x100/?marketing",
    mode: "learning"
  },
  {
    id: 8,
    title: "Chess for Beginners",
    price: 12,
    category: "Games",
    rating: 4.6,
    reviews: 7,
    instructor: "Ivan Petrov",
    description: "Learn chess rules, tactics, and strategies from scratch.",
    duration: "45 min",
    location: "Online",
    availability: "Fridays",
    maxCapacity: 4,
    tags: ["chess", "games", "beginner"],
    image: "https://source.unsplash.com/random/100x100/?chess",
    mode: "teaching"
  },
  {
    id: 9,
    title: "UX/UI Design Fundamentals",
    price: 25,
    category: "Design",
    rating: 4.7,
    reviews: 13,
    instructor: "Marta Rossi",
    description: "Understand the basics of user experience and interface design.",
    duration: "60 min",
    location: "Online",
    availability: "Thursdays",
    maxCapacity: 7,
    tags: ["design", "ux", "ui"],
    image: "https://source.unsplash.com/random/100x100/?design",
    mode: "learning"
  },
  {
    id: 10,
    title: "Basic French Conversation",
    price: 15,
    category: "Languages",
    rating: 4.5,
    reviews: 6,
    instructor: "Pierre Dubois",
    description: "Start speaking French with practical conversation lessons.",
    duration: "45 min",
    location: "Online",
    availability: "Mondays",
    maxCapacity: 5,
    tags: ["french", "languages", "conversation"],
    image: "https://source.unsplash.com/random/100x100/?french",
    mode: "teaching"
  },
];

const PRICE_RANGES: { min: number; max: number; label: string }[] = [
  { min: 0, max: 25, label: "$0-25" },
  { min: 25, max: 50, label: "$25-50" },
  { min: 50, max: 75, label: "$50-75" },
  { min: 75, max: 100, label: "$75-100" }
];

export default function ServicesScreen() {
  const { width } = useWindowDimensions();
  const isTabletOrDesktop = width > 768;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [isOnline, setIsOnline] = useState(true);
  const [isInPerson, setIsInPerson] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const getFilteredServices = (): ServiceItem[] => {
    return MOCK_SERVICES.filter(service => {
      const matchesSearch =
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          service.mode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
          activeCategory === "All" ||
          activeCategory === "All Categories" ||
          (activeCategory === "Teaching" && service.mode === "teaching") ||
          (activeCategory === "Learning" && service.mode === "learning") ||
          service.category === activeCategory;

      const matchesPrice =
          service.price >= priceRange[0] && service.price <= priceRange[1];

      const matchesLocation =
          (isOnline && service.location === "Online") ||
          (isInPerson && service.location === "In Person");

      const matchesDuration =
          selectedDuration.length === 0 || selectedDuration.includes(service.duration);

      return (
          matchesSearch &&
          matchesCategory &&
          matchesPrice &&
          matchesLocation &&
          matchesDuration
      );
    });
  };

  const renderServiceCard = ({ item }: { item: ServiceItem }) => (
      <ServiceCard item={item} />
  );

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.mainSection}>
          {/* Columna izquierda */}
          <View style={styles.leftColumn}>
            <SearchFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />
            <FlatList
                data={getFilteredServices()}
                renderItem={renderServiceCard}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                numColumns={isTabletOrDesktop ? 2 : 1}
                key={isTabletOrDesktop ? 'two-columns' : 'one-column'}
                columnWrapperStyle={isTabletOrDesktop ? styles.cardsRow : undefined}
                contentContainerStyle={styles.servicesList}
            />
          </View>
          {/* Columna derecha (filtros) */}
          {isTabletOrDesktop && (
              <View style={styles.rightColumn}>
                <FilterServicesOptions
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    selectedPriceRange={selectedPriceRange}
                    setSelectedPriceRange={setSelectedPriceRange}
                    setPriceRange={setPriceRange}
                    isOnline={isOnline}
                    setIsOnline={setIsOnline}
                    isInPerson={isInPerson}
                    setIsInPerson={setIsInPerson}
                    selectedDuration={selectedDuration}
                    setSelectedDuration={setSelectedDuration}
                    PRICE_RANGES={PRICE_RANGES}
                    onApply={() => setShowFilterPanel(false)}
                    onReset={() => {
                      setActiveCategory("All");
                      setSelectedPriceRange("");
                      setPriceRange([0, 100]);
                      setIsOnline(true);
                      setIsInPerson(false);
                      setSelectedDuration([]);
                    }}
                />
              </View>
          )}
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mainSection: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 2,
    paddingLeft: 0,
    paddingRight: 0,
  },
  rightColumn: {
    width: 320,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
    padding: 15,
  },

topSection: {
backgroundColor: '#fff',
paddingHorizontal: 15,
paddingVertical: 15,
borderBottomWidth: 1,
borderBottomColor: '#eee',
},
title: {
fontSize: 24,
fontWeight: 'bold',
marginBottom: 15,
},
searchContainer: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#f3f4f6',
marginBottom: 15,
paddingHorizontal: 15,
paddingVertical: 10,
borderRadius: 8,
},
searchIcon: {
marginRight: 10,
},
searchInput: {
flex: 1,
fontSize: 16,
},
categoriesContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
},
categoryButton: {
flex: 1,
paddingVertical: 10,
marginHorizontal: 4,
borderRadius: 8,
backgroundColor: '#f3f4f6',
alignItems: 'center',
},
activeCategoryButton: {
backgroundColor: '#2563eb',
},
categoryButtonText: {
fontSize: 14,
color: '#333',
},
activeCategoryButtonText: {
color: '#fff',
},
servicesSection: {
flex: 2,
},
servicesList: {
padding: 10,
},
cardsRow: {
justifyContent: 'space-between',
},
filtersSection: {
width: 280,
backgroundColor: '#fff',
borderLeftWidth: 1,
borderLeftColor: '#eee',
padding: 15,
},
serviceCard: {
backgroundColor: '#fff',
borderRadius: 8,
padding: 16,
margin: 8,
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.1,
shadowRadius: 2,
elevation: 2,
flex: 1,
},
cardHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'flex-start',
marginBottom: 10,
},
cardTitle: {
fontSize: 16,
fontWeight: 'bold',
flex: 1,
marginRight: 10,
},
cardPrice: {
fontSize: 16,
fontWeight: 'bold',
color: '#2563eb',
},
categoryContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
marginBottom: 10,
},
categoryText: {
backgroundColor: '#f3f4f6',
paddingHorizontal: 8,
paddingVertical: 2,
borderRadius: 4,
fontSize: 12,
},
ratingContainer: {
flexDirection: 'row',
alignItems: 'center',
},
ratingText: {
marginLeft: 4,
fontSize: 14,
fontWeight: 'bold',
},
reviewsText: {
fontSize: 12,
color: '#666',
marginLeft: 2,
},
instructorContainer: {
flexDirection: 'row',
alignItems: 'center',
marginBottom: 8,
},
instructorImage: {
width: 24,
height: 24,
borderRadius: 12,
marginRight: 8,
},
instructorName: {
fontSize: 14,
fontWeight: '500',
},
description: {
fontSize: 13,
color: '#555',
marginBottom: 10,
lineHeight: 18,
},
tagsContainer: {
flexDirection: 'row',
flexWrap: 'wrap',
marginBottom: 12,
},
tag: {
backgroundColor: '#e9f0ff',
paddingHorizontal: 8,
paddingVertical: 3,
borderRadius: 4,
marginRight: 6,
marginBottom: 6,
},
tagText: {
color: '#2563eb',
fontSize: 12,
},
cardButtons: {
flexDirection: 'row',
justifyContent: 'space-between',
},
viewDetailsButton: {
paddingVertical: 8,
paddingHorizontal: 12,
borderWidth: 1,
borderColor: '#2563eb',
borderRadius: 6,
flex: 1,
marginRight: 6,
alignItems: 'center',
},
viewDetailsText: {
color: '#2563eb',
fontSize: 13,
fontWeight: '500',
},
bookButton: {
paddingVertical: 8,
paddingHorizontal: 12,
backgroundColor: '#2563eb',
borderRadius: 6,
flex: 1,
marginLeft: 6,
alignItems: 'center',
},
bookText: {
color: '#fff',
fontSize: 13,
fontWeight: '500',
},

// Estilos para los filtros
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
//Estilos para el botón de filtro móvil


mobileFilterButton: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#2563eb',
paddingVertical: 10,
paddingHorizontal: 15,
borderRadius: 8,
margin: 10,
alignSelf: 'flex-start',
},
mobileFilterButtonText: {
color: '#fff',
marginLeft: 8,
fontWeight: '500',
},
mobileFiltersOverlay: {
position: 'absolute',
top: 0,
left: 0,
right: 0,
bottom: 0,
backgroundColor: 'rgba(0,0,0,0.5)',
zIndex: 10,
},
mobileFiltersPanel: {
position: 'absolute',
top: 0,
left: 0,
right: 0,
bottom: 0,
backgroundColor: '#fff',
zIndex: 11,
padding: 20,
},
mobileFilterHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 20,
},
closeButton: {
fontSize: 30,
color: '#666',
},
mobileFilterContent: {
flex: 1,
}
});
