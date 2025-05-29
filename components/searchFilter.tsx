import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
                          import { Search, Layers, GraduationCap, BookOpen, Bookmark } from "lucide-react-native";
                          import React, { useState } from "react";

                          const categories = [
                            { key: "All", icon: Layers, label: "All" },
                            { key: "Teaching", icon: GraduationCap, label: "Teaching" },
                            { key: "Learning", icon: BookOpen, label: "Learning" },
                            { key: "Saved", icon: Bookmark, label: "Saved" },
                          ];

                          interface Props {
                            searchTerm: string;
                            setSearchTerm: (term: string) => void;
                            activeCategory: string;
                            setActiveCategory: (category: string) => void;
                          }

                          export default function SearchFilter({
                            searchTerm,
                            setSearchTerm,
                            activeCategory,
                            setActiveCategory,
                          }: Props) {
                            const [pressedCategory, setPressedCategory] = useState<string | null>(null);

                            return (
                              <View style={styles.topSection}>
                                <Text style={styles.title}>Servicios disponibles</Text>
                                <View style={styles.searchContainer}>
                                  <Search size={18} color="#666" style={styles.searchIcon} />
                                  <TextInput
                                    style={styles.searchInput}
                                    placeholder="Buscar servicios, habilidades o instructores..."
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                  />
                                </View>
                                <View style={styles.categoriesContainer}>
                                  {categories.map(({ key, icon: Icon, label }) => (
                                    <TouchableOpacity
                                      key={key}
                                      style={[
                                        styles.categoryButton,
                                        activeCategory === key && styles.activeCategoryButton,
                                      ]}
                                      onPress={() => setActiveCategory(key)}
                                      onPressIn={() => setPressedCategory(key)}
                                      onPressOut={() => setPressedCategory(null)}
                                      activeOpacity={0.7}
                                    >
                                      {pressedCategory === key || activeCategory === key ? (
                                        <Text
                                          style={[
                                            styles.categoryButtonText,
                                            activeCategory === key && styles.activeCategoryButtonText,
                                          ]}
                                        >
                                          {label}
                                        </Text>
                                      ) : (
                                        <Icon
                                          size={18}
                                          color={activeCategory === key ? "#fff" : "#2563eb"}
                                        />
                                      )}
                                    </TouchableOpacity>
                                  ))}
                                </View>
                              </View>
                            );
                          }

                          const styles = StyleSheet.create({
                            topSection: {
                              backgroundColor: "#fff",
                              paddingHorizontal: 10,
                              paddingVertical: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: "#eee",
                            },
                            title: {
                              fontSize: 20,
                              fontWeight: "bold",
                              marginBottom: 10,
                            },
                            searchContainer: {
                              flexDirection: "row",
                              alignItems: "center",
                              backgroundColor: "#f3f4f6",
                              marginBottom: 10,
                              paddingHorizontal: 10,
                              paddingVertical: 7,
                              borderRadius: 8,
                            },
                            searchIcon: {
                              marginRight: 8,
                            },
                            searchInput: {
                              flex: 1,
                              fontSize: 15,
                            },
                            categoriesContainer: {
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginTop: 2,
                            },
                            categoryButton: {
                              flex: 1,
                              paddingVertical: 7,
                              marginHorizontal: 2,
                              borderRadius: 8,
                              backgroundColor: "#f3f4f6",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 36,
                            },
                            activeCategoryButton: {
                              backgroundColor: "#2563eb",
                            },
                            categoryButtonText: {
                              fontSize: 13,
                              color: "#2563eb",
                              fontWeight: "bold",
                            },
                            activeCategoryButtonText: {
                              color: "#fff",
                            },
                          });