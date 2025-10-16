// app/_layout.jsx
import React from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message"; // ✅ Import Toast provider

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
      {/* ✅ Global Toast component (must be outside Slot) */}
      <Toast />
    </>
  );
}
