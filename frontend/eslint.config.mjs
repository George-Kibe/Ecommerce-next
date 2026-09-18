import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/** eslint-config-next 16 ships a native flat config, so no FlatCompat needed. */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "out/**", "build/**"] },
  ...nextCoreWebVitals,
];

export default eslintConfig;
