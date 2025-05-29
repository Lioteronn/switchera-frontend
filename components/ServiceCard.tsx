import React from "react";
                 import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
                 import { Star, Clock, Calendar, Globe, User, BookOpen, GraduationCap } from "lucide-react-native";

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

                 interface Props {
                   item: ServiceItem;
                 }

                 export default function ServiceCard({ item }: Props) {
                   return (
                     <View style={styles.serviceCard}>
                       <Text style={styles.cardTitle}>{item.title}</Text>
                       <View style={styles.topRow}>
                         <View style={styles.modePriceContainer}>
                           {item.mode === "teaching" ? (
                             <>
                               <GraduationCap size={16} color="#fff" style={{ marginRight: 4 }} />
                               <Text style={styles.modeText}>Teaching</Text>
                             </>
                           ) : (
                             <>
                               <BookOpen size={15} color="#fff" style={{ marginRight: 4 }} />
                               <Text style={styles.modeText}>Learning</Text>
                             </>
                           )}
                           <Text style={styles.cardPrice}>${item.price}/sesión</Text>
                         </View>
                         <Text style={styles.categoryText}>{item.category}</Text>
                       </View>

                       <View style={styles.categoryRatingRow}>
                         <View style={styles.ratingContainer}>
                           <Star size={16} color="#FFD700" fill="#FFD700" />
                           <Text style={styles.ratingText}>{item.rating}</Text>
                           <Text style={styles.reviewsText}>({item.reviews})</Text>
                         </View>
                       </View>

                       <View style={styles.instructorContainer}>
                         <Image source={{ uri: item.image }} style={styles.instructorImage} />
                         <Text style={styles.instructorName}>{item.instructor}</Text>
                       </View>

                       <Text style={styles.description}>{item.description}</Text>

                       <View style={styles.infoRow}>
                         <View style={styles.infoItem}>
                           <Clock size={14} color="#2563eb" style={styles.infoIcon} />
                           <Text style={styles.infoText}>{item.duration}</Text>
                         </View>
                         <View style={styles.infoItem}>
                           <Calendar size={14} color="#2563eb" style={styles.infoIcon} />
                           <Text style={styles.infoText}>{item.availability}</Text>
                         </View>
                       </View>
                       <View style={styles.infoRow}>
                         <View style={styles.infoItem}>
                           {item.location === "Online" ? (
                             <Globe size={14} color="#2563eb" style={styles.infoIcon} />
                           ) : (
                             <User size={14} color="#2563eb" style={styles.infoIcon} />
                           )}
                           <Text style={styles.infoText}>
                             {item.location === "Online" ? "Online" : "En persona"}
                           </Text>
                         </View>
                         <View style={styles.infoItem}>
                           <User size={14} color="#2563eb" style={styles.participantIcon} />
                           {item.maxCapacity > 0 && (
                             <Text style={styles.infoText}> {item.maxCapacity}</Text>
                           )}
                         </View>
                       </View>

                       <View style={styles.tagsContainer}>
                         {item.tags.map((tag: string) => (
                           <View key={tag} style={styles.tag}>
                             <Text style={styles.tagText}>#{tag}</Text>
                           </View>
                         ))}
                       </View>

                       <View style={styles.cardButtons}>
                         <TouchableOpacity style={styles.viewDetailsButton}>
                           <Text style={styles.viewDetailsText}>Ver detalles</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.bookButton}>
                           <Text style={styles.bookText}>Reservar sesión</Text>
                         </TouchableOpacity>
                       </View>
                     </View>
                   );
                 }

                 const styles = StyleSheet.create({
                   serviceCard: {
                     backgroundColor: "#fff",
                     borderRadius: 8,
                     padding: 16,
                     margin: 8,
                     shadowColor: "#000",
                     shadowOffset: { width: 0, height: 1 },
                     shadowOpacity: 0.1,
                     shadowRadius: 2,
                     elevation: 2,
                     flex: 1,
                   },
                   cardTitle: {
                     fontSize: 16,
                     fontWeight: "bold",
                     marginBottom: 8,
                     padding: 10,
                   },
                   topRow: {
                     flexDirection: "row",
                     alignItems: "center",
                     marginBottom: 10,
                     justifyContent: "space-between",
                   },
                   modePriceContainer: {
                     flexDirection: "row",
                     alignItems: "center",
                     backgroundColor: "#2563eb",
                     borderRadius: 10,
                     borderWidth: 2,
                     borderColor: "#1e3a8a",
                     paddingVertical: 3,
                     paddingHorizontal: 8,
                   },
                   modeText: {
                     fontSize: 13,
                     color: "#fff",
                     fontWeight: "bold",
                     marginRight: 6,
                   },
                   cardPrice: {
                     fontSize: 15,
                     fontWeight: "bold",
                     color: "#fff",
                     marginLeft: 8,
                   },
                   categoryText: {
                     backgroundColor: "#f3f4f6",
                     paddingHorizontal: 8,
                     paddingVertical: 2,
                     borderRadius: 4,
                     fontSize: 12,
                     marginLeft: 10,
                   },
                   categoryRatingRow: {
                     flexDirection: "row",
                     justifyContent: "flex-end",
                     marginBottom: 10,
                   },
                   ratingContainer: {
                     flexDirection: "row",
                     alignItems: "center",
                   },
                   ratingText: {
                     marginLeft: 4,
                     fontSize: 14,
                     fontWeight: "bold",
                   },
                   reviewsText: {
                     fontSize: 12,
                     color: "#666",
                     marginLeft: 2,
                   },
                   instructorContainer: {
                     flexDirection: "row",
                     alignItems: "center",
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
                     fontWeight: "500",
                   },
                   description: {
                     fontSize: 13,
                     color: "#555",
                     marginBottom: 10,
                     lineHeight: 18,
                   },
                   infoRow: {
                     flexDirection: "row",
                     justifyContent: "space-between",
                     marginBottom: 4,
                   },
                   infoItem: {
                     flexDirection: "row",
                     alignItems: "center",
                     marginRight: 8,
                   },
                   infoIcon: {
                     marginRight: 4,
                   },
                   infoText: {
                     fontSize: 12,
                     color: "#333",
                   },
                   participantIcon: {
                     marginRight: 2,
                   },
                   tagsContainer: {
                     flexDirection: "row",
                     flexWrap: "wrap",
                     marginBottom: 12,
                   },
                   tag: {
                     backgroundColor: "#e9f0ff",
                     paddingHorizontal: 8,
                     paddingVertical: 3,
                     borderRadius: 4,
                     marginRight: 6,
                     marginBottom: 6,
                   },
                   tagText: {
                     color: "#2563eb",
                     fontSize: 12,
                   },
                   cardButtons: {
                     flexDirection: "row",
                     justifyContent: "space-between",
                   },
                   viewDetailsButton: {
                     paddingVertical: 8,
                     paddingHorizontal: 12,
                     borderWidth: 1,
                     borderColor: "#2563eb",
                     borderRadius: 6,
                     flex: 1,
                     marginRight: 6,
                     alignItems: "center",
                   },
                   viewDetailsText: {
                     color: "#2563eb",
                     fontSize: 13,
                     fontWeight: "500",
                   },
                   bookButton: {
                     paddingVertical: 8,
                     paddingHorizontal: 12,
                     backgroundColor: "#2563eb",
                     borderRadius: 6,
                     flex: 1,
                     marginLeft: 6,
                     alignItems: "center",
                   },
                   bookText: {
                     color: "#fff",
                     fontSize: 13,
                     fontWeight: "500",
                   },
                 });