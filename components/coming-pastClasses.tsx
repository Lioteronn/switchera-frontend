import React, { useState } from "react";
      import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

      export default function ComingPastClasses() {
        const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">("upcoming");

        const upcoming = {
          title: "Guitar Basics: Lesson 1",
          date: "Mañana, 3:00 PM",
          student: "Student Name",
          level: "Beginner",
        };

        const past = {
          title: "Guitar Basics: Lesson 1",
          date: "Hace 1 día",
          student: "Student 1",
          level: "Beginner",
          comment: "¡Gran clase! Aprendí mucho sobre progresiones de acordes.",
          rating: 5,
        };

        return (
          <View style={styles.card}>
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabButton, selectedTab === "upcoming" && styles.tabButtonActive]}
                onPress={() => setSelectedTab("upcoming")}
              >
                <Text style={[styles.tabText, selectedTab === "upcoming" && styles.tabTextActive]}>
                  Próximas Clases
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, selectedTab === "past" && styles.tabButtonActive]}
                onPress={() => setSelectedTab("past")}
              >
                <Text style={[styles.tabText, selectedTab === "past" && styles.tabTextActive]}>
                  Clases Pasadas
                </Text>
              </TouchableOpacity>
            </View>

            {selectedTab === "upcoming" && (
              <View style={styles.classBox}>
                <Text style={styles.classTitle}>{upcoming.title}</Text>
                <Text style={styles.classDate}>{upcoming.date}</Text>
                <Text style={styles.label}>Estudiante</Text>
                <Text style={styles.value}>{upcoming.student}</Text>
                <Text style={styles.level}>{upcoming.level}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Reprogramar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonPrimary}>
                    <Text style={styles.buttonPrimaryText}>Entrar a la sala</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedTab === "past" && (
              <View style={styles.classBox}>
                <Text style={styles.classTitle}>{past.title}</Text>
                <Text style={styles.classDate}>{past.date}</Text>
                <Text style={styles.label}>Estudiante</Text>
                <Text style={styles.value}>{past.student}</Text>
                <Text style={styles.level}>{past.level}</Text>
                <View style={styles.ratingRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Text key={i} style={{ color: i < past.rating ? "#facc15" : "#e5e7eb", fontSize: 18 }}>★</Text>
                  ))}
                </View>
                <Text style={styles.comment}>"{past.comment}"</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Ver notas</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonPrimary}>
                    <Text style={styles.buttonPrimaryText}>Agendar seguimiento</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );
      }

      const styles = StyleSheet.create({
        card: {
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          elevation: 2,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabRow: {
          flexDirection: "row",
          marginBottom: 16,
          borderRadius: 8,
          backgroundColor: "#f1f5f9",
          overflow: "hidden",
        },
        tabButton: {
          flex: 1,
          paddingVertical: 10,
          alignItems: "center",
        },
        tabButtonActive: {
          backgroundColor: "#2563eb",
        },
        tabText: {
          color: "#22223b",
          fontWeight: "bold",
          fontSize: 15,
        },
        tabTextActive: {
          color: "#fff",
        },
        classBox: {
          backgroundColor: "#f8fafc",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        },
        classTitle: {
          fontSize: 15,
          fontWeight: "bold",
          color: "#22223b",
          marginBottom: 2,
        },
        classDate: {
          fontSize: 13,
          color: "#2563eb",
          marginBottom: 8,
        },
        label: {
          fontSize: 12,
          color: "#6b7280",
          marginTop: 4,
        },
        value: {
          fontSize: 14,
          color: "#22223b",
          marginBottom: 2,
        },
        level: {
          fontSize: 12,
          color: "#2563eb",
          fontWeight: "bold",
          marginBottom: 8,
        },
        buttonRow: {
          flexDirection: "row",
          gap: 8,
          marginTop: 8,
        },
        button: {
          backgroundColor: "#e5e7eb",
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 14,
          marginRight: 8,
        },
        buttonText: {
          color: "#22223b",
          fontWeight: "bold",
          fontSize: 13,
        },
        buttonPrimary: {
          backgroundColor: "#2563eb",
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 14,
        },
        buttonPrimaryText: {
          color: "#fff",
          fontWeight: "bold",
          fontSize: 13,
        },
        ratingRow: {
          flexDirection: "row",
          marginBottom: 4,
          marginTop: 2,
        },
        comment: {
          fontStyle: "italic",
          color: "#6b7280",
          fontSize: 13,
          marginBottom: 6,
        },
      });