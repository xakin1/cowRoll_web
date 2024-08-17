import react from "@astrojs/react";
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  i18n: {
    defaultLocale: "gl",
    locales: ["es", "en", "gl"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  devToolbar: {
    enabled: false
  },
  adapter: node({
    mode: "standalone"
  })
});