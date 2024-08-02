// vitest.config.ts
import react from "@vitejs/plugin-react";
import path from "path";
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("pdfjs-dist")) {
            return "pdfjs-dist";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "pdfjs-dist/build/pdf.worker.js": path.resolve(
        __dirname,
        "node_modules/pdfjs-dist/build/pdf.worker.entry.js"
      ),
    },
  },
});
