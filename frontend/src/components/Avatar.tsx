import React from "react";
import { Image, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface AvatarProps {
  uri?: string | null;
  size?: number;
  editable?: boolean;
  onPressEdit?: () => void;
}

export function Avatar({ uri, size = 44, editable, onPressEdit }: AvatarProps) {
  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.primarySoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="person" size={size * 0.5} color={colors.primary} />
        </View>
      )}
      {editable && (
        <Pressable
          onPress={onPressEdit}
          style={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: size * 0.34,
            height: size * 0.34,
            borderRadius: (size * 0.34) / 2,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: colors.white,
          }}
        >
          <Ionicons name="camera" size={size * 0.18} color={colors.white} />
        </Pressable>
      )}
    </View>
  );
}
