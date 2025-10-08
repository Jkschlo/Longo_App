import React from "react";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

const Home = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Logo Box */}
      <View style={styles.topBox}>
        <Image
          source={{
            uri: "https://github.com/Jkschlo/Longo_App/blob/main/Longo Logo.png?raw=true",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Header */}
      <Text style={styles.header}>Quizzes</Text>

      {/* Main Content Placeholder */}
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Quizzes coming soon.</Text>
      </View>

      {/* Bottom Nav */}
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
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#093075" },
  topBox: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 10,
  },
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
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#fff", fontSize: 18 },
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
