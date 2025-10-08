// app/createLogin.jsx
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

const COLORS = {
  white: "#ffffff",
  navy: "#0e3a6f",
  deepNavy: "#0A2C57",
  lightBlue: "#6EC1E4",
  bg: "#ffffff",
};

const AuthShell = ({ children }) => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={shellStyles.topBox}>
        <Image
          source={{
            uri: "https://github.com/Jkschlo/Longo_App/blob/main/Longo%20Logo.png?raw=true",
          }}
          style={shellStyles.topLogo}
          resizeMode="contain"
        />
      </View>

      <View style={shellStyles.centerArea}>{children}</View>

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

// --- validation helpers ---
const nameIsValid = (name) => {
  const trimmed = (name || "").trim();
  // Require at least first + last (allows letters, spaces, hyphens, apostrophes)
  const re = /^[A-Za-z]+(?:[ '-][A-Za-z]+)+$/;
  return re.test(trimmed);
};

const emailIsValid = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test((email || "").trim());
};

const passwordIsValid = (pwd) => {
  if (!pwd || pwd.length <= 6) return false;
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  return hasSpecial;
};

const dobIsValid = (dob) => {
  // Must be MM/DD/YYYY and a plausible date
  const re = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
  if (!re.test(dob)) return false;
  const [mm, dd, yyyy] = dob.split("/").map((x) => parseInt(x, 10));
  const dt = new Date(yyyy, mm - 1, dd);
  // Check JS date validity (month rolls, leap years)
  return (
    dt.getFullYear() === yyyy &&
    dt.getMonth() === mm - 1 &&
    dt.getDate() === dd &&
    yyyy > 1900 &&
    yyyy < 2100
  );
};

// ✅ Progressive auto-format MM/DD/YYYY while typing
const formatDOB = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 8);
  const len = digits.length;
  if (len <= 2) return digits;                                  // M, MM
  if (len <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`; // MM/D, MM/DD
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`; // MM/DD/YYYY
};

export default function CreateLogin() {
  const router = useRouter();

  // animation
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

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [dob, setDob] = useState("");

  // error state
  const [errors, setErrors] = useState({});

  const validateAll = () => {
    const next = {};
    if (!nameIsValid(name)) next.name = "Enter your first and last name.";
    if (!emailIsValid(email)) next.email = "Enter a valid email address.";
    if (!passwordIsValid(pwd))
      next.pwd = "Password must be >6 characters and include a special character.";
    if (!dobIsValid(dob))
      next.dob = "Use MM/DD/YYYY and a real calendar date.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = () => {
    if (validateAll()) {
      // Success path (no backend yet): proceed to login or training
      router.push("/login"); // change to /training if you prefer
    }
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
            <Text style={styles.title}>Create New Account</Text>
            <Text style={styles.subtitle}>
              Already registered?{" "}
              <Text
                onPress={() => router.push("/login")}
                style={[styles.link, { textDecorationLine: "underline" }]}
              >
                Log in here
              </Text>
            </Text>

            <Text style={styles.label}>NAME</Text>
            <TextInput
              placeholder=""
              placeholderTextColor="#c8d3e1"
              style={styles.input}
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
              }}
              autoCapitalize="words"
              autoCorrect
            />
            {!!errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <Text style={[styles.label, { marginTop: 12 }]}>EMAIL</Text>
            <TextInput
              placeholder=""
              placeholderTextColor="#c8d3e1"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
            />
            {!!errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <Text style={[styles.label, { marginTop: 12 }]}>PASSWORD</Text>
            <TextInput
              placeholder=""
              placeholderTextColor="#c8d3e1"
              secureTextEntry
              style={styles.input}
              value={pwd}
              onChangeText={(t) => {
                setPwd(t);
                if (errors.pwd) setErrors((e) => ({ ...e, pwd: undefined }));
              }}
            />
            {!!errors.pwd && <Text style={styles.error}>{errors.pwd}</Text>}

            <Text style={[styles.label, { marginTop: 12 }]}>DATE OF BIRTH</Text>
            <TextInput
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#c8d3e1"
              style={styles.input}
              value={dob}
              onChangeText={(t) => {
                const formatted = formatDOB(t);
                setDob(formatted);
                if (errors.dob) setErrors((e) => ({ ...e, dob: undefined }));
              }}
              keyboardType="numeric"   // works well on iOS & Android
              maxLength={10}
            />
            {!!errors.dob && <Text style={styles.error}>{errors.dob}</Text>}

            <TouchableOpacity
              style={styles.button}
              onPress={onSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Sign up</Text>
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
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 12,
    color: "#cfe2ff",
    marginTop: 6,
    marginBottom: 12,
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
  button: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 18,
  },
  buttonText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },
  // minimal error style (does not change your card design)
  error: {
    color: "#ffd1d1",
    fontSize: 11,
    marginTop: 6,
  },
  link: {
    color: COLORS.white,
  },
});
