import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import Colors from "@/constants/colors";
import { Radius, FontSize, FontWeight, Spacing } from "@/constants/theme";

interface Props extends TextInputProps {
  label: string;
  hint?: string;
  error?: string;
}

export default function FormInput({
  label,
  hint,
  error,
  style,
  ...rest
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={Colors.light.textSubtle}
        {...rest}
        style={[styles.input, error ? styles.inputError : null, style]}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.lg },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.light.textMuted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    fontSize: FontSize.md,
    color: Colors.light.text,
    minHeight: 50,
  },
  inputError: { borderColor: Colors.light.danger },
  hint: { marginTop: 6, fontSize: FontSize.sm, color: Colors.light.textSubtle },
  errorText: { marginTop: 6, fontSize: FontSize.sm, color: Colors.light.danger },
});
