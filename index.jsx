import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { getProgressBulk } from "../../lib/progressHelper"; // ✅ added import

const TRAINING_MODULES = [
  {
    key: "floor",
    label: "Floor Cleaning",
    image:
      "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Vacuum.JPG",
    route: "/training/floor",
  },
  {
    key: "duct",
    label: "Duct Cleaning",
    image: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/duct.JPG",
    route: "/training/duct",
  },
  {
    key: "flood",
    label: "Flood Restoration",
    image: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/flood.JPG",
    route: "/training/flood",
  },
  {
    key: "truck",
    label: "Truck Maintenance",
    image: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/truck.JPG",
    route: "/training/truck",
  },
  {
    key: "safety",
    label: "Safety / OSHA",
    image:
      "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/safetyvest.JPG",
    route: "/training/safety",
  },
  {
    key: "equip",
    label: "Equipment",
    image:
      "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/airmover.JPG",
    route: "/training/equipment",
  },
];

export default function Training() {
  const router = useRouter();
  const [progressMap, setProgressMap] = useState({});
  const [firstName, setFirstName] = useState("");

  // ✅ Custom progress loader (adds Floor Cleaning calculation)
  const loadProgress = useCallback(async () => {
    try {
      const { data: sess } = await supabase.auth.getSession();
      const user = sess?.session?.user || null;
      if (!user) return;

      // Floor Cleaning submodules (10 total)
      const floorModules = [
        "residential",
        "commercial",
        "rugs",
        "stairs",
        "upholstery",
        "ceramic",
        "wood",
        "stripwax",
        "vinyl",
        "additional",
      ];

      const floorMap = await getProgressBulk(floorModules, user.id);
      const percents = floorModules.map((k) => floorMap[k]?.percent ?? 0);
      const floorAvg = percents.reduce((a, b) => a + b, 0) / floorModules.length;

      // Combine with any other existing progress
      const map = {
        floor: { percent: Math.round(floorAvg) },
        duct: { percent: 0 },
        flood: { percent: 0 },
        truck: { percent: 0 },
        safety: { percent: 0 },
        equip: { percent: 0 },
      };

      setProgressMap(map);
    } catch (err) {
      console.warn("Error loading progress:", err.message);
    }
  }, []);

  // Helper to derive first name
  const deriveFirst = (full) => {
    if (!full) return "";
    const parts = String(full).trim().split(/\s+/).filter(Boolean);
    return parts[0] || "";
  };

  // Load user’s first name
  const loadFirstName = useCallback(async () => {
    try {
      const { data: sess } = await supabase.auth.getSession();
      const user = sess?.session?.user || null;

      if (user) {
        const { data: row, error } = await supabase
          .from("profiles")
          .select("first_name, full_name")
          .eq("id", user.id)
          .maybeSingle();

        if (!error && row) {
          const chosen = row.first_name?.trim() || deriveFirst(row.full_name);
          if (chosen) {
            setFirstName(chosen);
            return;
          }
        }
      }

      const json = await AsyncStorage.getItem("userProfile");
      if (json) {
        const data = JSON.parse(json);
        const chosen = deriveFirst(data?.name);
        if (chosen) setFirstName(chosen);
      }
    } catch {
      const json = await AsyncStorage.getItem("userProfile");
      if (json) {
        const data = JSON.parse(json);
        const chosen = deriveFirst(data?.name);
        if (chosen) setFirstName(chosen);
      }
    }
  }, []);

  useEffect(() => {
    loadProgress();
    loadFirstName();
  }, [loadProgress, loadFirstName]);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
      loadFirstName();
    }, [loadProgress, loadFirstName])
  );

  const renderItem = ({ item }) => {
    const pct = Math.max(0, Math.min(100, progressMap[item.key]?.percent ?? 0));
    return (
      <Pressable style={styles.card} onPress={() => router.push(item.route)}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImg}
          resizeMode="contain"
        />
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

  const possessive = firstName
    ? /s$/i.test(firstName)
      ? `${firstName}'`
      : `${firstName}'s`
    : null;

  const headerText = possessive ? `${possessive} Training` : "My Training";

  return (
    <View style={styles.container}>
      {/* Top Logo Bar */}
      <View style={styles.logoBar}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Longo%20Logo.png",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.header}>{headerText}</Text>

      <FlatList
        data={TRAINING_MODULES}
        renderItem={renderItem}
        keyExtractor={(i) => i.key}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 100, gap: 12 }}
      />

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/badges")}
        >
          <Ionicons name="medal-outline" size={24} color="#000" />
          <Text style={styles.navText}>Badges</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/training")}
        >
          <Image
            source={{
              uri: "https://github.com/Jkschlo/Longo_App/blob/main/training.JPG?raw=true",
            }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Training</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
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

const CARD_W = "48%";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#093075" },
  logoBar: {
    height: 90,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
  },
  logo: { width: 140, height: 40 },
  header: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 22,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  card: {
    width: CARD_W,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 10,
  },
  cardImg: {
    width: "75%",
    height: 90,
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  cardLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#e6e6e6",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#2f80ed" },
  percentText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    width: 38,
    textAlign: "right",
  },
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
