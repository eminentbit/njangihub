import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Vitest config: jsdom gives browser globals (FileList, document, …),
  // globals exposes expect/describe/it, and the setup file registers the
  // @testing-library/jest-dom matchers.
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
  },
});
