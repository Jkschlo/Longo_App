import React from "react";
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

const SUBMODULES = [
  {
    key: "duct-cleaning-process",
    label: "Basic Process",
    route: "/ductCleaningProcess",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/duct.JPG",
    progress: 40,
  },
  {
    key: "dryer-exhaust",
    label: "Dryer Exhaust",
    route: "/dryerExhaust",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/dryer.JPG",
    progress: 70,
  },
  {
    key: "kitchen-exhaust",
    label: "Kitchen Exhaust",
    route: "/kitchenExhaust",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/kitchen.JPG",
    progress: 20,
  },
  {
    key: "bathroom-exhaust",
    label: "Bathroom Exhaust",
    route: "/bathroomExhaust",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/bathroom.JPG",
    progress: 55,
  },
  {
    key: "additional-services",
    label: "Additional Services",
    route: "/additionalServices",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/additional.JPG",
    progress: 10,
  },
  {
    key: "equipment",
    label: "Equipment",
    route: "/equipment",
    img: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/dehu.JPG",
    progress: 0,
  },
];

export default function DuctCleaning() {
  const router = useRouter();

  const renderItem = ({ item }) => {
    const pct = Math.max(0, Math.min(100, item.progress ?? 0));
    return (
      <Pressable style={styles.card} onPress={() => router.push(item.route)}>
        <Image
          source={{ uri: item.img }}
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

  return (
    <View style={styles.container}>
      {/* Top Logo Bar */}
      <View style={styles.logoBar}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Affordable%20Duct%20cleaning%20logo.png",
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
        <Text style={styles.title}>Duct Cleaning</Text>
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

      {/* Bottom Nav (same as Training) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/quizzes")}
        >
          <Image
            source={{
              uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/quizzes.png",
            }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Quizzes</Text>
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
  container: { flex: 1, backgroundColor: "#FF8F35" },
  logoBar: {
    height: 90,
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    borderBottomColor: "#eee",
    justifyContent: "flex-end", // push content to the bottom
    alignItems: "center", // center horizontally
    paddingBottom: 8, // tweak spacing from bottom as needed
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

  card: {
    width: CARD_W,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 10,
    overflow: "hidden",
  },
  cardImg: {
    width: "75%",
    height: 90,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  cardLabel: {
    fontSize: 14,
    textAlign: "center",
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
