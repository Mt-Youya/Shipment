/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const animate = require("tailwindcss-animate");

module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  plugins: [animate],
  corePlugins: {
    preflight: false
  },

  theme: {
    container: {
      center: true
    },
    colors: {
      white: colors.white,
      black: "#171629",
      "black-dark": "#000000",
      gray: "#69686D",
      "gray-light": "#f7f7f7",
      grey: "#f3f3f3",
      blue: "#226BF3",
      "blue-light": "#E6EFFF",
      graye4: "#e4e4e4",
      graye6: "#e6e6e6",
      red: "red"
    },
    spacing: {
      0: "0",
      0.5: "5px",
      1: "10px",
      1.5: "15px",
      2: "20px",
      2.5: "25px",
      3: "30px",
      4: "40px",
      4.5: "45px",
      5: "50px",
      6: "60px",
      7: "70px",
      8: "80px",
      9: "90px",
      10: "100px",
      12: "120px",
      14: "140px",
      16: "160px",
      17: "170px",
      18: "180px",
      19: "190px",
      20: "200px",
      25: "250px",
      30: "300px",
      35: "350px",
      40: "400px",
      45: "450px",
      50: "500px",
      55: "550px"
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "28px",
      "4xl": "30px",
      "5xl": "36px",
      "6xl": "42px",
      "7xl": "48px"
    },
    lineHeight: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "28px",
      "4xl": "30px",
      "5xl": "36px",
      "6xl": "42px",
      "7xl": "48px"
    },
  }
};
