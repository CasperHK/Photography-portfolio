import { defineConfig } from "@rsbuild/core";
import { pluginSolid } from "@rsbuild/plugin-solid";

export default defineConfig({
  plugins: [pluginSolid()],
  server: {
    port: 3000,
  },
  source: {
    tsconfigPath: "./tsconfig.json",
    entry: {
      index: "./src/main.tsx",
    },
  },
  html: {
    template: "./index.html",
  },
});
