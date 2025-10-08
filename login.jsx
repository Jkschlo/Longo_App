// app/login.jsx
import React, { useEffect, useRef } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";

const COLORS = {
  navy: "#0B3B75",
  lightBlue: "#63B3E4",
  input: "#2E4E86",
  white: "#FFFFFF",
  bg: "#F3F6FA",
  grayText: "#DCE6F5",
};

export default function Login() {
  const router = useRouter();
  const slide = useRef(new Animated.Value(80)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1, backgroundColor: COLORS.bg }}
    >
      <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Top white logo block */}
          <View style={styles.topBox}>
            <Image
              source={{
                uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Longo%20Logo.png",
              }}
              style={styles.longoLogo}
              resizeMode="contain"
            />
            <Image
              source={{
                uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Affordable%20Duct%20cleaning%20logo.png",
              }}
              style={styles.longoLogo}
              resizeMode="contain"
            />
          </View>

          {/* Rounded blue card (animated) */}
          <Animated.View
            style={[
              styles.card,
              { opacity: fade, transform: [{ translateY: slide }] },
            ]}
          >
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Sign in to continue.</Text>

            <Text style={styles.label}>NAME</Text>
            <TextInput
              placeholder="Technician"
              placeholderTextColor={COLORS.grayText}
              style={styles.input}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>PASSWORD</Text>
            <TextInput
              placeholder="******"
              placeholderTextColor={COLORS.grayText}
              secureTextEntry
              style={styles.input}
            />

            {/* Go to /training on press */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/training")}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/createLogin")}>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBox: {
    backgroundColor: COLORS.white,
    paddingTop: 28,
    paddingBottom: 16,
    alignItems: "center",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  longoLogo: { width: 220, height: 64, marginBottom: 4 },
  adcLogo: { width: 200, height: 50, marginBottom: 6 },

  card: {
    backgroundColor: COLORS.navy,
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 24,
    padding: 18,
  },
  title: { color: COLORS.white, fontSize: 26, fontWeight: "800", marginBottom: 4 },
  subtitle: { color: "#C7D5EE", marginBottom: 16 },

  label: { color: "#C7D5EE", fontSize: 12, fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: COLORS.input,
    color: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 16,
  },
  buttonText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
  link: {
    color: COLORS.white,
    textAlign: "center",
    marginTop: 14,
    textDecorationLine: "underline",
  },
});