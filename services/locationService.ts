import { Platform } from "react-native";
import * as Location from "expo-location";
import { GeoLocation } from "@/types";

export const locationService = {
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (e) {
      console.log("[locationService] permission error", e);
      return false;
    }
  },

  async getCurrentLocation(): Promise<GeoLocation | null> {
    try {
      if (Platform.OS === "web") {
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          return await new Promise<GeoLocation | null>((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) =>
                resolve({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                  accuracy: pos.coords.accuracy,
                  timestamp: pos.timestamp,
                }),
              () => resolve(null),
              { enableHighAccuracy: false, timeout: 5000 }
            );
          });
        }
        return null;
      }
      const granted = await this.requestPermission();
      if (!granted) return null;
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy ?? undefined,
        timestamp: pos.timestamp,
      };
    } catch (e) {
      console.log("[locationService] error", e);
      return null;
    }
  },
};
