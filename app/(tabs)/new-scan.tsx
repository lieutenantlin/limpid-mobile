import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Camera, MapPin, Waves } from "lucide-react-native";
import ScreenHeader from "@/components/ScreenHeader";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import Colors from "@/constants/colors";
import { FontSize, FontWeight, Radius, Spacing } from "@/constants/theme";
import { useDevice } from "@/providers/DeviceProvider";

export default function NewScanScreen() {
  const router = useRouter();
  const { status, connect, busy } = useDevice();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader
        eyebrow="Capture"
        title="Start a new scan"
        subtitle="Collect a sample image, attach field metadata, and run the mock inference pipeline."
      />

      <View style={styles.content}>
        <View style={styles.card}>
          <Step
            icon={<Camera size={18} color={Colors.light.tint} />}
            title="1. Capture image"
            description="Use the camera or photo library to attach a water sample image."
          />
          <Step
            icon={<MapPin size={18} color={Colors.light.tint} />}
            title="2. Add metadata"
            description="Record location, water source, and optional notes before processing."
          />
          <Step
            icon={<Waves size={18} color={Colors.light.tint} />}
            title="3. Review result"
            description="Inspect the estimate and save the sample into local history."
          />
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Edge device</Text>
          <Text style={styles.statusValue}>
            {status.connected ? status.deviceName ?? "Connected" : "Not connected"}
          </Text>
          <Text style={styles.statusHint}>
            {status.connected
              ? "You can proceed now. The inference service is mocked, so the flow also works offline."
              : "Connection is optional for the demo flow, but this reflects the intended hardware pairing state."}
          </Text>
        </View>

        <PrimaryButton title="Open camera flow" onPress={() => router.push("/scan/capture")} />
        {!status.connected ? (
          <SecondaryButton
            title={busy ? "Connecting..." : "Connect mock device"}
            onPress={() => void connect()}
            disabled={busy}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function Step({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepIcon}>{icon}</View>
      <View style={styles.stepBody}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.light.background },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  stepRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  stepIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.surfaceAlt,
  },
  stepBody: { flex: 1, gap: 4 },
  stepTitle: {
    color: Colors.light.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  stepDescription: {
    color: Colors.light.textMuted,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: Colors.light.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: 6,
  },
  statusLabel: {
    color: Colors.light.textMuted,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statusValue: {
    color: Colors.light.text,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  statusHint: {
    color: Colors.light.textMuted,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
});
