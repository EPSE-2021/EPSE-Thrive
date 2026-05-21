import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ─────────────────────────────────────────────────────────────
// GITHUB PAGES SETUP — change REPO_NAME to match your repo.
//
//   Your repo URL:  https://github.com/YOUR_NAME/econnect-youth
//   Set REPO_NAME:  "/econnect-youth"
//
//   Using a custom domain (e.g. econnectyouth.org)?
//   Set REPO_NAME:  "/"
// ─────────────────────────────────────────────────────────────
const REPO_NAME = "/econnect-youth";

export default defineConfig(({ command }) => ({
  // "build" = production (GitHub Pages needs the /repo-name/ prefix)
  // "serve" = local dev (always use "/" so localhost works)
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
