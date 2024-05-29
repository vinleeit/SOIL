/** @type {import('tailwindcss').Config} */
import formsPlugin from "@tailwindcss/forms";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "green-super-light":"#EBEFE0",
        "green-light": "#90A955",
        "green-light2": "#95AD5B",
        "green-dark": "#373D20",
        "green-dark2": "#474E28",
        "yellow-light": "#ECF39E",
        "yellow": "#D2DC5E",
        "blue-dark": "#1e2f4f",
        "brown": "b34f33",
      }
    },
  },
  plugins: [formsPlugin],
};
