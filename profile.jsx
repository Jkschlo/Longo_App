import React from "react";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

const Profile = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Logo Box */}
      <View style={styles.topBox}>
        <Image
          source={{ uri: "https://github.com/Jkschlo/Longo_App/blob/main/Longo Logo.png?raw=true" }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Header */}
      <Text style={styles.header}>Joe Longo</Text>

      {/* Circular Profile Picture */}
      <View style={styles.profilePicContainer}>
        <Image
          source={{ uri: "https://github.com/Jkschlo/Longo_App/blob/main/Joe.JPG?raw=true" }}
          style={styles.profilePic}
        />
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/")}>
          <Image
            source={{ uri: "https://github.com/Jkschlo/Longo_App/blob/main/home.JPG?raw=true" }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/Training")}>
          <Image
            source={{ uri: "https://github.com/Jkschlo/Longo_App/blob/main/training.JPG?raw=true" }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Training</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/Profile")}>
          <Image
            source={{ uri: "https://github.com/Jkschlo/Longo_App/blob/main/profile.JPG?raw=true" }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#093075" },
  topBox: { backgroundColor: "#fff", alignItems: "center", paddingVertical: 10 },
  logo: { width: 180, height: 60 },
  header: { color: "#fff", fontWeight: "bold", fontSize: 25, textAlign: "center", marginVertical: 15 },
  profilePicContainer: { alignItems: "center", marginVertical: 20 },
  profilePic: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: "#fff" },
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 70, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1, borderTopColor: "#ddd" },
  navItem: { alignItems: "center" },
  navIcon: { width: 24, height: 24, marginBottom: 4 },
  navText: { fontSize: 12, fontWeight: "600" },
});
