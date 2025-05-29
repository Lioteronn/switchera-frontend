import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface PostCardProps {
  user: {
    name: string;
    role: string;
    time: string;
  };
  content: string;
  hashtags: string[];
  serviceTitle: string;
  price: string;
  onViewService?: () => void;
  likes: number;
  comments: number;
  saves: number;
  liked?: boolean;
  saved?: boolean;
  onLike?: () => void;
  onSave?: () => void;
  onComment?: () => void;
}

export default function PostCard({
                                   user,
                                   content,
                                   hashtags,
                                   serviceTitle,
                                   price,
                                   onViewService,
                                   likes,
                                   comments,
                                   saves,
                                   liked,
                                   saved,
                                   onLike,
                                   onSave,
                                   onComment,
                                 }: PostCardProps) {
  return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>• {user.role} • {user.time}</Text>
        </View>
        <Text style={styles.content}>{content}</Text>
        <View style={styles.hashtags}>
          {hashtags.map((tag, i) => (
              <Text key={i} style={styles.hashtag}>#{tag} </Text>
          ))}
        </View>
        <View style={styles.serviceBox}>
          <Text style={styles.serviceTitle}>{serviceTitle}</Text>
          <Text style={styles.price}>{price}</Text>
          <TouchableOpacity style={styles.viewServiceBtn} onPress={onViewService}>
            <Text style={styles.viewServiceText}>View Service</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statsLeft}>
            <TouchableOpacity onPress={onLike}>
              <Feather
                  name="thumbs-up"
                  size={18}
                  color={liked ? "#2563eb" : "#64748b"}
                  style={styles.icon}
              />
            </TouchableOpacity>
            <Text style={styles.statText}>{likes}</Text>
            <TouchableOpacity onPress={onComment}>
              <Feather
                  name="message-circle"
                  size={18}
                  color="#64748b"
                  style={[styles.icon, { marginLeft: 16 }]}
              />
            </TouchableOpacity>
            <Text style={styles.statText}>{comments}</Text>
            <Feather
                name="bookmark"
                size={18}
                color="#64748b"
                style={[styles.icon, { marginLeft: 16 }]}
            />
            <Text style={styles.statText}>{saves}</Text>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Feather
                name="bookmark"
                size={22}
                color={saved ? "#2563eb" : "#64748b"}
                solid={saved}
            />
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 15,
    marginRight: 6,
  },
  userRole: {
    color: "#6b7280",
    fontSize: 13,
  },
  content: {
    fontSize: 15,
    marginVertical: 8,
    color: "#22223b",
  },
  hashtags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  hashtag: {
    color: "#2563eb",
    marginRight: 4,
    fontSize: 13,
  },
  serviceBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  serviceTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  price: {
    color: "#2563eb",
    fontWeight: "bold",
    marginBottom: 4,
  },
  viewServiceBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: "center",
  },
  viewServiceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 4,
  },
  statText: {
    fontSize: 13,
    color: "#64748b",
  },
  saveBtn: {
    padding: 6,
    borderRadius: 20,
  },
});