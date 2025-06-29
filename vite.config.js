import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: "src/client", // frontend source directory
  build: {
    outDir: path.resolve(__dirname, "dist"),
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
