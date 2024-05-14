// vitest.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    // Configuraciones de test, por ejemplo:
    setupFiles: ["tests/setup.ts"],
    globals: true,
    environment: "happy-dom",
  },
  build: {
    sourcemap: true,
  },
});
