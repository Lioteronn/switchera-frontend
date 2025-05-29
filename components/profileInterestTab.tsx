import React, { useState, useRef } from "react";
        import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Animated } from "react-native";
        import { Button } from "@gluestack-ui/themed";
        import { Feather } from "@expo/vector-icons";

type Service = {
  title: string;
  price: string;
  description: string;
  level: string;
  duration: string;
  category: string;
  rating?: string;
};

const teachingServices: Service[] = [
  {
    title: "Clases de Guitarra",
    price: "20€",
    description: "Aprende guitarra desde cero o mejora tu técnica.",
    level: "Principiante-Intermedio",
    duration: "60 min",
    category: "Música",
    rating: "4.8",
  },
  {
    title: "Teoría Musical",
    price: "15€",
    description: "Fundamentos de teoría musical para todos los niveles.",
    level: "Todos",
    duration: "45 min",
    category: "Música",
    rating: "4.7",
  },
];

const learningServices: Service[] = [
  {
    title: "JavaScript Básico",
    price: "Gratis",
    description: "Quiero aprender los fundamentos de JavaScript.",
    level: "Principiante",
    duration: "60 min",
    category: "Programación",
  },
  {
    title: "React para Principiantes",
    price: "Gratis",
    description: "Busco clases introductorias de React.",
    level: "Principiante",
    duration: "60 min",
    category: "Programación",
  },
];
        export default function ProfileInterestTab() {
          const [panel, setPanel] = useState<"select" | "teaching" | "learning">("select");
          const fadeAnim = useRef(new Animated.Value(0)).current;

          const showPanel = (type: "teaching" | "learning") => {
            setPanel(type);
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
          };

          const goBack = () => setPanel("select");

          return (
            <View style={styles.container}>
              {panel === "select" && (
                <View style={styles.selectPanel}>
                  <TouchableOpacity style={styles.iconBox} onPress={() => showPanel("teaching")}>
                    <Feather name="book-open" size={64} color="#2563eb" />
                    <Text style={styles.iconLabel}>Teaching</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBox} onPress={() => showPanel("learning")}>
                    <Feather name="book" size={64} color="#dc2626" />
                    <Text style={styles.iconLabel}>Learning</Text>
                  </TouchableOpacity>
                </View>
              )}
              {panel === "teaching" && (
                <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                  <View style={styles.header}>
                    <TouchableOpacity onPress={goBack}>
                      <Feather name="x" size={32} color="#222" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Skills I'm Teaching</Text>
                  </View>
                  <ScrollView style={styles.scroll}>
                    {teachingServices.map((s, i) => (
                      <View key={i} style={styles.card}>
                        <Text style={styles.cardTitle}>{s.title}</Text>
                        <Text style={styles.cardPrice}>{s.price}</Text>
                        <Text style={styles.cardDesc}>{s.description}</Text>
                        <View style={styles.cardRow}>
                          <Text style={styles.cardTag}>{s.level}</Text>
                          <Text style={styles.cardTag}>{s.duration}</Text>
                          <Text style={styles.cardTag}>{s.category}</Text>
                        </View>
                        <Text style={styles.cardRating}>{s.rating}</Text>
                        <Button style={styles.button}>View Service</Button>
                      </View>
                    ))}
                    <Button style={styles.button}>Create New Course</Button>
                  </ScrollView>
                </Animated.View>
              )}
              {panel === "learning" && (
                <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                  <View style={styles.header}>
                    <TouchableOpacity onPress={goBack}>
                      <Feather name="x" size={32} color="#222" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Skills I Want to Learn</Text>
                  </View>
                  <ScrollView style={styles.scroll}>
                    {learningServices.map((s, i) => (
                      <View key={i} style={styles.card}>
                        <Text style={styles.cardTitle}>{s.title}</Text>
                        <Text style={styles.cardPrice}>{s.price}</Text>
                        <Text style={styles.cardDesc}>{s.description}</Text>
                        <View style={styles.cardRow}>
                          <Text style={styles.cardTag}>{s.level}</Text>
                          <Text style={styles.cardTag}>{s.duration}</Text>
                          <Text style={styles.cardTag}>{s.category}</Text>
                        </View>
                        <Button style={styles.button}>Find Teachers</Button>
                      </View>
                    ))}
                    <Button style={styles.button}>Add Learning Interest</Button>
                  </ScrollView>
                </Animated.View>
              )}
            </View>
          );
        }

        const styles = StyleSheet.create({
          container: { flex: 1, padding: 24, backgroundColor: "#fff" },
          selectPanel: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 48, flex: 1 },
          iconBox: { alignItems: "center", justifyContent: "center", padding: 32, borderRadius: 16, backgroundColor: "#f1f5f9", elevation: 2 },
          iconLabel: { fontSize: 20, fontWeight: "bold", marginTop: 12, color: "#22223b" },
          header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
          headerTitle: { fontSize: 22, fontWeight: "bold", marginLeft: 12, color: "#22223b" },
          scroll: { flex: 1, maxHeight: 700, minHeight: 400 },
          card: { backgroundColor: "#f1f5f9", borderRadius: 14, padding: 18, marginBottom: 18, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
          cardTitle: { fontSize: 18, fontWeight: "bold", color: "#22223b", marginBottom: 2 },
          cardPrice: { fontSize: 15, color: "#2563eb", fontWeight: "bold", marginBottom: 4 },
          cardDesc: { fontSize: 14, color: "#374151", marginBottom: 8 },
          cardRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
          cardTag: { fontSize: 13, color: "#64748b", backgroundColor: "#e0e7ef", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 4 },
          cardRating: { fontSize: 13, color: "#f59e42", marginBottom: 6 },
          button: { marginTop: 8, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: "#2563eb" },
        });