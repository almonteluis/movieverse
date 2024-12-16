import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      threshold: 1024, // Only compress files bigger than 1KB
      include: /\.(js|css|html|svg|json)$/,
      exclude: /\.(br|gz|zip)$/,
      deleteOriginalAssets: false, // Keep original files
      compressionOptions: {
        level: 9, // Highest compression level
      },
      skipIfLargerOrEqual: true, // Skip if compressed file is larger than original
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
  build: {
    sourcemap: true,
    // Add build optimizations
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
