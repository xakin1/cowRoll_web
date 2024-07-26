import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  i18n: {
    defaultLocale: "gl",
    locales: ["es", "en", "gl"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  devToolbar: {
    enabled: false,
  },
});
