import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        textC: "#374151",
        textC2: "#EA580C",
        bgc: "#FFFFFF",
        darkC2: "#F7F6F4",
        darkC: "#EDEAE6",
        folio: "#EA580C",
        ink: "#111827",
      },
    },
    screens: {
      tablet: "840px",
    },
  },
  plugins: [],
} satisfies Config;
