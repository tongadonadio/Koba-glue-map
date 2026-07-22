import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { KobaGlueMapHeroUIProvider } from "@/components/providers";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KobaGlueMapHeroUIProvider>
      <App />
    </KobaGlueMapHeroUIProvider>
  </StrictMode>
);
