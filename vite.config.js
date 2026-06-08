import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Your GitHub Pages URL: https://epse-2021.github.io/EPSE-Thrive/
// REPO_NAME must exactly match your repository name on GitHub.
const REPO_NAME = "/EPSE-Thrive/";

export default defineConfig(({ command }) => ({
  base: command === "build" ? REPO_NAME : "/",

  plugins: [react()],

  server: {
    port: 3000,
    open: true,
    strictPort: false,
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
}));
