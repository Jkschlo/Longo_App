import React from "react";
import { View, Text, Pressable, Image, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";

const SUBMODULES = [
  {
    key: "residential",
    label: "Residential",
    route: "/residential",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/residential.JPG",
    progress: 40, // ← update these as you complete content
  },
  {
    key: "commercial",
    label: "Commercial",
    route: "/commercial",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/commercial.JPG",
    progress: 70,
  },
  {
    key: "rugs",
    label: "Area Rugs",
    route: "/areaRugs",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/arearug.JPG",
    progress: 20,
  },
  {
    key: "stairs",
    label: "Stairs",
    route: "/stairs",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/stairs.JPG",
    progress: 55,
  },
  {
    key: "upholstery",
    label: "Upholstery",
    route: "/upholstery",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/upholstery.JPG",
    progress: 10,
  },
  {
    key: "ceramic",
    label: "Ceramic Flooring",
    route: "/ceramic",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/ceramic.JPG",
    progress: 0,
  },
  {
    key: "wood",
    label: "Wood Flooring",
    route: "/wood",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/wood.JPG",
    progress: 15,
  },
  {
    key: "stripwax",
    label: "Strip & Wax",
    route: "/stripWax",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/strip.JPG",
    progress: 35,
  },
  {
    key: "vinyl",
    label: "Vinyl",
    route: "/vinyl",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/vinyl.JPG",
    progress: 80,
  },
  {
    key: "additional",
    label: "Additional Services",
    route: "/additional",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/additional.JPG",
    progress: 5,
  },
];

export default function Safety() {
  const router = useRouter();

  const renderItem = ({ item }) => {
    const pct = Math.max(0, Math.min(100, item.progress ?? 0)); // clamp 0-100
    return (
      <Pressable style={styles.card} onPress={() => router.push(item.route)}>
        {/* Image shows entire picture (contain) and is a bit shorter */}
        <Image source={{ uri: item.img }} style={styles.cardImg} resizeMode="contain" />

        <Text style={styles.cardLabel}>{item.label}</Text>

        {/* Progress row: bar + percentage */}
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

      {/* Header with back arrow */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.push("/training")} hitSlop={12}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Safety/OSHA</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Grid of submodules */}
      <FlatList
        data={SUBMODULES}
        renderItem={renderItem}
        keyExtractor={(i) => i.key}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 12, gap: 12 }}
      />
    </View>
  );
}

const CARD_W = "48%";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#093075" }, // dark blue background
  logoBar: {
    height: 64,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
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
  // ↓ Shorter height + 'contain' in Image so full picture fits
  cardImg: { width: "100%", height: 90, borderRadius: 8, marginBottom: 8, backgroundColor: "#fff" },

  cardLabel: { fontSize: 14, textAlign: "center", fontWeight: "700", marginBottom: 8 },

  // Row to place bar and percent side by side
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
});
