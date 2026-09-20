import React from "react";
import { Button, Text, View } from "react-native";
import { colors } from "@/theme/colors";
export class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  };
  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }
  componentDidCatch(error) {
    console.error("[ErrorBoundary]", error);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <View style={{
      flex: 1,
      backgroundColor: colors.bg,
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }}>
        <Text style={{
        color: colors.ink,
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8
      }}>Ops, algo deu errado.</Text>
        <Text style={{
        color: colors.inkSoft,
        textAlign: "center",
        marginBottom: 16
      }}>Tente recarregar o app para continuar.</Text>
        <Button title="Tentar novamente" onPress={() => this.setState({
        hasError: false
      })} color={colors.primary} />
      </View>;
  }
}
