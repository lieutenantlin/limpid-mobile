import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import { FontSize, Spacing } from "@/constants/theme";

interface Props {
  label?: string;
}

export default function LoadingSpinner({ label }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.light.tint} size="large" />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", padding: Spacing.xl },
  label: {
    marginTop: Spacing.md,
    color: Colors.light.textMuted,
    fontSize: FontSize.md,
  },
});
