import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

/**
 * Layout for authentication screens
 * Provides a simple stack-based navigation for login, register, and password reset screens
 */
export default function AuthLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      />
    </View>
  );
}

