import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { saveProgress } from "../../../lib/progressHelper";

export default function ResidentialQuiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [saving, setSaving] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Timer
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const QUESTIONS = [
    {
      q: "What is the first action you should take when walking through a residential carpet cleaning job?",
      options: [
        "Check truck setup",
        "Explain expectations and identify special concerns",
        "Start pre-spraying traffic areas",
        "Turn on the Butler system",
      ],
      answer: 1,
    },
    {
      q: "What order should the Butler System switches be activated?",
      options: [
        "Speed Control → System → Water Pressure",
        "System → Water Pressure → Speed Control",
        "Water Pressure → System → Speed Control",
        "System → Speed Control → Water Pressure",
      ],
      answer: 1,
    },
    {
      q: "When cleaning residential carpet, what is the maximum PSI you should use?",
      options: ["300 PSI", "400 PSI", "500 PSI", "800 PSI"],
      answer: 2,
    },
    {
      q: "Why must pre-vacuuming always be completed before adding moisture?",
      options: [
        "It reduces static electricity",
        "It allows faster drying",
        "It removes 80% of dry soil, making cleaning more effective",
        "It helps the pre-spray stick better",
      ],
      answer: 2,
    },
    {
      q: "Which of these actions would cause damage or staining if skipped?",
      options: [
        "Performing dry strokes",
        "Blocking and tabbing furniture",
        "Applying carpet protector",
        "Using a CRB",
      ],
      answer: 1,
    },
    {
      q: "What is the purpose of a 'dry stroke' during steam cleaning?",
      options: [
        "Apply chemical evenly",
        "Remove remaining moisture and speed dry time by ~50%",
        "Extract pre-spray solution only",
        "Cool the carpet fibers",
      ],
      answer: 1,
    },
    {
      q: "After finishing, what should you communicate to the customer?",
      options: [
        "A reminder about the 100% satisfaction guarantee and request a Google review",
        "Ask them to move furniture back immediately",
        "Offer them a discount for the next job",
        "No communication is necessary after payment",
      ],
      answer: 0,
    },
  ];

  const handleSubmit = async () => {
    const total = QUESTIONS.length;
    let correct = 0;
    QUESTIONS.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    const result = Math.round((correct / total) * 100);
    setScore(result);
    setAttempts((a) => a + 1);
    setSubmitted(true);

    if (result >= 80) {
      Alert.alert("Excellent!", `You passed with a score of ${result}%.`);
    } else {
      Alert.alert("Try Again", `You scored ${result}%. You need at least 80% to pass.`);
    }

    try {
      setSaving(true);
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData?.user?.id;
      if (!user_id) throw new Error("User not authenticated");

      const { error } = await supabase.from("module_progress").upsert(
        [
          {
            user_id,
            module_key: "residential",
            time_spent: timeSpent,
            quiz_score: result,
            attempts: attempts + 1,
            status: result >= 80 ? "complete" : "in_progress",
            percent: result >= 80 ? 100 : 50,
            answers,
            completed_at: result >= 80 ? new Date().toISOString() : null,
          },
        ],
        { onConflict: ["user_id", "module_key"] }
      );

      if (error) throw error;

      if (result >= 80) {
        await saveProgress(user_id, "residential", {
          percent: 100,
          status: "complete",
          quiz_score: result,
          answers,
          completed_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("❌ Supabase Save Error:", err.message);
      Alert.alert("Save Error", "Could not save quiz results.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo bar */}
      <View style={styles.logoBar}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Jkschlo/Longo_App/main/Longo%20Logo.png",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.header}>Residential Carpet Cleaning Quiz</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}>
        {QUESTIONS.map((q, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.question}>{`${i + 1}. ${q.q}`}</Text>

            {q.options.map((opt, j) => {
              let optionStyle = styles.option;
              let textStyle = styles.optionText;

              if (submitted) {
                // --- Feedback Logic ---
                if (score < 80) {
                  // FAIL CASE: Show red for wrong, green only for ones they got right
                  if (answers[i] === j && j === q.answer) {
                    optionStyle = { ...styles.option, backgroundColor: "#4CAF50" };
                    textStyle = { ...styles.optionText, color: "#fff" };
                  } else if (answers[i] === j && j !== q.answer) {
                    optionStyle = { ...styles.option, backgroundColor: "#E74C3C" };
                    textStyle = { ...styles.optionText, color: "#fff" };
                  }
                } else {
                  // PASS CASE: Show green for correct, red for ones they missed
                  if (j === q.answer) {
                    optionStyle = { ...styles.option, backgroundColor: "#4CAF50" };
                    textStyle = { ...styles.optionText, color: "#fff" };
                  } else if (answers[i] === j && j !== q.answer) {
                    optionStyle = { ...styles.option, backgroundColor: "#E74C3C" };
                    textStyle = { ...styles.optionText, color: "#fff" };
                  }
                }
              } else if (answers[i] === j) {
                optionStyle = { ...styles.option, backgroundColor: "#093075" };
                textStyle = { ...styles.optionText, color: "#fff" };
              }

              return (
                <TouchableOpacity
                  key={j}
                  style={optionStyle}
                  onPress={() => !submitted && setAnswers({ ...answers, [i]: j })}
                >
                  <Text style={textStyle}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {!submitted ? (
          <TouchableOpacity
            style={[styles.submitBtn, saving && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={saving}
          >
            <Text style={styles.submitText}>
              {saving ? "Saving..." : "Submit Quiz"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resultBox}>
            <Text style={styles.scoreText}>
              {score >= 80 ? `You passed with ${score}%!` : `You failed with ${score}%`}
            </Text>
            <Text style={styles.attemptsText}>Attempts: {attempts}</Text>

            <TouchableOpacity
              style={[
                styles.retryBtn,
                { backgroundColor: score >= 80 ? "#093075" : "#E74C3C" },
              ]}
              onPress={() => {
                if (score >= 80) {
                  router.push("training/floor");
                } else {
                  // 👇 Route user back to Overview
                  router.push({
                    pathname: "training/floor/residentialModule",
                    params: { startAtOverview: true },
                  });
                }
              }}
            >
              <Text style={styles.retryText}>
                {score >= 80 ? "Return to Training" : "Review Module"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  logoBar: {
    height: 90,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
  },
  logo: { width: 140, height: 40 },
  header: {
    color: "#093075",
    fontWeight: "900",
    fontSize: 22,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  question: { fontSize: 15, fontWeight: "700", marginBottom: 8, color: "#000" },
  option: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#e6e6e6",
    marginBottom: 6,
    paddingHorizontal: 10,
  },
  optionText: { color: "#000", fontSize: 14 },
  submitBtn: {
    backgroundColor: "#093075",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
  resultBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginTop: 12,
  },
  scoreText: { fontSize: 18, fontWeight: "800", color: "#000" },
  attemptsText: { fontSize: 14, color: "#555", marginVertical: 6 },
  retryBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 10,
  },
  retryText: { color: "#fff", fontWeight: "800" },
});
