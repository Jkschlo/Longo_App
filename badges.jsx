// app/badges.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/** --- Hard-coded examples for now (can wire to Supabase later) --- */
const EARNED_BADGES = [
  {
    key: "first-module",
    title: "First Steps",
    blurb: "Completed your first training module",
    icon: "ribbon-outline",
    color: "#2ecc71",
  },
  {
    key: "carpet-legend",
    title: "Carpet Cleaning Legend",
    blurb: "Completed all Floor Cleaning submodules",
    icon: "sparkles-outline",
    color: "#f1c40f",
  },
];

const LOCKED_BADGES = [
  {
    key: "training-marathon",
    title: "Training Marathon",
    blurb: "Complete all company training modules",
    icon: "trophy-outline",
    total: 50,
    current: 0,
  },
  {
    key: "duct-pro",
    title: "Duct Pro",
    blurb: "Finish Duct Cleaning module",
    icon: "leaf-outline",
    total: 1,
    current: 0,
  },
  {
    key: "flood-responder",
    title: "Flood Responder",
    blurb: "Finish Flood Restoration module",
    icon: "water-outline",
    total: 1,
    current: 0,
  },
  {
    key: "floor-complete",
    title: "Floor Finisher",
    blurb:
      "Finish all Floor Cleaning submodules (Residential, Commercial, Rugs, Stairs, Upholstery, Ceramic, Wood, Strip & Wax, Vinyl, Additional)",
    icon: "briefcase-outline",
    total: 10, // guess for now
    current: 0,
  },
  {
    key: "safety-star",
    title: "Safety Star",
    blurb: "Pass the Safety / OSHA module",
    icon: "shield-checkmark-outline",
    total: 1,
    current: 0,
  },
  {
    key: "equipment-ace",
    title: "Equipment Ace",
    blurb: "Complete Equipment module",
    icon: "construct-outline",
    total: 1,
    current: 0,
  },
];

export default function Badges() {
  const router = useRouter();

  const renderEarned = (badge) => (
    <View key={badge.key} style={styles.badgeCardEarned}>
      <View style={[styles.badgeIconWrap, { backgroundColor: badge.color }]}>
        <Ionicons name={badge.icon} size={24} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.badgeTitle}>{badge.title}</Text>
        <Text style={styles.badgeBlurb}>{badge.blurb}</Text>
      </View>
      <Ionicons name="checkmark-circle" size={22} color="#2ecc71" />
    </View>
  );

  const renderLocked = (badge) => {
    const pct =
      badge?.total && badge?.total > 0
        ? Math.min(100, Math.round((badge.current / badge.total) * 100))
        : 0;

    return (
      <View key={badge.key} style={styles.badgeCardLocked}>
        <View style={[styles.badgeIconWrap, styles.lockedIconWrap]}>
          <Ionicons name={badge.icon} size={24} color="#9aa3b2" />
        </View>
        <View style={{ flex: 1, opacity: 0.85 }}>
          <Text style={styles.badgeTitleLocked}>{badge.title}</Text>
          <Text style={styles.badgeBlurbLocked}>{badge.blurb}</Text>

          {badge.total ? (
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {badge.current}/{badge.total}
              </Text>
            </View>
          ) : null}
        </View>
        <Ionicons name="lock-closed-outline" size={20} color="#9aa3b2" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Logo Bar (EXACT like Profile/Training) */}
      <View style={styles.logoBar}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Longo%20Logo.png",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Page header */}
      <Text style={styles.header}>Badges & Achievements</Text>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110, paddingHorizontal: 12 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Earned section */}
        <Text style={styles.sectionHeading}>Your Badges</Text>
        <View style={{ gap: 10 }}>{EARNED_BADGES.map(renderEarned)}</View>

        {/* Locked section */}
        <Text style={[styles.sectionHeading, { marginTop: 16 }]}>Keep Going</Text>
        <View style={{ gap: 10 }}>{LOCKED_BADGES.map(renderLocked)}</View>
      </ScrollView>

      {/* Bottom Nav (EXACT like your other pages) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/quizzes")}>
          <Image
            source={{ uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/quizzes.png" }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Quizzes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/training")}>
          <Image
            source={{ uri: "https://github.com/Jkschlo/Longo_App/blob/main/training.JPG?raw=true" }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Training</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: "https://github.com/Jkschlo/Longo_App/blob/main/profile.JPG?raw=true" }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Page shell */
  container: { flex: 1, backgroundColor: "#093075" },

  /** EXACT top logo bar */
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

  /** Header (same format as other pages) */
  header: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 22,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },

  /** Section titles */
  sectionHeading: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    marginVertical: 8,
  },

  /** Earned badge card */
  badgeCardEarned: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badgeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTitle: { fontSize: 14, fontWeight: "800", color: "#111" },
  badgeBlurb: { fontSize: 12, color: "#444", marginTop: 3 },

  /** Locked badge card */
  badgeCardLocked: {
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ececec",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lockedIconWrap: {
    backgroundColor: "#e9edf3",
  },
  badgeTitleLocked: { fontSize: 14, fontWeight: "800", color: "#444" },
  badgeBlurbLocked: { fontSize: 12, color: "#666", marginTop: 3 },

  /** Progress bar for locked items */
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#e6e6e6",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#2f80ed" },
  progressText: { color: "#222", fontWeight: "700", fontSize: 11, width: 48, textAlign: "right" },

  /** Bottom nav (exact) */
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
