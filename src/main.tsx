import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/style.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/custom/ThemeProvider.tsx";

// --- PWA Service Worker Registration ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => {})
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// ----------------------------------------
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
