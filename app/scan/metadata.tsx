import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { MapPin, RefreshCw } from "lucide-react-native";
import FormInput from "@/components/FormInput";
import PrimaryButton from "@/components/PrimaryButton";
import Colors from "@/constants/colors";
import { FontSize, FontWeight, Radius, Spacing } from "@/constants/theme";
import { locationService } from "@/services/locationService";
import { useScanDraft } from "@/providers/ScanDraftProvider";
import { WaterSourceType } from "@/types";
import { formatCoords } from "@/utils/format";

const SOURCES: { value: WaterSourceType; label: string }[] = [
  { value: "ocean", label: "Ocean" },
  { value: "bay", label: "Bay" },
  { value: "river", label: "River" },
  { value: "lake", label: "Lake" },
  { value: "tap", label: "Tap" },
  { value: "other", label: "Other" },
];

export default function MetadataScreen() {
  const router = useRouter();
  const { draft, setLocation, setMetadata } = useScanDraft();
  const [notes, setNotes] = useState<string>(draft.metadata.notes ?? "");
  const [temp, setTemp] = useState<string>(
    draft.metadata.temperatureC?.toString() ?? ""
  );
  const [ph, setPh] = useState<string>(
    draft.metadata.phLevel?.toString() ?? ""
  );
  const [source, setSource] = useState<WaterSourceType>(
    draft.metadata.waterSource ?? "ocean"
  );
  const [locating, setLocating] = useState<boolean>(false);

  const fetchLocation = async () => {
    setLocating(true);
    try {
      const loc = await locationService.getCurrentLocation();
      if (loc) setLocation(loc);
    } finally {
      setLocating(false);
    }
  };

  useEffect(() => {
    if (!draft.location) fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onContinue = () => {
    setMetadata({
      notes: notes.trim() || undefined,
      temperatureC: temp ? Number(temp) : undefined,
      phLevel: ph ? Number(ph) : undefined,
      waterSource: source,
    });
    router.push("/scan/processing");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen options={{ title: "Sample details" }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* GPS card */}
          <View style={styles.gpsCard}>
            <View style={styles.gpsIcon}>
              <MapPin size={18} color={Colors.light.tint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.gpsLabel}>Location</Text>
              <Text style={styles.gpsValue}>
                {draft.location
                  ? formatCoords(draft.location.latitude, draft.location.longitude)
                  : locating
                  ? "Locating…"
                  : "Location unavailable"}
              </Text>
              {draft.location?.accuracy ? (
                <Text style={styles.gpsSub}>
                  ±{Math.round(draft.location.accuracy)}m accuracy
                </Text>
              ) : null}
            </View>
            <Pressable
              onPress={fetchLocation}
              style={styles.gpsRefresh}
              testID="refresh-location"
            >
              <RefreshCw size={16} color={Colors.light.tint} />
            </Pressable>
          </View>

          {/* Source picker */}
          <Text style={styles.fieldLabel}>Water source</Text>
          <View style={styles.chipRow}>
            {SOURCES.map((s) => {
              const active = s.value === source;
              return (
                <Pressable
                  key={s.value}
                  onPress={() => setSource(s.value)}
                  style={[styles.chip, active && styles.chipActive]}
                  testID={`source-${s.value}`}
                >
                  <Text
                    style={[
                      styles.chipText,
                      active && styles.chipTextActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ flexDirection: "row", gap: Spacing.md, marginTop: Spacing.lg }}>
            <View style={{ flex: 1 }}>
              <FormInput
                label="Temp (°C)"
                value={temp}
                onChangeText={setTemp}
                keyboardType="decimal-pad"
                placeholder="17.2"
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormInput
                label="pH"
                value={ph}
                onChangeText={setPh}
                keyboardType="decimal-pad"
                placeholder="8.1"
              />
            </View>
          </View>

          <FormInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Site conditions, tide, visible debris…"
            multiline
            numberOfLines={4}
            style={styles.notes}
          />
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            title="Run analysis"
            onPress={onContinue}
            testID="metadata-continue"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  gpsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.xl,
  },
  gpsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  gpsLabel: {
    fontSize: FontSize.xs,
    color: Colors.light.textSubtle,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: FontWeight.semibold,
  },
  gpsValue: {
    fontSize: FontSize.md,
    color: Colors.light.text,
    fontWeight: FontWeight.semibold,
    marginTop: 2,
  },
  gpsSub: { fontSize: FontSize.xs, color: Colors.light.textMuted, marginTop: 2 },
  gpsRefresh: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.light.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.light.textMuted,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  chipActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.light.text,
    fontWeight: FontWeight.semibold,
  },
  chipTextActive: { color: "#fff" },
  notes: { minHeight: 100, textAlignVertical: "top", paddingTop: 14 },
  footer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
});
