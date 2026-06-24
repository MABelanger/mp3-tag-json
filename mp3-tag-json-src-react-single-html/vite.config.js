import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.jsx"),
      name: "MyReactWidget",
      // Provide a fallback name here, but rollupOptions will strictly override it
      fileName: "my-react-widget",
      formats: ["es"],
    },
    rollupOptions: {
      // external: ["react", "react-dom"],
      output: {
        // This forces Vite/Rollup to use exactly this file name
        entryFileNames: "my-react-widget.js",
        // globals: {
        //   react: "React",
        //   "react-dom": "ReactDOM",
        // },
      },
    },
  },
});
