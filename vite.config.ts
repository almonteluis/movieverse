import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  base: "/movieverse/",
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      threshold: 1024,
      include: /\.(js|css|html|svg|json)$/,
      exclude: /\.(br|gz|zip)$/,
      deleteOriginalAssets: false,
      compressionOptions: {
        level: 9,
      },
      skipIfLargerOrEqual: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@radix-ui/react-select", "@radix-ui/react-dialog"],
          "vendor-icons": ["lucide-react"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://api.themoviedb.org/3",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
