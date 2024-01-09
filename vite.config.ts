import { resolve } from "path";
import { defineConfig } from "vite";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import inline from "rollup-plugin-inline-js";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/crx/background.js"),
        "content-script": resolve(__dirname, "src/crx/content-script.js"),
      },
      output: {
        dir: "dist",
        format: "es",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].js",
      },
      plugins: [
        terser(),
        copy({
          targets: [
            { src: "manifest.json", dest: "dist" },
            { src: "icons", dest: "dist" },
          ],
        }),
        inline(),
      ],
      watch: {
        include: "src/**",
        exclude: "node_modules/**",
      },
    },
  },
});
