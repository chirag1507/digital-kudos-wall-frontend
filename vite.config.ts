import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import injectEnv from "./scripts/inject-env";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectEnv()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "^/(users|health)": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
