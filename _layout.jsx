// app/_layout.jsx
import React from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}
