// app/index.jsx
import { Redirect } from "expo-router";

export default function Index() {
  // decide where you want the very first screen to be:
  // return <Redirect href="/training" />; // <- if you want to land on training
  return <Redirect href="/login" />;        // <- if you want to land on login
}
