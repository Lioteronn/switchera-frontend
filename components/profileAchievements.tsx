import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Badge, Progress, Button } from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Achievement {
  label: string;
  color: string;
  description: string;
  value: string;
  progress: number;
  textColor?: string;
}

interface AchievementsProps {
  achievements: Achievement[];
  onViewAll?: () => void;
}

export default function Achievements({ achievements, onViewAll }: AchievementsProps) {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <MaterialCommunityIcons name="trophy-award" size={22} color="#2563eb" style={{ marginRight: 8 }} />
        <Text style={styles.cardTitle}>Logros</Text>
      </View>
      {achievements.map((ach, idx) => (
        <View key={ach.label} style={styles.achievementRow}>
          <Badge style={[styles.badge, { backgroundColor: ach.color, marginRight: 8 }]}>
            <Text style={{ color: ach.textColor || "#fff" }}>{ach.label}</Text>
          </Badge>
          <Text style={{ flex: 1 }}>{ach.description}</Text>
          <Text style={{ fontWeight: "bold" }}>{ach.value}</Text>
          <Progress value={ach.progress} style={{ marginBottom: 12, flex: 1 }} />
        </View>
      ))}
      <Button style={styles.viewAllBtn} onPress={onViewAll}>
        <Text>Ver todos los logros</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#22223b",
  },
  achievementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  viewAllBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});