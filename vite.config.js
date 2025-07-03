import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
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
