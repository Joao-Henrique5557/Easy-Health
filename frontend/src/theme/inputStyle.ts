import { StyleProp, TextStyle } from "react-native";
import { colors } from "./colors";
import { fonts, radius } from "./typography";

export const inputStyle: StyleProp<TextStyle> = {
  borderWidth: 1,
  borderColor: colors.line,
  borderRadius: radius.md,
  paddingHorizontal: 14,
  paddingVertical: 13,
  fontFamily: fonts.regular,
  fontSize: 13.5,
  color: colors.ink,
  backgroundColor: colors.panel,
};
