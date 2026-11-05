import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { fonts, radius } from "@/theme/typography";
import { subscribeToAppAlerts } from "@/services/appAlert";
const ToastContext = createContext(null);
export function ToastProvider({
  children
}) {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);
  const dismissToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setToast(null);
  }, []);
  const displayToast = useCallback((nextToast, duration) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(nextToast);
    timeoutRef.current = duration ? setTimeout(dismissToast, duration) : null;
  }, [dismissToast]);
  const showToast = useCallback((message, kind = "error") => {
    displayToast({
      message,
      kind
    }, 3500);
  }, [displayToast]);
  useEffect(() => subscribeToAppAlerts(event => {
    if (event.type === "dismiss") {
      setToast(current => current?.id === event.id ? null : current);
      return;
    }
    displayToast(event.alert, event.alert.buttons?.length ? null : 6000);
  }), [displayToast]);
  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);
  const value = useMemo(() => ({
    showToast
  }), [showToast]);
  return <ToastContext.Provider value={value}>
      {children}
      {toast && <View style={{
      position: "absolute",
      left: 16,
      right: 16,
      bottom: 24,
      pointerEvents: "box-none"
    }}>
          <View accessibilityRole="alert" style={{
        backgroundColor: toast.kind === "success" ? colors.primary : toast.kind === "info" ? colors.primaryDark : colors.ink,
        borderRadius: radius.md,
        padding: 14,
        gap: 8
      }}>
            <View style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 10
        }}>
              <View style={{
            flex: 1,
            gap: 4
          }}>
                {toast.title && <Text style={{
              color: colors.white,
              fontFamily: fonts.bold,
              fontSize: 14
            }}>{toast.title}</Text>}
                <Text accessibilityLiveRegion="polite" style={{
          color: colors.white,
          fontFamily: fonts.medium,
          fontSize: 13
        }}>{toast.message}</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Fechar mensagem" onPress={dismissToast}>
                <Text style={{
              color: colors.white,
              fontFamily: fonts.semiBold,
              fontSize: 12
            }}>Fechar</Text>
              </Pressable>
            </View>
            {toast.buttons?.length > 0 && <View style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 8
        }}>
                {toast.buttons.map((button, index) => <Pressable key={`${button.text}-${index}`} accessibilityRole="button" onPress={button.onPress} style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: radius.sm,
            backgroundColor: "rgba(255,255,255,0.16)"
          }}>
                    <Text style={{
              color: colors.white,
              fontFamily: fonts.semiBold,
              fontSize: 12
            }}>{button.text}</Text>
                  </Pressable>)}
              </View>}
          </View>
        </View>}
    </ToastContext.Provider>;
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return context;
}
