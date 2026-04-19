import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Droplets } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import FormInput from "@/components/FormInput";
import PrimaryButton from "@/components/PrimaryButton";
import Colors from "@/constants/colors";
import { FontSize, FontWeight, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState<string>("researcher@socal.lab");
  const [password, setPassword] = useState<string>("demo1234");
  const [error, setError] = useState<string | undefined>();

  const onSubmit = async () => {
    setError(undefined);
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    try {
      await login(email, password);
    } catch (e) {
      console.log("[login] error", e);
      setError("Unable to sign in. Try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={[Colors.palette.ocean, Colors.palette.deepOcean]}
            style={styles.hero}
          >
            <View style={styles.logoWrap}>
              <Droplets size={32} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>Microplastics Scanner</Text>
            <Text style={styles.heroSub}>
              On-device water quality analysis for coastal research.
            </Text>
          </LinearGradient>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Sign in</Text>
            <Text style={styles.formSub}>
              Use any credentials — this is a mocked auth placeholder.
            </Text>

            <View style={{ marginTop: Spacing.xl }}>
              <FormInput
                testID="login-email"
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
              <FormInput
                testID="login-password"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={error}
              />
              <PrimaryButton
                title="Sign in"
                onPress={onSubmit}
                loading={loading}
                testID="login-submit"
              />
            </View>

            <Text style={styles.legal}>
              By continuing you acknowledge this is a research scaffold. No real
              credentials are transmitted.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.light.background },
  scroll: { flexGrow: 1 },
  hero: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    color: "#fff",
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  heroSub: {
    color: "#CFE7EC",
    fontSize: FontSize.md,
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 320,
  },
  form: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  formTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.light.text,
  },
  formSub: {
    fontSize: FontSize.sm,
    color: Colors.light.textMuted,
    marginTop: 4,
  },
  legal: {
    marginTop: Spacing.xl,
    fontSize: FontSize.xs,
    color: Colors.light.textSubtle,
    textAlign: "center",
    lineHeight: 18,
  },
});
