import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Colors from "@/constants/colors";
import { Radius, Spacing, FontSize, FontWeight } from "@/constants/theme";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  icon,
  style,
  testID,
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.light.surface} />
      ) : (
        <View style={styles.row}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text style={styles.label}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { marginRight: 2 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.4 },
  label: {
    color: Colors.light.surface,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.2,
  },
});
