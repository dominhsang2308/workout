import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Register PWA Service Worker for Mobile App experience
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("FITBABE PWA Service Worker active:", reg.scope);
      })
      .catch((err) => {
        console.warn("FITBABE PWA Service Worker failed:", err);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
