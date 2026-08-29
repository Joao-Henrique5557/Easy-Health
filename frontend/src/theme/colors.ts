export const colors = {
  bg: "#F5FAF8",
  panel: "#FFFFFF",
  ink: "#173430",
  inkSoft: "#5C726D",
  primary: "#146B63",
  primaryDark: "#0E4C46",
  primarySoft: "#E3F1EE",
  alert: "#E4572E",
  alertSoft: "#FDEAE3",
  alertDark: "#9C3A1C",
  line: "#E4ECE9",
  white: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof colors;
