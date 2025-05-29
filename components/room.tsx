import React from "react";
import { View, StyleSheet } from "react-native";
import ProfileViewRoom from "@/components/profileViewRoom";

export default function RoomScreen() {
  return (
    <View style={styles.container}>
      <ProfileViewRoom />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
});