import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    alias: {
      "@/": new URL("./", import.meta.url).pathname,
    },
  },
  plugins: [tsconfigPaths()],
})
