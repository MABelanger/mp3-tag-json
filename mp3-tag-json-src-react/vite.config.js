import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests that start with '/api'
      "/api": {
        target: "http://localhost:8000", // The address of your backend server
        changeOrigin: true, // Needed for virtual hosted sites
        // Optional: Rewrite the path (e.g., remove the '/api' prefix from the forwarded request)
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
