import React from "react";
import { View, Text, Pressable, Image, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";

const SUBMODULES = [
  { key: "residential", label: "Residential", route: "/residential", img: "https://placehold.co/160x100?text=Residential" },
  { key: "commercial", label: "Commercial", route: "/commercial", img: "https://placehold.co/160x100?text=Commercial" },
  { key: "rugs", label: "Area Rugs", route: "/areaRugs", img: "https://placehold.co/160x100?text=Rugs" },
  { key: "stairs", label: "Stairs", route: "/stairs", img: "https://placehold.co/160x100?text=Stairs" },
  { key: "upholstery", label: "Upholstery", route: "/upholstery", img: "https://placehold.co/160x100?text=Upholstery" },
  { key: "ceramic", label: "Ceramic Flooring", route: "/ceramic", img: "https://placehold.co/160x100?text=Ceramic" },
  { key: "wood", label: "Wood Flooring", route: "/wood", img: "https://placehold.co/160x100?text=Wood" },
  { key: "stripwax", label: "Strip & Wax", route: "/stripWax", img: "https://placehold.co/160x100?text=Strip+%26+Wax" },
  { key: "vinyl", label: "Vinyl", route: "/vinyl", img: "https://placehold.co/160x100?text=Vinyl" },
  { key: "additional", label: "Additional Services", route: "/additional", img: "https://placehold.co/160x100?text=Additional" },
];

export default function FloorCleaning() {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <Pressable style={styles.card} onPress={() => router.push(item.route)}>
      <Image source={{ uri: item.img }} style={styles.cardImg} />
      <Text style={styles.cardLabel}>{item.label}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: "10%" }]} />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Top Logo Bar */}
      <View style={styles.logoBar}>
        <Image
          source={{ uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Longo%20Logo.png" }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Header with back arrow (requested on all pages except Home/Training/Profile) */}
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
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 12, gap: 12 }}
      />
    </View>
  );
}

const CARD_W = "48%";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#093075" },
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
  backText: { fontSize: 16, fontWeight: "700", width: 60 },
  title: { fontSize: 20, fontWeight: "800", textAlign: "center", flex: 1 },
  card: {
    width: CARD_W,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 10,
  },
  cardImg: { width: "100%", height: 100, borderRadius: 8, marginBottom: 8 },
  cardLabel: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  progressTrack: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#2f80ed" },
});
