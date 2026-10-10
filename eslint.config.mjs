import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "exports/**",
    "public/r/**",
    "test-results/**",
    "playwright-report/**",
    "next-env.d.ts",
    "mobile/node_modules/**",
    "mobile/.expo/**",
    "mobile/dist/**",
    "mobile/dist-native/**",
    "native-test-results/**",
    "mobile/generated/**",
  ]),
]);
