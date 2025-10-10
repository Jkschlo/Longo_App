// app/floorCleaning.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

const SUBMODULES = [
  { key: "residential", label: "Residential", route: "/residential", img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Vacuum.JPG" },
  { key: "commercial", label: "Commercial", route: "/commercial", img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/spinner.JPG" },
  { key: "rugs", label: "Area Rugs", route: "/areaRugs", img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/arearug.JPG" },
  { key: "stairs", label: "Stairs", route: "/stairs", img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/stairs.JPG" },
  { key: "upholstery", label: "Upholstery", route: "/upholstery", img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/upholstery.JPG" },
  { key: "ceramic", label: "Ceramic Flooring", route: "/ceramic", img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/ceramic.JPG" },
  { key: "wood", label: "Wood Flooring", route: "/wood", img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/wood.JPG" },
  { key: "stripwax", label: "Strip & Wax", route: "/stripWax", img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/strip.JPG" },
  { key: "vinyl", label: "Vinyl", route: "/vinyl", img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/vinyl.JPG" },
  { key: "additional", label: "Additional Services", route: "/additional", img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/additional.JPG" },
];

export default function FloorCleaning() {
  const router = useRouter();
  const [progressMap, setProgressMap] = useState({});

  // STABLE list of keys (won't change between renders)
  const keys = useMemo(() => SUBMODULES.map((m) => m.key), []);

  // STABLE loader using the stable keys
  const loadProgress = useCallback(async () => {
    try {
      const map = await getProgressBulk(keys);
      // Only update state if something actually changed
      setProgressMap((prev) => {
        let changed = false;
        for (const k of keys) {
          const a = prev[k]?.percent ?? 0;
          const b = map[k]?.percent ?? 0;
          const as = prev[k]?.status ?? "not_started";
          const bs = map[k]?.status ?? "not_started";
          if (a !== b || as !== bs) {
            changed = true;
            break;
          }
        }
        return changed ? map : prev;
      });
    } catch {
      // fallback defaults on error
      const fallback = {};
      keys.forEach((k) => (fallback[k] = { percent: 0, status: "not_started" }));
      setProgressMap(fallback);
    }
  }, [keys]);

  // Load once on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Refresh when returning to this screen
  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  const renderItem = ({ item }) => {
    const pct = Math.max(0, Math.min(100, progressMap[item.key]?.percent ?? 0));
    return (
      <Pressable style={styles.card} onPress={() => router.push(item.route)}>
        <Image source={{ uri: item.img }} style={styles.cardImg} resizeMode="contain" />
        <Text style={styles.cardLabel}>{item.label}</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.percentText}>{pct}%</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Logo Bar (exact) */}
      <View style={styles.logoBar}>
        <Image
          source={{ uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Longo%20Logo.png" }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Header with optional back link */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.push("/training")} hitSlop={12}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Floor Cleaning</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Grid of submodules */}
      <FlatList
        data={SUBMODULES}
        renderItem={renderItem}
        keyExtractor={(i) => i.key}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 12, gap: 12 }}
      />

      {/* Bottom Nav (exact) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/quizzes")}>
          <Image source={{ uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/quizzes.png" }} style={styles.navIcon} />
          <Text style={styles.navText}>Quizzes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/training")}>
          <Image source={{ uri: "https://github.com/Jkschlo/Longo_App/blob/main/training.JPG?raw=true" }} style={styles.navIcon} />
          <Text style={styles.navText}>Training</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/profile")}>
          <Image source={{ uri: "https://github.com/Jkschlo/Longo_App/blob/main/profile.JPG?raw=true" }} style={styles.navIcon} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CARD_W = "48%";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#093075" },
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  backText: { fontSize: 16, fontWeight: "700", width: 60, color: "#fff" },
  title: { fontSize: 20, fontWeight: "800", textAlign: "center", flex: 1, color: "#fff" },

  card: {
    width: CARD_W,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 10,
    overflow: "hidden",
  },
  cardImg: { width: "100%", height: 90, borderRadius: 8, marginBottom: 8, backgroundColor: "#fff" },
  cardLabel: { fontSize: 14, textAlign: "center", fontWeight: "700", marginBottom: 8 },

  progressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressTrack: { flex: 1, height: 8, backgroundColor: "#e6e6e6", borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#2f80ed" },
  percentText: { fontSize: 12, fontWeight: "700", color: "#000", width: 38, textAlign: "right" },

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
