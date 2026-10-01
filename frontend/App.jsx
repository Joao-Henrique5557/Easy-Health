import React, { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from "@expo-google-fonts/inter";
import { colors } from "@/theme/colors";
import { RootNavigator } from "@/navigation/RootNavigator";
import { authService } from "@/services/authService";
import { tokenStorage } from "@/services/tokenStorage";
import { notificationService } from "@/services/notificationService";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/Toast";
SplashScreen.preventAutoHideAsync().catch(() => {});
export default function App() {
  // Correção: a versão anterior carregava Fraunces (serifada), que não
  // existe no design real. O design usa só uma sans-serif (Inter) em
  // vários pesos, então é só isso que carregamos agora.
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  useEffect(() => {
    let mounted = true;
    async function restoreSession() {
      try {
        await tokenStorage.init();
        const value = await authService.isAuthenticated();
        if (mounted) setIsAuthenticated(value);
      } catch (error) {
        console.error("Não foi possível restaurar a sessão.", error);
      } finally {
        if (mounted) setCheckingSession(false);
      }
    }
    restoreSession();
    return () => {
      mounted = false;
    };
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
    return <View style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bg
    }}>
        <ActivityIndicator color={colors.primary} />
      </View>;
  }
  return <View style={{
    flex: 1
  }} onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <ErrorBoundary>
        <ToastProvider>
          <NavigationContainer>
            <RootNavigator isAuthenticated={isAuthenticated} isGuest={isGuest} onAuthenticated={() => {
            setIsAuthenticated(true);
            setIsGuest(false);
          }} onGuest={() => setIsGuest(true)} />
          </NavigationContainer>
        </ToastProvider>
      </ErrorBoundary>
    </View>;
}
