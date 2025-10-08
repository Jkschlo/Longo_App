// app/settings.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter, usePathname } from "expo-router";

export default function Settings() {
  const router = useRouter();
  const pathname = usePathname();

  const safePush = (href) => () => {
    if (pathname !== href) router.push(href);
  };

  const Row = ({ label, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={styles.rowText}>{label}</Text>
      <Text style={styles.chev}>{">"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    {/* Top Logo Bar — uniform with Profile */}
      <View style={styles.logoBar}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Longo%20Logo.png",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header under logo: Back (left), Title (center), spacer (right) */}
        <View style={styles.headerRow}>
          <Pressable onPress={safePush("/profile")} hitSlop={12}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <Text style={styles.title}>Settings</Text>

          <View style={{ width: 60 }} />
        </View>

        {/* List (no Settings row here) */}
        <View style={styles.listWrap}>
          <Row label="Change Password" onPress={safePush("/changePw")} />
          <View style={styles.divider} />
          <Row label="Privacy Policy" onPress={safePush("/privacy")} />
          <View style={styles.divider} />
          <Row label="About" onPress={safePush("/about")} />
          <View style={styles.divider} />
          <Row
            label="Logout"
            onPress={() => {
              router.replace("/login");
            }}
          />
        </View>
      </ScrollView>

      {/* Bottom Nav — uniform with Profile */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={safePush("/quizzes")}>
          <Image
            source={{
              uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/quizzes.png",
            }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Quizzes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={safePush("/training")}>
          <Image
            source={{
              uri: "https://github.com/Jkschlo/Longo_App/blob/main/training.JPG?raw=true",
            }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Training</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={safePush("/profile")}>
          <Image
            source={{
              uri: "https://github.com/Jkschlo/Longo_App/blob/main/profile.JPG?raw=true",
            }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Page background (uniform)
  container: { flex: 1, backgroundColor: "#093075" },

  // Top Logo Bar (match Profile)
  logoBar: {
    height: 90,
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    borderBottomColor: "#eee",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
  },
  logo: { width: 140, height: 40 },

  // Header under logo (Floor Cleaning style back)
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  backText: { fontSize: 16, fontWeight: "700", width: 60, color: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    flex: 1,
    color: "#fff",
  },

  // List (uniform with Profile)
  listWrap: { marginHorizontal: 14, marginTop: 10, borderRadius: 14 },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  chev: { color: "#fff", fontSize: 20, fontWeight: "900" },
  divider: {
    height: 1,
    backgroundColor: "#0a2f6a",
    marginHorizontal: 14,
    opacity: 0.75,
  },

  // Bottom nav (uniform)
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navItem: { alignItems: "center" },
  navIcon: { width: 24, height: 24, marginBottom: 4 },
  navText: { fontSize: 12, fontWeight: "600" },
});
