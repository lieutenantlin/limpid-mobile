import React, { useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Clock3, Filter } from "lucide-react-native";
import ScreenHeader from "@/components/ScreenHeader";
import SampleListItem from "@/components/SampleListItem";
import EmptyState from "@/components/EmptyState";
import Colors from "@/constants/colors";
import { FontSize, FontWeight, Radius, Spacing } from "@/constants/theme";
import { UploadStatus } from "@/types";
import { useSamples } from "@/providers/SamplesProvider";

const FILTERS: { label: string; value: UploadStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Uploaded", value: "uploaded" },
];

export default function HistoryScreen() {
  const router = useRouter();
  const { samples, isLoading, isRefetching, refetch } = useSamples();
  const [filter, setFilter] = useState<UploadStatus | "all">("all");

  const filteredSamples = useMemo(() => {
    if (filter === "all") return samples;
    return samples.filter((sample) => sample.uploadStatus === filter);
  }, [samples, filter]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching && !isLoading} onRefresh={refetch} />
        }
      >
        <ScreenHeader
          eyebrow="Archive"
          title="Sample history"
          subtitle="Review captured samples, inspect statuses, and reopen any result."
        />

        <View style={styles.filterWrap}>
          <View style={styles.filterHeader}>
            <Filter size={16} color={Colors.light.textMuted} />
            <Text style={styles.filterLabel}>Filter by upload status</Text>
          </View>
          <View style={styles.chips}>
            {FILTERS.map((item) => {
              const active = item.value === filter;
              return (
                <Pressable
                  key={item.value}
                  onPress={() => setFilter(item.value)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {filteredSamples.length ? (
          <View style={styles.list}>
            {filteredSamples.map((sample) => (
              <SampleListItem
                key={sample.id}
                sample={sample}
                onPress={() => router.push(`/sample/${sample.id}`)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon={<Clock3 size={28} color={Colors.light.tint} />}
            title="No matching samples"
            message="There are no saved samples for the current filter."
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.light.background },
  content: {
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  filterWrap: {
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterLabel: {
    color: Colors.light.textMuted,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: Colors.light.background,
  },
  chipActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  chipText: {
    color: Colors.light.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  chipTextActive: {
    color: Colors.light.surface,
  },
  list: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
});
