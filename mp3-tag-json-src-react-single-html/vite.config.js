import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import sirv from "sirv";
import path from "path";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    {
      name: "serve-external-folder",
      configureServer(server) {
        // Serves the folder /Users/name/Pictures under the site root directly
        server.middlewares.use(
          "/",
          sirv(
            path.resolve("/home/data/my_data/dev/dj-project/mp3-tag-json/"),
            {
              dev: true,
            }
          )
        );
      },
    },
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    cssCodeSplit: false,
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
        inlineDynamicImports: true,
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
