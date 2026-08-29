// Paleta extraída diretamente do design (Figma) fornecido pelo usuário.
export const colors = {
  bg: "#F4F6F5",
  panel: "#FFFFFF",
  ink: "#111827",
  inkSoft: "#6B7280",
  inkFaint: "#9CA3AF",
  primary: "#059669",
  primaryDark: "#047857",
  primarySoft: "#EAFAF1",
  alert: "#EF4444",
  alertSoft: "#FEE2E2",
  alertDark: "#B91C1C",
  line: "#E5E7EB",
  white: "#FFFFFF",
  black: "#000000",
  // Tema escuro exclusivo da tela de Modo Emergência.
  emergencyBg: "#1E0A0A",
  emergencyCard: "#2D1A1A",
  emergencyLine: "rgba(255,255,255,0.08)",
  emergencyTextSoft: "rgba(255,255,255,0.55)",
} as const;

export type ColorToken = keyof typeof colors;
