import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useState } from "react";
import { GeoLocation, SampleMetadataDraft, ScanResult } from "@/types";

export interface ScanDraft {
  imageUri?: string;
  location?: GeoLocation;
  metadata: SampleMetadataDraft;
  result?: ScanResult;
}

const EMPTY: ScanDraft = { metadata: {} };

export const [ScanDraftProvider, useScanDraft] = createContextHook(() => {
  const [draft, setDraft] = useState<ScanDraft>(EMPTY);

  const reset = useCallback(() => setDraft(EMPTY), []);

  const setImage = useCallback(
    (uri: string) => setDraft((d) => ({ ...d, imageUri: uri })),
    []
  );

  const setLocation = useCallback(
    (loc: GeoLocation | undefined) =>
      setDraft((d) => ({ ...d, location: loc })),
    []
  );

  const setMetadata = useCallback(
    (m: SampleMetadataDraft) =>
      setDraft((d) => ({ ...d, metadata: { ...d.metadata, ...m } })),
    []
  );

  const setResult = useCallback(
    (r: ScanResult | undefined) => setDraft((d) => ({ ...d, result: r })),
    []
  );

  return { draft, reset, setImage, setLocation, setMetadata, setResult };
});
