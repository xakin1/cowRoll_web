import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@i18n": path.resolve(__dirname, "./src/i18n/i18n.ts"),
    },
  },
});
