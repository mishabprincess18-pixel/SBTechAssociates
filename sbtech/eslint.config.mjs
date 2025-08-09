import next from "eslint-config-next";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...next,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    ignores: [".next/**", "node_modules/**"],
  },
];
