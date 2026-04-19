import * as ImagePicker from "expo-image-picker";

// TODO: Replace with microscope-adapter-aware camera capture once hardware is wired.
export const cameraService = {
  async captureImage(): Promise<string | null> {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        console.log("[cameraService] camera permission denied");
        return null;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: false,
      });
      if (result.canceled) return null;
      return result.assets[0]?.uri ?? null;
    } catch (e) {
      console.log("[cameraService] capture error", e);
      return null;
    }
  },

  async pickFromLibrary(): Promise<string | null> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        mediaTypes: ["images"],
      });
      if (result.canceled) return null;
      return result.assets[0]?.uri ?? null;
    } catch (e) {
      console.log("[cameraService] pick error", e);
      return null;
    }
  },
};
