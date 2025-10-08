// app/login.jsx
import React, { useEffect, useRef, useState } from "react";
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

// ---- colors used across the page ----
const COLORS = {
  white: "#ffffff",
  navy: "#0e3a6f",
  deepNavy: "#0A2C57",
  lightBlue: "#6EC1E4",
  bg: "#ffffff",
  error: "#ffb3b3",
};

// ---- shared shell wrapper: top logo / centered area / bottom logo ----
const AuthShell = ({ children }) => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Top logo box */}
      <View style={shellStyles.topBox}>
        <Image
          source={{
            uri: "https://github.com/Jkschlo/Longo_App/blob/main/Longo%20Logo.png?raw=true",
          }}
          style={shellStyles.topLogo}
          resizeMode="contain"
        />
      </View>

      {/* Centered content */}
      <View style={shellStyles.centerArea}>{children}</View>

      {/* Bottom logo box */}
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

const shellStyles = StyleSheet.create({
  topBox: {
    backgroundColor: COLORS.white,
    paddingTop: 80,
    paddingBottom: 12,
    alignItems: "center",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topLogo: { width: 300, height: 75 },
  centerArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  bottomBox: {
    paddingVertical: 70,
    alignItems: "center",
    paddingBottom: 100,
  },
  bottomLogo: { width: 300, height: 75 },
});

// ---- simple validators ----
const nameIsValid = (name) => {
  // At least two words of letters with space/’/-
  const re = /^[A-Za-z]+(?:[ '\-][A-Za-z]+)+$/;
  return re.test(name.trim());
};
const passwordIsValid = (pwd) => {
  if (!pwd || pwd.length < 7) return false;
  // must include at least one special character
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\[\];'`~+/=]/.test(pwd);
  return hasSpecial;
};

// ---- Login screen ----
export default function Login() {
  const router = useRouter();

  // slide + fade animation for the card
  const slide = useRef(new Animated.Value(80)).current;
  const fade = useRef(new Animated.Value(0)).current;

  // controlled inputs + errors
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", password: "" });

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

  const validateAndGo = () => {
    const next = { name: "", password: "" };
    if (!nameIsValid(name)) next.name = "Enter your full name (first and last).";
    if (!passwordIsValid(password))
      next.password = "Password must be 7+ chars and include a special character.";
    setErrors(next);

    const ok = !next.name && !next.password;
    if (ok) router.push("/training");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1, backgroundColor: COLORS.bg }}
    >
      <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
        <AuthShell>
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fade,
                transform: [{ translateY: slide }],
              },
            ]}
          >
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Sign in to continue.</Text>

            <Text style={styles.label}>NAME</Text>
            <TextInput
              placeholder=""
              placeholderTextColor="#c8d3e1"
              style={styles.input}
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (errors.name) setErrors((e) => ({ ...e, name: "" }));
              }}
              autoCapitalize="words"
              returnKeyType="next"
            />
            {!!errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <Text style={[styles.label, { marginTop: 12 }]}>PASSWORD</Text>
            <TextInput
              placeholder=""
              placeholderTextColor="#c8d3e1"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors((e) => ({ ...e, password: "" }));
              }}
              returnKeyType="done"
            />
            {!!errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={validateAndGo}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Log In</Text>
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
  card: {
    backgroundColor: COLORS.deepNavy,
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#cfe2ff",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 10,
  },
  label: {
    color: "#cfe2ff",
    fontSize: 12,
    marginBottom: 6,
    marginTop: 6,
  },
  input: {
    backgroundColor: "#274a7e",
    color: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
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
