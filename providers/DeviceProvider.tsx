import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useState } from "react";
import { DeviceStatus } from "@/types";
import { deviceService } from "@/services/deviceService";

export const [DeviceProvider, useDevice] = createContextHook(() => {
  const [status, setStatus] = useState<DeviceStatus>({ connected: false });
  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => {
    deviceService.getStatus().then(setStatus);
  }, []);

  const connect = useCallback(async () => {
    setBusy(true);
    try {
      const s = await deviceService.connect();
      setStatus(s);
    } finally {
      setBusy(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setBusy(true);
    try {
      const s = await deviceService.disconnect();
      setStatus(s);
    } finally {
      setBusy(false);
    }
  }, []);

  return { status, busy, connect, disconnect };
});
