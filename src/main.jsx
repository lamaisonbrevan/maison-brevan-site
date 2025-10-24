// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";      // tu peux mettre .jsx pour être explicite
import "./index.css";             // ✅ charge Tailwind et tes styles globaux

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
