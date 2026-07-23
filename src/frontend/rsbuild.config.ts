import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginSolid } from "@rsbuild/plugin-solid";
import { tanstackRouter } from "@tanstack/router-plugin/rspack";

export default defineConfig({
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginSass(),
    pluginSolid(),
  ],
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
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: "solid",
          autoCodeSplitting: true,
        }),
      ],
    },
  },
});
