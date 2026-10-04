import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier/flat";

/** Features may only be imported through their public index.ts. */
const featureBoundary = {
  group: ["@/features/*/*", "@/features/*/**"],
  message:
    "Import another feature through its index.ts, e.g. '@/features/news'. Inside a feature, use relative imports.",
};

/** Only the API layer may read mock data. */
const mockBoundary = {
  group: ["@/mocks", "@/mocks/*", "**/mocks/**"],
  message: "Only src/lib/api may import mock data. Call a feature data.ts function instead.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // eslint-config-next already registers the jsx-a11y plugin; turn on its full recommended rule set.
  { files: ["**/*.{jsx,tsx}"], rules: jsxA11y.flatConfigs.recommended.rules },

  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "no-restricted-imports": ["error", { patterns: [featureBoundary, mockBoundary] }],
    },
  },
  {
    // The API layer is the one place allowed to read mocks.
    files: ["src/lib/api/**/*.ts"],
    rules: { "no-restricted-imports": ["error", { patterns: [featureBoundary] }] },
  },
  {
    // Tests may reach into internals.
    files: ["**/*.test.{ts,tsx}", "e2e/**/*.ts"],
    rules: { "no-restricted-imports": "off" },
  },

  // Must stay last: disables stylistic rules that conflict with Prettier.
  prettier,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    "src/components/ui/icons.generated.ts",
  ]),
]);

export default eslintConfig;
