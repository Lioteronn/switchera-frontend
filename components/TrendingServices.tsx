import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const trendingTopics = [
  { tag: "#guitar", posts: 68 },
  { tag: "#japanese", posts: 34 },
  { tag: "#react", posts: 95 },
  { tag: "#cooking", posts: 96 },
  { tag: "#drawing", posts: 63 },
];

const suggestedTeachers = [
  { name: "Sarah Lee", role: "Piano Teacher", avatar: "https://ui-avatars.com/api/?name=Sarah+Lee" },
  { name: "David Kim", role: "Korean Language", avatar: "https://ui-avatars.com/api/?name=David+Kim" },
  { name: "Maria Garcia", role: "Spanish Tutor", avatar: "https://ui-avatars.com/api/?name=Maria+Garcia" },
];

const popularServices = [
  { title: "Guitar Workshop", teacher: "Jane Smith", price: "$25/session" },
  { title: "Japanese Study Group", teacher: "Alex Johnson", price: "$20/session" },
  { title: "Web Dev Bootcamp", teacher: "Mark Wilson", price: "$35/session" },
];

export default function TrendingServices() {
  const router = useRouter();

  return (
    <ScrollView style={styles.sidebar} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Trending Topics */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Trending Topics</Text>
        {trendingTopics.map(topic => (
          <View key={topic.tag} style={styles.topicRow}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Text style={styles.topicTag}>{topic.tag}</Text>
              <Text style={styles.topicPosts}>{topic.posts} posts</Text>
            </View>
            <TouchableOpacity style={styles.addBtn}>
              <Feather name="plus" size={16} color="#2563eb" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Suggested Teachers */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suggested Teachers</Text>
        {suggestedTeachers.map(teacher => (
          <View key={teacher.name} style={styles.teacherRow}>
            <Image source={{ uri: teacher.avatar }} style={styles.teacherAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.teacherName}>{teacher.name}</Text>
              <Text style={styles.teacherRole}>{teacher.role}</Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Follow</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Popular Services */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Popular Services</Text>
        {popularServices.map(service => (
          <View key={service.title} style={styles.serviceRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceTeacher}>{service.teacher}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.servicePrice}>{service.price}</Text>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/services")}
        >
          <Text style={styles.viewAllBtnText}>View All Services</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#22223b",
  },
  // Trending Topics
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  topicTag: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: 15,
    marginRight: 8,
  },
  topicPosts: {
    color: "#6b7280",
    fontSize: 13,
  },
  addBtn: {
    backgroundColor: "#dbeafe",
    borderRadius: 16,
    padding: 4,
    marginLeft: 8,
  },
  // Suggested Teachers
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  teacherAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  teacherName: {
    fontWeight: "bold",
    color: "#22223b",
    fontSize: 15,
  },
  teacherRole: {
    color: "#6b7280",
    fontSize: 13,
  },
  followBtn: {
    backgroundColor: "#2563eb10",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  followBtnText: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: 14,
  },
  // Popular Services
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  serviceTitle: {
    fontWeight: "bold",
    color: "#22223b",
    fontSize: 15,
  },
  serviceTeacher: {
    color: "#6b7280",
    fontSize: 13,
  },
  servicePrice: {
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  viewBtn: {
    backgroundColor: "#2563eb10",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 2,
  },
  viewBtnText: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: 13,
  },
  viewAllBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#2563eb10",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewAllBtnText: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: 15,
  },
});