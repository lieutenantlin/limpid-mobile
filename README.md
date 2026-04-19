# Microplastics Water Quality Scanner

iPhone-focused Expo / React Native scaffold for capturing a water sample image, recording GPS + metadata, running on-device analysis via an Arduino UNO Q, and syncing to a backend. **This is an MVP scaffold** — ML, backend, and hardware integration are mocked.

## Run

```bash
bun install
bun run start      # native (Expo Go / dev client)
bun run start-web  # web preview
```

## Project structure

```
app/
  _layout.tsx              Root providers + auth gate + stack
  login.tsx                Mocked auth placeholder
  +not-found.tsx           404
  (tabs)/
    _layout.tsx            Bottom tabs: Home / History / New Scan / Settings
    (home)/                Home stack
      _layout.tsx
      index.tsx            Dashboard: device status, stats, CTA, recent scans
    history.tsx            Searchable scan list
    new-scan.tsx           Workflow intro
    settings.tsx           Device connection, sync, account
  scan/
    _layout.tsx
    capture.tsx            Camera capture placeholder (microscope viewfinder)
    metadata.tsx           GPS + sample metadata form
    processing.tsx         Analysis loading screen (sends image to device)
    result.tsx             Estimated microplastics result + save + upload
  sample/[id].tsx          Scan detail

components/                Reusable UI (PrimaryButton, ResultCard, StatusBadge, etc.)
providers/                 Context hooks (Auth, Samples, Device, ScanDraft)
services/                  authService, sampleService, locationService,
                           cameraService, deviceService, syncService, apiClient
hooks/                     (reserved)
types/                     Shared TS types (WaterSample, ScanResult, etc.)
constants/                 colors.ts, theme.ts
mock-data/                 Seeded coastal SoCal samples
utils/                     format helpers
```

## Navigation

Bottom tabs (Home, History, New Scan, Settings) with a center FAB-style "New Scan". Scan workflow and sample detail are in a root stack so they overlay the tab bar cleanly.

## Mocked vs. ready for integration

| Area | Status | Integration hook |
|---|---|---|
| Auth | **Mocked** (AsyncStorage) | `services/authService.ts` → wire to `POST /auth/login`, `GET /auth/me` |
| Samples list/detail | **Local only** (AsyncStorage, seeded) | `services/sampleService.ts` → `GET /samples`, `GET /samples/:id` |
| Upload/sync | **Mocked** (no-op apiClient) | `services/syncService.ts` + `services/apiClient.ts` → `POST /ingest/sample` |
| GPS | **Real** via `expo-location` (with web fallback) | `services/locationService.ts` |
| Camera | **Real capture** via `expo-image-picker`; library fallback | `services/cameraService.ts` — swap for microscope-adapter-aware pipeline |
| Arduino UNO Q | **Mocked inference** with randomized plausible results | `services/deviceService.ts` → implement BLE (`react-native-ble-plx`) or Wi-Fi/HTTP bridge |
| ML model | **Not implemented**; model runs on the edge device | n/a — performed on UNO Q |

## Data model (`types/WaterSample`)

`id`, `sampleId`, `capturedAt`, `latitude`, `longitude`, `locationLabel?`, `microplasticEstimate`, `unit`, `confidence`, `modelVersion`, `notes?`, `imageUri?`, `uploadStatus`, `deviceId?`, `waterSource?`, `temperatureC?`, `phLevel?`.

## Next integration steps

1. **Backend.** Replace `services/apiClient.ts` with a real fetch client (base URL already read from `EXPO_PUBLIC_RORK_API_BASE_URL`). Implement `/auth/*`, `/samples`, `/samples/:id`, `/ingest/sample`.
2. **Arduino UNO Q.** Pick transport (BLE or local Wi-Fi HTTP). Implement `deviceService.connect` / `disconnect` / `runInference`. Keep the same interface so the UI doesn't change.
3. **AWS storage.** Upload `imageUri` to S3 (presigned URL) inside `syncService.uploadSample`, then POST metadata to `/ingest/sample`.
4. **Background sync.** Add retry/queueing (e.g. `expo-task-manager` on native).
5. **Auth.** Swap the mock for OAuth/email-link or Cognito.

## Notes

- Styling uses `StyleSheet` only, with tokens in `constants/theme.ts` and `constants/colors.ts` (deep ocean / teal / aqua palette).
- State: React Query for samples, `@nkzw/create-context-hook` providers for auth, device, and scan draft.
- Web compatible: `locationService` has a navigator.geolocation fallback; `cameraService` falls back to library picker.
- All hardware/backend boundaries are marked with `TODO` comments.
