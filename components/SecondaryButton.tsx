import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Colors from "@/constants/colors";
import { Radius, Spacing, FontSize, FontWeight } from "@/constants/theme";

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export default function SecondaryButton({
  title,
  onPress,
  disabled,
  icon,
  style,
  testID,
}: Props) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.row}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={styles.label}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { marginRight: 2 },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.4 },
  label: {
    color: Colors.light.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
