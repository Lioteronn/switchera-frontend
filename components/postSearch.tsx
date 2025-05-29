import React, { useState } from "react";
            import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";
            import { Search, Sparkles, Users, ThumbsUp, Bookmark, Settings } from "lucide-react-native";
            import { BlurView } from "expo-blur";
            import PostFilter from "./postFilter";

            const categories = [
              { key: "Para ti", icon: Sparkles, label: "Para ti" },
              { key: "Seguidores", icon: Users, label: "Seguidores" },
              { key: "Recomendado", icon: ThumbsUp, label: "Recomendado" },
              { key: "Guardados", icon: Bookmark, label: "Guardados" },
            ];

            interface Props {
              searchTerm: string;
              setSearchTerm: (term: string) => void;
              activeCategory: string;
              setActiveCategory: (category: string) => void;
            }

            function FilterModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
              return (
                <Modal visible={visible} transparent animationType="fade">
                  <View style={StyleSheet.absoluteFill}>
                    <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Filtros</Text>
                      <PostFilter onFilter={() => {}}/>
                      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Cerrar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              );
            }

            export default function PostSearch({
              searchTerm,
              setSearchTerm,
              activeCategory,
              setActiveCategory,
            }: Props) {
              const [pressedCategory, setPressedCategory] = useState<string | null>(null);
              const [modalVisible, setModalVisible] = useState(false);

              return (
                <View style={styles.topSection}>
                  <Text style={styles.title}>Explora posts</Text>
                  <View style={styles.searchContainer}>
                    <Search size={16} color="#666" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity
                      style={styles.settingsBtn}
                      onPress={() => setModalVisible(true)}
                      activeOpacity={0.7}
                    >
                      <Settings size={18} color="#fff" />
                    </TouchableOpacity>
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
                            size={15}
                            color={activeCategory === key ? "#fff" : "#2563eb"}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                  <FilterModal visible={modalVisible} onClose={() => setModalVisible(false)} />
                </View>
              );
            }

            const styles = StyleSheet.create({
              topSection: {
                backgroundColor: "#fff",
                paddingHorizontal: 6,
                paddingVertical: 6,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              },
              title: {
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 6,
              },
              searchContainer: {
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f3f4f6",
                marginBottom: 6,
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 8,
              },
              searchIcon: {
                marginRight: 6,
              },
              searchInput: {
                flex: 1,
                fontSize: 13,
                paddingVertical: 2,
              },
              settingsBtn: {
                marginLeft: 6,
                backgroundColor: "#ef4444",
                borderRadius: 14,
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
              },
              categoriesContainer: {
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 0,
              },
              categoryButton: {
                flex: 1,
                paddingVertical: 5,
                marginHorizontal: 1,
                borderRadius: 8,
                backgroundColor: "#f3f4f6",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 28,
              },
              activeCategoryButton: {
                backgroundColor: "#2563eb",
              },
              categoryButtonText: {
                fontSize: 11,
                color: "#2563eb",
                fontWeight: "bold",
              },
              activeCategoryButtonText: {
                color: "#fff",
              },
              modalContent: {
                position: "absolute",
                top: "35%",
                alignSelf: "center",
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 14,
                width: "75%",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 8,
              },
              modalTitle: {
                fontWeight: "bold",
                fontSize: 15,
                marginBottom: 6,
              },
              closeBtn: {
                backgroundColor: "#ef4444",
                borderRadius: 5,
                paddingVertical: 6,
                paddingHorizontal: 16,
                marginTop: 4,
              },
            });