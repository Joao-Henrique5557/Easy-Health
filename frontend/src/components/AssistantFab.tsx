import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

export function AssistantFab({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Abrir assistente de IA"
      style={({ pressed }) => ({
        position: "absolute",
        right: 18,
        bottom: 24,
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
        shadowColor: colors.primaryDark,
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <Ionicons name="chatbubble-ellipses" size={24} color={colors.white} />
    </Pressable>
  );
}
