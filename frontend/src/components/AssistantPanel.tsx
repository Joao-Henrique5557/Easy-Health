import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { isEmergencyText } from "@/data/emergencyKeywords";
import { assistantService, AssistantMessage } from "@/services/assistantService";
import type { AssistantScreen } from "@/services/assistantService";

interface AssistantPanelProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: Exclude<AssistantScreen, null>) => void;
}

export function AssistantPanel({ visible, onClose, onNavigate }: AssistantPanelProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: "assistant",
      content:
        "Oi! Eu sou o assistente do Easy Health. Posso te levar até qualquer parte do app — é só me dizer o que você precisa. 💚",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: AssistantMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    // Caminho crítico: checagem local de emergência, sem depender de rede/IA.
    // Isso garante que o usuário chegue à tela de emergência mesmo offline
    // ou se o backend/IA estiver fora do ar.
    if (isEmergencyText(text)) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Isso soa como uma emergência. Te levei para a tela de emergência: ligue agora para o 192 (SAMU) — você mesmo(a) faz a ligação tocando no número.",
        },
      ]);
      onNavigate("emergencia");
      return;
    }

    setLoading(true);
    try {
      const history = messages.slice(-6);
      const result = await assistantService.sendMessage(text, history);
      setMessages((prev) => [...prev, { role: "assistant", content: result.reply }]);
      if (result.screen) onNavigate(result.screen);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Não consegui processar agora. Você pode tentar de novo, ou usar o menu abaixo para navegar diretamente.",
        },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(10,25,22,0.4)", justifyContent: "flex-end" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ maxHeight: "80%", backgroundColor: colors.panel, borderTopLeftRadius: 22, borderTopRightRadius: 22 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
            }}
          >
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: colors.primarySoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="sparkles" size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink }}>
                Assistente Easy Health
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkSoft }}>
                Guia o app • não substitui atendimento médico
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={20} color={colors.inkSoft} />
            </Pressable>
          </View>

          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={{ padding: 14, gap: 10 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={{ alignItems: item.role === "user" ? "flex-end" : "flex-start" }}>
                <View
                  style={{
                    maxWidth: "80%",
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                    borderRadius: 14,
                    backgroundColor: item.role === "user" ? colors.primary : colors.primarySoft,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 12.5,
                      lineHeight: 18,
                      color: item.role === "user" ? colors.white : colors.ink,
                    }}
                  >
                    {item.content}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={
              loading ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <ActivityIndicator size="small" color={colors.inkSoft} />
                  <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft }}>
                    Pensando...
                  </Text>
                </View>
              ) : null
            }
          />

          <View
            style={{
              flexDirection: "row",
              gap: 8,
              padding: 12,
              borderTopWidth: 1,
              borderTopColor: colors.line,
            }}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ex: quero achar uma clínica perto de mim"
              placeholderTextColor={colors.inkSoft}
              onSubmitEditing={handleSend}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontFamily: fonts.regular,
                fontSize: 12.5,
                color: colors.ink,
              }}
            />
            <Pressable
              onPress={handleSend}
              disabled={loading}
              style={{
                width: 40,
                borderRadius: 12,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Ionicons name="send" size={16} color={colors.white} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
