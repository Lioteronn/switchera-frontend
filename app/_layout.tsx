import "@/global.css";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import AuthWrapper from "@/components/AuthWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { SavedPostsProvider } from "@/context/SavedPostsContext"; // Import SavedPostsProvider

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SavedPostsProvider> {/* Wrap with SavedPostsProvider */}
        <AuthWrapper>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthWrapper>
      </SavedPostsProvider>
    </AuthProvider>
  );
}