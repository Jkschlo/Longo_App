import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { saveProgress } from "../../../lib/progressHelper";

export default function ResidentialModule() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [userId, setUserId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [timeSpent, setTimeSpent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const moduleKey = "residential";

  // --- Load user ID ---
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  // --- Timer ---
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Handle quiz redirect param ---
  useEffect(() => {
    if (params?.startAtOverview) setCurrentIndex(-1);
  }, [params]);

  // --- Animation ---
  const animateIn = () => {
    fadeAnim.setValue(0);
    translateY.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };
  useEffect(() => {
    animateIn();
  }, [currentIndex]);

  // --- Section Data ---
  const sections = [
    {
      title: "1. Initial Walkthrough",
      body: `Begin every residential carpet cleaning job with a professional walkthrough. Start at the furthest point of the home and move systematically toward your exit. During this time, explain to the customer what they can expect to hear, see, and smell throughout the process. Take a moment to address any questions about moving furniture, handling specific stains or spots, and any pets or children that might be nearby. This is your opportunity to set clear expectations and build confidence with the homeowner.`,
      media: [
        {
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/walkthrough1.jpg",
          caption: "Example — Walking through the home with the customer",
        },
        {
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/walkthrough2.jpg",
          caption: "Demonstrating a pre-inspection of carpets and furniture",
        },
      ],
    },
    {
      title: "2. Setting up the Truck (Butler System)",
      body: `After completing the walkthrough, it’s time to prepare your Butler truck mount system. Start by pulling the vacuum hose first and running it to the furthest point inside the home. This ensures the system is ready to clean efficiently from back to front. Always connect your cleaning tool before turning the machine on.\n\nWhen starting the Butler, make sure the emergency brake is set, the A/C and heat are off, and the truck is in park. Then follow the proper order: engage the System switch, turn on the Water Pressure, and adjust the Speed Control.\n\nInside the Butler, set your heat and pressure levels according to the job. For most residential carpets, stay between 400–600 PSI (never exceeding 600). Proper setup ensures steady pressure, consistent heat, and a professional clean from start to finish.`,
      media: [
        {
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/trucksetup1.jpg",
          caption: "Demo — Connecting hoses and preparing the Butler System",
        },
        {
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/trucksetup2.jpg",
          caption: "Truck-mounted unit — operator starting the cleaning sequence",
        },
      ],
    },
    {
      title: "3. The Cleaning Process",
      body: `The cleaning process has several key stages that determine your results and customer satisfaction.\n\nStart with a thorough pre-vacuum before introducing any moisture — around 80% of soil in carpets is dry and can be removed at this stage.\n\nNext, apply your pre-spray:\n• Maintenance cleaning — Ultrapac Trafficlean, 4–6 oz per gallon.\n• Restoration cleaning — Powerburst, 1–2 scoops per gallon.\nApply evenly about 1.5 feet from the ground, avoiding overspray on walls and furniture.\n\nAgitate to activate the cleaning agents — a CRB (BrushPro) is ideal for large open areas, while a hand brush works best for corners and stairs.\n\nDuring steam cleaning, keep the wand trigger engaged as you pull back, extracting soil directly to the van. Use overlapping strokes in a consistent pattern. Maintain good form — knees bent, back straight — to prevent strain and ensure even coverage.\n\nFinish with dry strokes (no trigger). This cuts drying time by up to 50% and leaves a cleaner, more uniform finish.`,
      media: [
        {
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/carpet%20cleaning1.jpeg",
          caption: "Proper wand technique and cleaning strokes",
        },
        {
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/carpet%20cleaning2.jpeg",
          caption: "Even overlapping during extraction",
        },
      ],
    },
    {
      title: "4. Breaking Down the Truck",
      body: `Once cleaning is complete, confirm that the customer is satisfied before beginning your breakdown. Start by wrapping up the vacuum hose first — this prevents tangles and keeps the area neat. Then wipe down the steam line with a damp rag before storage.\n\nBefore leaving, inspect your Butler system and tools. Ensure everything is properly secured and ready for the next job.`,
      media: [
        {
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/breakdown1.jpg",
          caption: "Technician disconnecting hoses safely",
        },
        {
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/breakdown2.jpg",
          caption: "Proper hose storage inside Butler System compartment",
        },
      ],
    },
    {
      title: "5. Wrapping Up",
      body: `Finish every job by confirming the customer’s satisfaction with the results. Collect payment — cash, check, or card — and explain Longo’s 100% satisfaction guarantee.\n\nEncourage a Google review if they’re happy with the service, and leave a business card for future cleanings or referrals. This final step leaves a strong, professional impression and reinforces trust with the customer.`,
      media: [
        {
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/wrapup1.jpg",
          caption: "Customer walkthrough and satisfaction check",
        },
        {
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/wrapup2.jpg",
          caption: "Technician wrapping up tools and preparing to depart",
        },
      ],
    },
  ];

  const handleNext = async () => {
    if (currentIndex + 1 < sections.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (userId) {
        const percent = Math.round(((nextIndex + 1) / sections.length) * 80);
        await saveProgress(userId, moduleKey, {
          percent,
          status: "in_progress",
          time_spent: timeSpent,
        });
      }
    } else {
      if (userId) {
        await saveProgress(userId, moduleKey, {
          percent: 90,
          status: "ready_for_quiz",
          time_spent: timeSpent,
        });
      }
      router.push("./residentialQuiz");
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) setCurrentIndex(-1);
    else setCurrentIndex((i) => i - 1);
  };

  const renderOverview = () => (
    <Animated.View
      style={[styles.card, { opacity: fadeAnim, transform: [{ translateY }] }]}
    >
      <Image
        source={{
          uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/residential_overview.jpg",
        }}
        style={styles.overviewImage}
        resizeMode="cover"
      />
      <Text style={styles.overviewTitle}>Overview</Text>
      <Text style={styles.overviewText}>
        This module provides a complete, step-by-step guide to residential
        carpet cleaning. You’ll learn how to conduct a professional walkthrough,
        set up the Butler system, execute a full cleaning process, and close
        each job with excellence. Move through the five sections in order, then
        complete the quiz at the end to test your knowledge.
      </Text>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => setCurrentIndex(0)}
        activeOpacity={0.85}
      >
        <Text style={styles.startButtonText}>Start Module</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSection = (section, index) => (
    <Animated.View
      key={index}
      style={[styles.sectionContainer, { opacity: fadeAnim, transform: [{ translateY }] }]}
    >
      <View style={styles.sectionHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.sectionHeaderText}>
          Section {index + 1} of {sections.length}
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionText}>{section.body}</Text>

        {section.media?.map((m, idx) => (
          <View key={idx} style={{ marginTop: 12 }}>
            <Image source={{ uri: m.uri }} style={styles.image} resizeMode="contain" />
            {m.caption && <Text style={styles.caption}>{m.caption}</Text>}
          </View>
        ))}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {index + 1 === sections.length ? "Start Quiz" : "Next Section"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </Animated.View>
  );

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

      {/* Header Row with Back Button */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.push("/training")} hitSlop={12}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Residential Carpet Cleaning</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>
        {currentIndex === -1
          ? renderOverview()
          : renderSection(sections[currentIndex], currentIndex)}
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/badges")}>
          <Ionicons name="medal-outline" size={24} color="#000" />
          <Text style={styles.navText}>Badges</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/training")}>
          <Image
            source={{
              uri: "https://github.com/Jkschlo/Longo_App/blob/main/training.JPG?raw=true",
            }}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Training</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/profile")}>
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

// ---- Styles ----
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

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#f7f8fa",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    backgroundColor: "#e6e6e6",
    marginBottom: 14,
  },
  overviewTitle: { fontSize: 18, fontWeight: "800", color: "#000" },
  overviewText: { fontSize: 14, color: "#333", marginVertical: 12, lineHeight: 20 },
  startButton: {
    backgroundColor: "#093075",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  startButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  sectionContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#093075",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sectionHeaderText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  backButton: { paddingRight: 6 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#000", marginBottom: 10 },
  sectionText: { fontSize: 14, color: "#333", lineHeight: 20 },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  caption: { textAlign: "center", fontSize: 12, color: "#666", marginTop: 4 },
  nextButton: {
    backgroundColor: "#093075",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
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
