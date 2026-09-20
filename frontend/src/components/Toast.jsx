import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { fonts, radius } from "@/theme/typography";
const ToastContext = createContext(null);
export function ToastProvider({
  children
}) {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, kind = "error") => {
    setToast({
      message,
      kind
    });
    setTimeout(() => setToast(null), 3500);
  }, []);
  const value = useMemo(() => ({
    showToast
  }), [showToast]);
  return <ToastContext.Provider value={value}>
      {children}
      {toast && <View pointerEvents="box-none" style={{
      position: "absolute",
      left: 16,
      right: 16,
      bottom: 24
    }}>
          <Pressable onPress={() => setToast(null)} style={{
        backgroundColor: toast.kind === "success" ? colors.primary : colors.ink,
        borderRadius: radius.md,
        padding: 14
      }}>
            <Text style={{
          color: colors.white,
          fontFamily: fonts.medium,
          fontSize: 13
        }}>{toast.message}</Text>
          </Pressable>
        </View>}
    </ToastContext.Provider>;
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return context;
}
