import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default tseslint.config(
  { ignores: ["dist", ".output", ".vinxi", "src/lib/api/schema.gen.ts", "src/routeTree.gen.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
            },
          ],
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  eslintPluginPrettier,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { react },
    rules: {
      "react/no-danger": "error",
      "no-eval": "error",
      "no-new-func": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXAttribute[name.name='href'][value.type='JSXExpressionContainer'] > JSXExpressionContainer > MemberExpression[property.name='url']",
          message: "Une adresse venant de l'API doit passer par toSafeLink avant d'être affichée.",
        },
      ],
    },
  },
  {
    // composant shadcn standard, sans donnée de l'API
    files: ["src/components/ui/chart.tsx"],
    rules: { "react/no-danger": "off" },
  },
);
