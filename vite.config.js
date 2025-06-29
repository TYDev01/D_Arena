import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // root: "client", // frontend source directory
  base: "/",
  build: {
    outDir: "/src/dist",
    emptyOutDir: true,
  },
  plugins: [
    react(),
    tailwindcss({
      config: "./tailwind.config.js", // Explicit path to config
    }),
  ],
  server: {
    historyApiFallback: true,
  },
});
