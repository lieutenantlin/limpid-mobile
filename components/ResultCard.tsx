import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Droplets } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Radius, Spacing, FontSize, FontWeight } from "@/constants/theme";
import { MicroplasticUnit } from "@/types";

interface Props {
  estimate: number;
  unit: MicroplasticUnit;
  confidence: number;
  modelVersion?: string;
}

function levelForEstimate(v: number): { label: string; color: string } {
  if (v < 15) return { label: "Low", color: Colors.light.success };
  if (v < 30) return { label: "Moderate", color: Colors.light.amber };
  return { label: "Elevated", color: Colors.light.coral };
}

export default function ResultCard({
  estimate,
  unit,
  confidence,
  modelVersion,
}: Props) {
  const level = levelForEstimate(estimate);
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Droplets color={Colors.light.tint} size={22} />
        </View>
        <View style={[styles.levelPill, { backgroundColor: level.color + "22" }]}>
          <View style={[styles.levelDot, { backgroundColor: level.color }]} />
          <Text style={[styles.levelText, { color: level.color }]}>
            {level.label}
          </Text>
        </View>
      </View>

      <Text style={styles.estimate}>{estimate.toFixed(1)}</Text>
      <Text style={styles.unit}>{unit}</Text>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Confidence</Text>
          <Text style={styles.metaValue}>
            {Math.round(confidence * 100)}%
          </Text>
        </View>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Model</Text>
          <Text style={styles.metaValue}>{modelVersion ?? "—"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.light.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  levelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  levelDot: { width: 6, height: 6, borderRadius: 3 },
  levelText: { fontSize: 12, fontWeight: "700" },
  estimate: {
    fontSize: 56,
    fontWeight: "700",
    color: Colors.light.text,
    lineHeight: 62,
  },
  unit: {
    fontSize: FontSize.md,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.lg,
  },
  metaRow: { flexDirection: "row", gap: Spacing.xl },
  metaCell: { flex: 1 },
  metaLabel: {
    fontSize: FontSize.xs,
    color: Colors.light.textSubtle,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
    fontWeight: FontWeight.semibold,
  },
  metaValue: {
    fontSize: FontSize.md,
    color: Colors.light.text,
    fontWeight: FontWeight.semibold,
  },
});
