import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  // Flat config lints the whole directory unless told otherwise, and `next
  // lint`, which used to supply this scoping, is gone as of Next 16. Without
  // it the run walks build output and vendored code and reports tens of
  // thousands of problems in files nobody here wrote.
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      "videos/**",
    ],
  },
  // Spread directly rather than through `FlatCompat`. These shipped as
  // eslintrc objects until eslint-config-next 16, which is why the bridge was
  // here; they are flat config arrays now, and feeding them back through the
  // compatibility layer makes it fail while serialising the config for an
  // error message, so the real problem never gets printed.
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;
