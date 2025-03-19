import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    languageOptions: {
      parser: "@typescript-eslint/parser",
    },
    plugins: {
      "@typescript-eslint": import("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
    },
  },
];

export default eslintConfig;
