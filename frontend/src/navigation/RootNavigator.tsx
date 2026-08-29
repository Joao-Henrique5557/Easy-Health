import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { ForgotPasswordScreen } from "@/screens/ForgotPasswordScreen";
import { FirstAidScreen } from "@/screens/FirstAidScreen";
import { FirstAidDetailScreen } from "@/screens/FirstAidDetailScreen";
import { EmergencyScreen } from "@/screens/EmergencyScreen";
import { EstablishmentDetailScreen } from "@/screens/EstablishmentDetailScreen";
import { BookingScreen } from "@/screens/BookingScreen";
import { BookingConfirmationScreen } from "@/screens/BookingConfirmationScreen";
import { ConsultationDetailScreen } from "@/screens/ConsultationDetailScreen";
import { NotificationsScreen } from "@/screens/NotificationsScreen";
import { FavoritesScreen } from "@/screens/FavoritesScreen";
import { EditProfileScreen } from "@/screens/EditProfileScreen";
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
        headerShown: false,
        headerTintColor: colors.ink,
        headerTitleStyle: { fontFamily: fonts.semiBold, fontSize: 15 },
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login">{() => <LoginScreen onAuthenticated={onAuthenticated} />}</Stack.Screen>
          <Stack.Screen name="Register">{() => <RegisterScreen onAuthenticated={onAuthenticated} />}</Stack.Screen>
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
          <Stack.Screen name="FirstAid" component={FirstAidScreen} />
          <Stack.Screen name="FirstAidDetail" component={FirstAidDetailScreen} />
          <Stack.Screen name="Emergency" component={EmergencyScreen} />
          <Stack.Screen name="EstablishmentDetail" component={EstablishmentDetailScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
          <Stack.Screen name="ConsultationDetail" component={ConsultationDetailScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
