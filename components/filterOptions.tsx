import React, { useState } from "react";
         import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
         import { Switch, Button } from "@gluestack-ui/themed";
         import { Feather } from "@expo/vector-icons";

         type FilterKey =
           | "music"
           | "languages"
           | "programming"
           | "arts"
           | "cooking"
           | "beginner"
           | "intermediate"
           | "advanced"
           | "weekdays"
           | "weekends"
           | "evenings";

         export default function FilterOptions() {
           const [filters, setFilters] = useState<Record<FilterKey, boolean>>({
             music: false,
             languages: false,
             programming: false,
             arts: false,
             cooking: false,
             beginner: false,
             intermediate: false,
             advanced: false,
             weekdays: false,
             weekends: false,
             evenings: false,
           });
           const [open, setOpen] = useState(false);

           const handleSwitch = (key: FilterKey) => {
             setFilters({ ...filters, [key]: !filters[key] });
           };

           return (
             <>
               <TouchableOpacity style={styles.card} onPress={() => setOpen(true)}>
                 <View style={styles.header}>
                   <Text style={styles.cardTitle}>Filtros</Text>
                   <Feather name="chevron-down" size={20} color="#2563eb" />
                 </View>
               </TouchableOpacity>
               <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
                 <View style={styles.modalContainer}>
                   <View style={styles.modalHeader}>
                     <Text style={styles.cardTitle}>Filtros</Text>
                     <TouchableOpacity onPress={() => setOpen(false)}>
                       <Feather name="x" size={24} color="#22223b" />
                     </TouchableOpacity>
                   </View>
                   <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                     <View style={styles.section}>
                       <Text style={styles.sectionTitle}>Categorías</Text>
                       {[
                         { key: "music", label: "Música" },
                         { key: "languages", label: "Idiomas" },
                         { key: "programming", label: "Programación" },
                         { key: "arts", label: "Artes y Manualidades" },
                         { key: "cooking", label: "Cocina" },
                       ].map(({ key, label }) => (
                         <View key={key} style={styles.switchRow}>
                           <Switch value={filters[key as FilterKey]} onValueChange={() => handleSwitch(key as FilterKey)} />
                           <Text style={styles.switchLabel}>{label}</Text>
                         </View>
                       ))}
                     </View>
                     <View style={styles.section}>
                       <Text style={styles.sectionTitle}>Nivel</Text>
                       {[
                         { key: "beginner", label: "Principiante" },
                         { key: "intermediate", label: "Intermedio" },
                         { key: "advanced", label: "Avanzado" },
                       ].map(({ key, label }) => (
                         <View key={key} style={styles.switchRow}>
                           <Switch value={filters[key as FilterKey]} onValueChange={() => handleSwitch(key as FilterKey)} />
                           <Text style={styles.switchLabel}>{label}</Text>
                         </View>
                       ))}
                     </View>
                     <View style={styles.section}>
                       <Text style={styles.sectionTitle}>Disponibilidad</Text>
                       {[
                         { key: "weekdays", label: "Entre semana" },
                         { key: "weekends", label: "Fines de semana" },
                         { key: "evenings", label: "Noches" },
                       ].map(({ key, label }) => (
                         <View key={key} style={styles.switchRow}>
                           <Switch value={filters[key as FilterKey]} onValueChange={() => handleSwitch(key as FilterKey)} />
                           <Text style={styles.switchLabel}>{label}</Text>
                         </View>
                       ))}
                     </View>
                     <Button style={styles.filterBtn} onPress={() => setOpen(false)}>
                       <Feather name="filter" size={18} style={{ marginRight: 8 }} />
                       <Text style={styles.filterBtnText}>Aplicar filtros</Text>
                     </Button>
                   </ScrollView>
                 </View>
               </Modal>
             </>
           );
         }

         const styles = StyleSheet.create({
           card: {
             backgroundColor: "#fff",
             borderRadius: 12,
             padding: 0,
             marginBottom: 24,
             elevation: 2,
             shadowColor: "#000",
             shadowOpacity: 0.06,
             shadowRadius: 8,
             overflow: "hidden",
           },
           header: {
             flexDirection: "row",
             alignItems: "center",
             justifyContent: "space-between",
             padding: 16,
             borderBottomWidth: 1,
             borderBottomColor: "#f1f5f9",
           },
           cardTitle: {
             fontSize: 18,
             fontWeight: "bold",
             color: "#22223b",
           },
           modalContainer: {
             flex: 1,
             backgroundColor: "#fff",
             padding: 16,
           },
           modalHeader: {
             flexDirection: "row",
             alignItems: "center",
             justifyContent: "space-between",
             marginBottom: 16,
           },
           section: {
             marginBottom: 16,
           },
           sectionTitle: {
             fontSize: 14,
             fontWeight: "600",
             marginBottom: 8,
             color: "#4b5563",
           },
           switchRow: {
             flexDirection: "row",
             alignItems: "center",
             marginBottom: 8,
           },
           switchLabel: {
             marginLeft: 8,
             fontSize: 15,
             color: "#22223b",
           },
           filterBtn: {
             marginTop: 8,
             borderWidth: 1,
             borderColor: "#2563eb",
             backgroundColor: "#2563eb10",
             flexDirection: "row",
             alignItems: "center",
             alignSelf: "flex-start",
             paddingHorizontal: 16,
             paddingVertical: 8,
             borderRadius: 8,
           },
           filterBtnText: {
             color: "#2563eb",
             fontWeight: "bold",
             fontSize: 15,
           },
         });