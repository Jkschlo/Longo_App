import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, Image, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Animated, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";


const COLORS = { white: "#ffffff", deepNavy: "#0A2C57", lightBlue: "#6EC1E4", bg: "#ffffff", error: "#ffb3b3" };

const AuthShell = ({ children }) => (
  <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
    <View style={shellStyles.topBox}>
      <Image
        source={{ uri: "https://github.com/Jkschlo/Longo_App/blob/main/Longo%20Logo.png?raw=true" }}
        style={shellStyles.topLogo}
        resizeMode="contain"
      />
    </View>
    <View style={shellStyles.centerArea}>{children}</View>
    <View style={shellStyles.bottomBox}>
      <Image
        source={{ uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Affordable%20Duct%20cleaning%20logo.png" }}
        style={shellStyles.bottomLogo}
        resizeMode="contain"
      />
    </View>
  </View>
);

const shellStyles = StyleSheet.create({
  topBox: { backgroundColor: COLORS.white, paddingTop: 80, paddingBottom: 12, alignItems: "center", borderBottomLeftRadius: 18, borderBottomRightRadius: 18, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  topLogo: { width: 300, height: 75 },
  centerArea: { flex: 1, justifyContent: "center", paddingHorizontal: 16 },
  bottomBox: { paddingVertical: 70, alignItems: "center", paddingBottom: 100 },
  bottomLogo: { width: 300, height: 75 },
});

export default function Login() {
  const router = useRouter();
  const slide = useRef(new Animated.Value(80)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(fade,  { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const signIn = async () => {
    const next = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // show a friendly message for bad creds
        setErrors((prev) => ({ ...prev, submit: "Incorrect email or password." }));
        return;
      }

      // apply any profile draft from create screen
      try {
        const raw = await AsyncStorage.getItem("@profileDraft");
        if (raw) {
          const draft = JSON.parse(raw);
          const { data: { user } } = await supabase.auth.getUser();
          if (user && draft?.email?.toLowerCase() === (user.email || "").toLowerCase()) {
            const update = {};
            if (draft.full_name) update.full_name = draft.full_name;
            if (draft.dob) {
              const [mm, dd, yyyy] = draft.dob.split("/");
              update.dob = `${yyyy}-${mm}-${dd}`;
            }
            if (Object.keys(update).length) {
              await supabase.from("profiles").update(update).eq("id", user.id);
            }
          }
          await AsyncStorage.removeItem("@profileDraft");
        }
      } catch {}

      router.replace("/training");
    } catch (e) {
      setErrors((prev) => ({ ...prev, submit: "Something went wrong. Please try again." }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding" })} style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <AuthShell>
          <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slide }] }]}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Sign in to continue.</Text>

            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(t)=>{ setEmail(t); if (errors.email) setErrors(e=>({...e,email:undefined})); }}
            />
            {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Text style={[styles.label, { marginTop: 12 }]}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={(t)=>{ setPassword(t); if (errors.password) setErrors(e=>({...e,password:undefined})); }}
            />
            {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            {!!errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

            <TouchableOpacity style={styles.button} onPress={signIn} activeOpacity={0.85} disabled={busy}>
              <Text style={styles.buttonText}>{busy ? "Signing in..." : "Log In"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/createLogin")}>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/training")}>
              <Text style={styles.link}>Bypass</Text>
            </TouchableOpacity>
          </Animated.View>
        </AuthShell>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.deepNavy, borderRadius: 18, padding: 20, marginHorizontal: 2, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 12, elevation: 4 },
  title: { fontSize: 32, fontWeight: "900", color: COLORS.white, textAlign: "center" },
  subtitle: { fontSize: 12, color: "#cfe2ff", textAlign: "center", marginTop: 4, marginBottom: 10 },
  label: { color: "#cfe2ff", fontSize: 12, marginBottom: 6, marginTop: 6 },
  input: { backgroundColor: "#274a7e", color: COLORS.white, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 6 },
  button: { backgroundColor: COLORS.lightBlue, borderRadius: 14, alignItems: "center", paddingVertical: 14, marginTop: 16 },
  buttonText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
  link: { color: COLORS.white, textAlign: "center", marginTop: 14, textDecorationLine: "underline" },
});
