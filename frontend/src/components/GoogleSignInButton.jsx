import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { authService } from "@/services/authService";
import { getApiErrorMessage } from "@/utils/apiError";
import { useToast } from "@/components/Toast";

WebBrowser.maybeCompleteAuthSession();

const PLACEHOLDER_CLIENT_ID = "google-client-not-configured.apps.googleusercontent.com";

export function GoogleSignInButton({
  onAuthenticated,
  disabled = false
}) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const handledResponse = useRef(null);
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const configured = Boolean(webClientId || androidClientId || iosClientId);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: webClientId || PLACEHOLDER_CLIENT_ID,
    androidClientId: androidClientId || PLACEHOLDER_CLIENT_ID,
    iosClientId: iosClientId || PLACEHOLDER_CLIENT_ID,
    selectAccount: true,
    language: "pt-BR"
  });

  useEffect(() => {
    let active = true;
    async function finishGoogleSignIn() {
      if (response?.type === "error") {
        showToast(response.error?.message || "Não foi possível autenticar com o Google.");
        return;
      }
      if (response?.type !== "success") return;
      if (handledResponse.current === response) return;
      handledResponse.current = response;
      const idToken = response.authentication?.idToken || response.params?.id_token;
      if (!idToken) {
        showToast("O Google não retornou um token de identidade. Tente novamente.");
        return;
      }
      setLoading(true);
      try {
        await authService.loginWithGoogle(idToken);
        onAuthenticated();
      } catch (error) {
        showToast(getApiErrorMessage(error, "Não foi possível entrar com o Google."));
      } finally {
        if (active) setLoading(false);
      }
    }
    finishGoogleSignIn();
    return () => {
      active = false;
    };
  }, [response, onAuthenticated, showToast]);

  async function handlePress() {
    if (!configured) {
      showToast("O login Google ainda precisa ser configurado para este ambiente.");
      return;
    }
    if (!request || loading || disabled) return;
    try {
      await promptAsync();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Não foi possível abrir o login Google."));
    }
  }

  return <Pressable
    accessibilityRole="button"
    disabled={disabled || loading}
    onPress={handlePress}
    style={({ pressed }) => ({
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderColor: "#D1D5DB",
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      marginBottom: 12,
      opacity: pressed || disabled || loading ? 0.7 : 1,
      padding: 14
    })}
  >
    {loading ? <ActivityIndicator color="#4285F4" /> : <Text style={{
      color: "#4285F4",
      fontFamily: "Inter_700Bold",
      fontSize: 16
    }}>G</Text>}
    <Text style={{
      color: "#374151",
      fontFamily: "Inter_600SemiBold",
      fontSize: 14
    }}>{loading ? "Conectando..." : "Continuar com Google"}</Text>
  </Pressable>;
}
