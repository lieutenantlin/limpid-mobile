import createContextHook from "@nkzw/create-context-hook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { WaterSample } from "@/types";
import { sampleService } from "@/services/sampleService";
import { syncService } from "@/services/syncService";

const SAMPLES_KEY = ["samples"] as const;

export const [SamplesProvider, useSamples] = createContextHook(() => {
  const qc = useQueryClient();

  const samplesQuery = useQuery({
    queryKey: SAMPLES_KEY,
    queryFn: () => sampleService.list(),
  });

  const createMutation = useMutation({
    mutationFn: (s: WaterSample) => sampleService.create(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: SAMPLES_KEY }),
  });

  const syncMutation = useMutation({
    mutationFn: (s: WaterSample) => syncService.uploadSample(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: SAMPLES_KEY }),
  });

  const retryAllMutation = useMutation({
    mutationFn: () => syncService.retryAllFailed(),
    onSuccess: () => qc.invalidateQueries({ queryKey: SAMPLES_KEY }),
  });

  const refetch = useCallback(() => {
    qc.invalidateQueries({ queryKey: SAMPLES_KEY });
  }, [qc]);

  const samples = useMemo(() => samplesQuery.data ?? [], [samplesQuery.data]);

  return {
    samples,
    isLoading: samplesQuery.isLoading,
    isRefetching: samplesQuery.isRefetching,
    refetch,
    addSample: createMutation.mutateAsync,
    isAdding: createMutation.isPending,
    syncSample: syncMutation.mutateAsync,
    isSyncing: syncMutation.isPending,
    retryAllFailed: retryAllMutation.mutateAsync,
    isRetrying: retryAllMutation.isPending,
  };
});

export function useSampleById(id: string | undefined) {
  const { samples } = useSamples();
  return useMemo(
    () => (id ? samples.find((s) => s.id === id) ?? null : null),
    [samples, id]
  );
}
