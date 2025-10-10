import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  white: "#ffffff",
  deepNavy: "#0A2C57",
  lightBlue: "#6EC1E4",
  sky: "#d8ecff",
  border: "#e7eef8",
  shadow: "#000",
};

/** ===== Shell styles (now matches Training logoBar exactly) ===== */
const shellStyles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: COLORS.white }, // white space around card
  topBox: {
    height: 110,
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8, // EXACT like training.jsx
  },
  topLogo: { width: 140, height: 50 }, // EXACT like training.jsx
  centerArea: { flex: 1, padding: 16, backgroundColor: COLORS.white }, // white behind card
  bottomBox: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 50,
  },
  bottomLogo: { width: 240, height: 50 },
});

/** ===== Auth shell component ===== */
const AuthShell = ({ children }) => {
  return (
    <View style={shellStyles.shell}>
      {/* Top logo box (exact match to Training) */}
      <View style={shellStyles.topBox}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Longo%20Logo.png",
          }}
          style={shellStyles.topLogo}
          resizeMode="contain"
        />
      </View>

      {/* Center (white space around the dark card) */}
      <View style={shellStyles.centerArea}>{children}</View>

      {/* Bottom logo box (unchanged) */}
      <View style={shellStyles.bottomBox}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Affordable%20Duct%20cleaning%20logo.png",
          }}
          style={shellStyles.bottomLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default function CreateLogin() {
  const router = useRouter();

  // Anim
  const cardY = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardY, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardY, cardOpacity]);

  // ---- validations ----
  const validate = () => {
    const e = {};
    if (!/^[A-Za-z][A-Za-z' -]{1,}(\s[A-Za-z' -]{2,})?$/.test(name.trim())) {
      e.name = "Enter your real name (letters, spaces, - ').";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Enter a valid email.";
    }
    if (!(password.length >= 7 && /[^A-Za-z0-9]/.test(password))) {
      e.password = "Min 7 chars & include a special character.";
    }
    if (confirm !== password) {
      e.confirm = "Passwords do not match.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setBusy(true);
    try {
      const emailNorm = email.trim().toLowerCase();
      const fullName = name.trim();

      // 1) Sign up (metadata used by server trigger)
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: emailNorm,
          password,
          options: { data: { full_name: fullName } },
        });
      if (signUpError) throw signUpError;

      // 2) Ensure session exists (some projects return null session on signUp)
      let sessionUser = signUpData?.session?.user ?? null;
      if (!sessionUser) {
        const { data: signInData, error: signInErr } =
          await supabase.auth.signInWithPassword({
            email: emailNorm,
            password,
          });
        if (signInErr) throw signInErr;
        sessionUser = signInData?.user ?? null;
      }
      if (!sessionUser)
        throw new Error("No authenticated session after sign-up.");

      // 3) Local cache for instant render/offline
      await AsyncStorage.setItem(
        "userProfile",
        JSON.stringify({ id: sessionUser.id, name: fullName, email: emailNorm })
      );

      // 4) Navigate to profile (server trigger creates DB row)
      router.push("/profile");
    } catch (err) {
      const msg = String(err?.message || "");
      if (/email not confirmed/i.test(msg)) {
        Alert.alert(
          "Check your email",
          "We sent a confirmation link. Tap it, then return to sign in."
        );
      } else {
        Alert.alert("Sign up error", msg || "Failed to create account.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1, backgroundColor: COLORS.white }} // white edge-to-edge
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.white }} // white scroll bg
      >
        <AuthShell>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateY: cardY }],
                opacity: cardOpacity,
              },
            ]}
          >
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Let’s get you set up.</Text>

            {/* NAME */}
            <Text style={styles.label}>NAME</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
            />
            {!!errors.name && <Text style={styles.error}>{errors.name}</Text>}

            {/* EMAIL */}
            <Text style={[styles.label, { marginTop: 12 }]}>EMAIL</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
            />
            {!!errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {/* PASSWORD */}
            <Text style={[styles.label, { marginTop: 12 }]}>PASSWORD</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.inputWithIcon]}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                returnKeyType="next"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPass((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={
                  showPass ? "Hide password" : "Show password"
                }
              >
                <Ionicons
                  name={showPass ? "eye-off" : "eye"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            {!!errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            {/* CONFIRM PASSWORD */}
            <Text style={[styles.label, { marginTop: 12 }]}>
              CONFIRM PASSWORD
            </Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.inputWithIcon]}
                secureTextEntry={!showConfirm}
                value={confirm}
                onChangeText={setConfirm}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirm((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={
                  showConfirm
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                <Ionicons
                  name={showConfirm ? "eye-off" : "eye"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            {!!errors.confirm && (
              <Text style={styles.error}>{errors.confirm}</Text>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={styles.button}
              onPress={onSubmit}
              activeOpacity={0.85}
              disabled={busy}
            >
              <Text style={styles.buttonText}>
                {busy ? "Creating..." : "Sign up"}
              </Text>
            </TouchableOpacity>

            {/* Alt nav */}
            <View style={{ marginTop: 12, alignItems: "center" }}>
              <Text style={{ color: "#cfe2ff" }}>
                Already have an account?{" "}
                <Text
                  style={styles.linkUnderline}
                  onPress={() => router.push("/login")}
                >
                  Log In
                </Text>
              </Text>
            </View>
          </Animated.View>
        </AuthShell>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** ===== Component styles ===== */
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.deepNavy,
    borderRadius: 18,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: "#1d3969",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  title: { fontSize: 28, fontWeight: "900", color: COLORS.white },
  subtitle: { fontSize: 12, color: "#cfe2ff", marginTop: 6, marginBottom: 12 },
  label: { color: "#cfe2ff", fontSize: 12, marginBottom: 6, marginTop: 6 },
  input: {
    backgroundColor: "#274a7e",
    color: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  passwordRow: {
    position: "relative",
    justifyContent: "center",
  },
  inputWithIcon: {
    paddingRight: 42, // space for eye button
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 18,
  },
  buttonText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
  error: { color: "#ffd1d1", fontSize: 11, marginTop: 6 },
  linkUnderline: { color: COLORS.white, textDecorationLine: "underline" },
});
