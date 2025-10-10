import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: sess } = await supabase.auth.getSession();
        const user = sess?.session?.user || null;

        if (user) {
          const { data: row, error } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .maybeSingle();

          if (!error && row?.full_name && mounted) {
            setFullName(String(row.full_name).trim());
            return;
          }
        }

        // Fallback: local cache
        const json = await AsyncStorage.getItem("userProfile");
        if (mounted && json) {
          try {
            const data = JSON.parse(json);
            if (data?.name) setFullName(String(data.name).trim());
          } catch {}
        }
      } catch {
        const json = await AsyncStorage.getItem("userProfile");
        if (mounted && json) {
          try {
            const data = JSON.parse(json);
            if (data?.name) setFullName(String(data.name).trim());
          } catch {}
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const openReviews = async () => {
    const url = "https://www.google.com/search?q=Longo+Carpet+Cleaning+reviews";
    const ok = await Linking.canOpenURL(url);
    if (ok) Linking.openURL(url);
    else Alert.alert("Unable to open link", "Please try again later.");
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

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        {/* Avatar circle (generic icon) */}
        <View style={styles.avatarCircle}>
          <Ionicons name="person-circle-outline" size={92} color="#9aa3b2" />
        </View>

        <Text style={styles.nameText}>{fullName || " "}</Text>
        <Text style={styles.roleText}>Technician</Text>

        {/* Cards */}
        <View style={styles.cardsGrid}>
          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={openReviews}>
            <Ionicons name="star-outline" size={22} />
            <Text style={styles.cardTitle}>Google Reviews</Text>
            <Text style={styles.cardSub}>Rate us / read reviews</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => router.push("/badges")}>
            <Ionicons name="medal-outline" size={22} />
            <Text style={styles.cardTitle}>Badges</Text>
            <Text style={styles.cardSub}>Earn & view progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => router.push("/handbook")}>
            <Ionicons name="book-outline" size={22} />
            <Text style={styles.cardTitle}>Company Handbook</Text>
            <Text style={styles.cardSub}>Policies & procedures</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => router.push("/faqs")}>
            <Ionicons name="help-circle-outline" size={22} />
            <Text style={styles.cardTitle}>FAQs</Text>
            <Text style={styles.cardSub}>Quick answers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => router.push("/settings")}>
            <Ionicons name="settings-outline" size={22} />
            <Text style={styles.cardTitle}>Settings</Text>
            <Text style={styles.cardSub}>Update preferences</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav (exact) */}
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
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: "#fff",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e7eef8",
    marginTop: 16,
  },
  nameText: { fontSize: 20, fontWeight: "800", color: "#fff", textAlign: "center", marginTop: 12 },
  roleText: { fontSize: 12, color: "#cfe2ff", textAlign: "center", marginTop: 4, opacity: 0.9 },
  cardsGrid: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 12,
  },
  card: {
    width: CARD_W,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  cardTitle: { fontSize: 14, fontWeight: "800", color: "#000", marginTop: 8, textAlign: "center" },
  cardSub: { fontSize: 11, marginTop: 4, opacity: 0.7, textAlign: "center" },
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
