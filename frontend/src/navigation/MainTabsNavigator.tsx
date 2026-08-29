import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { HomeScreen } from "@/screens/HomeScreen";
import { FirstAidScreen } from "@/screens/FirstAidScreen";
import { SearchScreen } from "@/screens/SearchScreen";
import { HistoryScreen } from "@/screens/HistoryScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import type { MainTabsParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabsParamList>();

const ICONS: Record<keyof MainTabsParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  FirstAid: "heart",
  Search: "search",
  History: "time",
  Profile: "person",
};

const LABELS: Record<keyof MainTabsParamList, string> = {
  Home: "Início",
  FirstAid: "Socorros",
  Search: "Buscar",
  History: "Histórico",
  Profile: "Perfil",
};

export function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: { borderTopColor: colors.line, height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontFamily: fonts.bodySemiBold, fontSize: 10.5 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name as keyof MainTabsParamList]} size={size ?? 19} color={color} />
        ),
        tabBarLabel: LABELS[route.name as keyof MainTabsParamList],
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="FirstAid" component={FirstAidScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
