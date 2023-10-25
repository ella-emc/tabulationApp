import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    plugins: [
      nodePolyfills(),
    ],
  }
});