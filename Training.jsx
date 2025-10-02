import React from "react";
import { View, Text, Image, StyleSheet, Pressable, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const TRAINING_MODULES = [
  { key: "floor",   label: "Floor Cleaning",    image: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Vacuum.JPG",       progress: 85, route: "/floorCleaning" },
  { key: "duct",    label: "Duct Cleaning",     image: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/duct.JPG",         progress: 100, route: "/ductCleaning" },
  { key: "flood",   label: "Flood Restoration", image: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/flood.JPG",        progress: 60, route: "/floodRestoration" },
  { key: "truck",   label: "Truck Maintenance", image: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/truck.JPG",        progress: 90, route: "/truckMaintenance" },
  { key: "safety",  label: "Safety / OSHA",     image: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/safetyvest.JPG",   progress: 0,  route: "/safety" },
  { key: "equip",   label: "Equipment",         image: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Fan.JPG",          progress: 75, route: "/equipment" },
];

export default function Training() {
  const router = useRouter();

  const renderItem = ({ item }) => {
    const pct = Math.max(0, Math.min(100, item.progress ?? 0));
    return (
      <Pressable style={styles.card} onPress={() => router.push(item.route)}>
        <Image source={{ uri: item.image }} style={styles.cardImg} resizeMode="contain" />
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
      {/* Top Logo Bar (white) */}
      <View style={styles.logoBar}>
        <Image
          source={{ uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Longo%20Logo.png" }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Header (white text, no back arrow on Training) */}
      <Text style={styles.header}>My Training</Text>

      {/* Scrollable grid */}
      <FlatList
        data={TRAINING_MODULES}
        renderItem={renderItem}
        keyExtractor={(i) => i.key}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
        // extra bottom padding so content doesn't sit under the nav bar
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 100, gap: 12 }}
      />

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/")}>
          <Image
            source={{ uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/home.JPG" }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/Training")}>
          <Image
            source={{ uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/training.JPG" }}
            style={styles.navIcon}
          />
          <Text style={[styles.navText, styles.navTextActive]}>Training</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/profile.JPG" }}
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
  container: { flex: 1, backgroundColor: "#093075" }, // dark blue
  logoBar: {
    height: 64,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 180, height: 60 },

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
  cardImg: { width: "100%", height: 90, borderRadius: 8, marginBottom: 8, backgroundColor: "#fff" },
  cardLabel: { fontSize: 14, fontWeight: "700", marginBottom: 8 },

  progressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#e6e6e6",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#2f80ed" },
  percentText: { fontSize: 12, fontWeight: "700", color: "#000", width: 38, textAlign: "right" },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: { alignItems: "center" },
  navIcon: { width: 24, height: 24, marginBottom: 4, resizeMode: "contain" },
  navText: { fontSize: 12, fontWeight: "600", color: "#333" },
  navTextActive: { color: "#093075", fontWeight: "800" },
});
