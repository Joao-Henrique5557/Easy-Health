import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { HomeScreen } from "@/screens/HomeScreen";
import { SearchScreen } from "@/screens/SearchScreen";
import { HistoryScreen } from "@/screens/HistoryScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import type { MainTabsParamList } from "./types";

// Correção: a versão anterior tinha 5 abas, incluindo "Primeiros Socorros"
// fixo na tab bar. O design final usa só 4 abas — Primeiros Socorros é
// acessado a partir da Home (tile "Serviços Integrados") e empilhado na
// stack raiz, não como aba.
const Tab = createBottomTabNavigator<MainTabsParamList>();

const ICONS: Record<keyof MainTabsParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  Search: "search",
  History: "clipboard",
  Profile: "person",
};

const ICONS_OUTLINE: Record<keyof MainTabsParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "home-outline",
  Search: "search-outline",
  History: "clipboard-outline",
  Profile: "person-outline",
};

const LABELS: Record<keyof MainTabsParamList, string> = {
  Home: "Início",
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
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: { borderTopColor: colors.line, height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontFamily: fonts.semiBold, fontSize: 10.5 },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? ICONS[route.name as keyof MainTabsParamList] : ICONS_OUTLINE[route.name as keyof MainTabsParamList]}
            size={20}
            color={color}
          />
        ),
        tabBarLabel: LABELS[route.name as keyof MainTabsParamList],
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
