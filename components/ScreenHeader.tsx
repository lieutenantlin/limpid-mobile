import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import { FontSize, FontWeight, Spacing } from "@/constants/theme";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export default function ScreenHeader({ eyebrow, title, subtitle, right }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.textCol}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  textCol: { flex: 1 },
  eyebrow: {
    fontSize: FontSize.xs,
    color: Colors.light.tint,
    fontWeight: FontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    marginBottom: 6,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    color: Colors.light.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.light.textMuted,
    marginTop: 6,
    lineHeight: 22,
  },
  right: { alignItems: "flex-end" },
});
