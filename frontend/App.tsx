import React, { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from "@expo-google-fonts/fraunces";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { colors } from "@/theme/colors";
import { RootNavigator } from "@/navigation/RootNavigator";
import { authService } from "@/services/authService";
import { notificationService } from "@/services/notificationService";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    authService.isAuthenticated().then((value) => {
      setIsAuthenticated(value);
      setCheckingSession(false);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      notificationService.registerForPushNotifications().catch(() => {});
    }
  }, [isAuthenticated]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !checkingSession) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, checkingSession]);

  if (!fontsLoaded || checkingSession) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <RootNavigator isAuthenticated={isAuthenticated} onAuthenticated={() => setIsAuthenticated(true)} />
      </NavigationContainer>
    </View>
  );
}
