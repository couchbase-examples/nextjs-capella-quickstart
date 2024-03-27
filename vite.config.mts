// vite.config.mts
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { config as dotenvConfig } from 'dotenv';

if (process.env.NODE_ENV !== 'production'){
  dotenvConfig({ path: './test.env' });
}

export default defineConfig({
  test: {
    alias: {
      "@/": new URL("./", import.meta.url).pathname,
    },
  },
  plugins: [tsconfigPaths()],
});
