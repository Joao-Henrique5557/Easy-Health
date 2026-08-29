import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { FirstAidDetailScreen } from "@/screens/FirstAidDetailScreen";
import { EmergencyScreen } from "@/screens/EmergencyScreen";
import { MainTabsNavigator } from "./MainTabsNavigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  isAuthenticated: boolean;
  onAuthenticated: () => void;
}

export function RootNavigator({ isAuthenticated, onAuthenticated }: RootNavigatorProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.ink,
        headerTitleStyle: { fontFamily: fonts.bodySemiBold, fontSize: 15 },
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {() => <LoginScreen onAuthenticated={onAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="Register" options={{ headerShown: false }}>
            {() => <RegisterScreen onAuthenticated={onAuthenticated} />}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="FirstAidDetail" component={FirstAidDetailScreen} options={{ title: "Primeiros Socorros" }} />
          <Stack.Screen
            name="Emergency"
            component={EmergencyScreen}
            options={{
              title: "Modo Emergência",
              headerStyle: { backgroundColor: colors.alert },
              headerTintColor: colors.white,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
