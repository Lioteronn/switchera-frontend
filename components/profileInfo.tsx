import React from "react";
        import { View, Text, StyleSheet, Image } from "react-native";
        import { Button, Badge } from "@gluestack-ui/themed";
        import { Feather, FontAwesome, AntDesign } from "@expo/vector-icons";

        interface ProfileInfoProps {
          name: string;
          description: string;
          avatarUrl: string;
          isPremium?: boolean;
          badges: { icon: keyof typeof Feather.glyphMap; label: string; color?: string }[];
          stats: { classesCompleted: number; classesTaken: number; averageRating: number };
          social?: {
            instagram?: string;
            youtube?: string;
            twitter?: string;
            linkedin?: string;
          };
        }

        export default function ProfileInfo({
          name,
          description,
          avatarUrl,
          isPremium = false,
          badges,
          stats,
          social,
        }: ProfileInfoProps) {
          return (
            <View style={styles.card}>
              <View style={styles.profileHeader}>
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                {isPremium && (
                  <Badge style={[styles.premiumBadge]}>
                    <Text style={{ color: "#fff" }}>Premium</Text>
                  </Badge>
                )}
              </View>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileDesc}>{description}</Text>
              <View style={styles.badgesRow}>
                {badges.map((b, i) => (
                  <Badge key={i} style={[styles.badge, b.color ? { backgroundColor: b.color } : {}]}>
                    <Feather name={b.icon} size={14} color="#2563eb" style={{ marginRight: 4 }} />
                    <Text style={styles.badgeText}>{b.label}</Text>
                  </Badge>
                ))}
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.statLabel}>Clases impartidas</Text>
                <Text style={styles.statValue}>{stats.classesCompleted}</Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.statLabel}>Clases tomadas</Text>
                <Text style={styles.statValue}>{stats.classesTaken}</Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.statLabel}>Calificación</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.statValue}>{stats.averageRating}</Text>
                  <AntDesign name="star" size={14} color="#facc15" style={{ marginLeft: 4 }} />
                </View>
              </View>
              <View style={styles.socialRow}>
                {social?.instagram && (
                  <Button style={styles.socialBtn}>
                    <FontAwesome name="instagram" size={18} color="#e1306c" />
                  </Button>
                )}
                {social?.youtube && (
                  <Button style={styles.socialBtn}>
                    <FontAwesome name="youtube" size={18} color="#ff0000" />
                  </Button>
                )}
                {social?.twitter && (
                  <Button style={styles.socialBtn}>
                    <Feather name="twitter" size={18} color="#60a5fa" />
                  </Button>
                )}
                {social?.linkedin && (
                  <Button style={styles.socialBtn}>
                    <Feather name="linkedin" size={18} color="#2563eb" />
                  </Button>
                )}
              </View>
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
          profileHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          },
          avatar: {
            width: 64,
            height: 64,
            borderRadius: 32,
            borderWidth: 3,
            borderColor: "#fff",
          },
          premiumBadge: {
            backgroundColor: "#2563eb",
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 2,
          },
          badgesRow: {
            flexDirection: "row",
            gap: 8,
            marginBottom: 12,
          },
          badge: {
            backgroundColor: "#e0e7ff",
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 3,
            marginRight: 6,
          },
          badgeText: {
            color: "#2563eb",
            fontWeight: "600",
            fontSize: 13,
          },
          profileName: {
            fontSize: 17,
            fontWeight: "bold",
            marginTop: 4,
            color: "#22223b",
          },
          profileDesc: {
            fontSize: 13,
            color: "#6b7280",
            marginBottom: 10,
          },
          statsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          },
          statLabel: {
            color: "#6b7280",
            fontSize: 13,
          },
          statValue: {
            fontWeight: "bold",
            fontSize: 13,
            color: "#22223b",
          },
          socialRow: {
            flexDirection: "row",
            justifyContent: "center",
            gap: 12,
            marginTop: 10,
          },
          socialBtn: {
            borderRadius: 20,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 2,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#e5e7eb",
          },
        });