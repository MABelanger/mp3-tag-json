import { defineConfig } from "vite";
import react from "@vitejs/react-plugin"; // If using the standard React plugin
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(), // Combines CSS into the single JS output
  ],
  build: {
    lib: {
      // Path to your main component/export file
      entry: resolve(__dirname, "src/index.jsx"),
      name: "MyReactWidget",
      fileName: "my-react-widget",
      formats: ["es"], // Emits a clean ES Module (.js) file
    },
    rollupOptions: {
      // Exclude React from the bundle if the hosting app already provides it
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
