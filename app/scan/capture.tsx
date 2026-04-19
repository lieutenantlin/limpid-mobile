import React, { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import {
  Camera,
  ImageIcon,
  RefreshCw,
  ScanLine,
} from "lucide-react-native";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import Colors from "@/constants/colors";
import { FontSize, FontWeight, Radius, Spacing } from "@/constants/theme";
import { cameraService } from "@/services/cameraService";
import { useScanDraft } from "@/providers/ScanDraftProvider";

export default function CaptureScreen() {
  const router = useRouter();
  const { draft, setImage } = useScanDraft();
  const [busy, setBusy] = useState<boolean>(false);

  const capture = async () => {
    setBusy(true);
    try {
      const uri = await cameraService.captureImage();
      if (uri) setImage(uri);
    } finally {
      setBusy(false);
    }
  };

  const pick = async () => {
    setBusy(true);
    try {
      const uri = await cameraService.pickFromLibrary();
      if (uri) setImage(uri);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen options={{ title: "Capture sample" }} />

      <View style={styles.viewfinder}>
        {draft.imageUri ? (
          <Image source={{ uri: draft.imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.reticle}>
              <ScanLine size={40} color={Colors.palette.aqua} />
            </View>
            <Text style={styles.placeholderTitle}>Microscope viewfinder</Text>
            <Text style={styles.placeholderSub}>
              {Platform.OS === "web"
                ? "Camera is limited on web. Use library upload to continue."
                : "Tap capture to take a sample image."}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {draft.imageUri ? (
          <>
            <SecondaryButton
              title="Retake"
              icon={<RefreshCw size={18} color={Colors.light.text} />}
              onPress={capture}
            />
            <PrimaryButton
              title="Continue"
              onPress={() => router.push("/scan/metadata")}
              testID="capture-continue"
            />
          </>
        ) : (
          <>
            <PrimaryButton
              title={busy ? "Opening camera…" : "Capture with camera"}
              onPress={capture}
              loading={busy}
              icon={<Camera size={18} color="#fff" />}
              testID="capture-take"
            />
            <Pressable onPress={pick} style={styles.secondaryLink}>
              <ImageIcon size={16} color={Colors.light.tint} />
              <Text style={styles.secondaryLinkText}>Choose from library</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.light.background },
  viewfinder: {
    flex: 1,
    margin: Spacing.xl,
    borderRadius: Radius.xl,
    overflow: "hidden",
    backgroundColor: Colors.palette.deepOcean,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: { width: "100%", height: "100%" },
  placeholder: { alignItems: "center", padding: Spacing.xl },
  reticle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.palette.aqua,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  placeholderTitle: {
    color: "#fff",
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  placeholderSub: {
    color: "#B7D6DB",
    fontSize: FontSize.sm,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 260,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  secondaryLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: Spacing.md,
  },
  secondaryLinkText: {
    color: Colors.light.tint,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
