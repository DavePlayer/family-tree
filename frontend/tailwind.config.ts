import type { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */
const tailwindConfig: Config = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                mainBg: "#292929",
                gradient: "linear-gradient(90deg, #FD7900 0.88%, #F33 48.31%, #FF00E5 100%)",
                "gradient-text": "#fff",
                "default-color": "#fff",
                "secondary-color": "#000",
                error: "#FF6C6C",
                "error-hover": "#ff4f4f",
                "dark-1": "#00000033",
                "dark-2": "#212121",
                "dark-3": "#333",
                orange: "#FD7900",
                "orange-hover": "#cf6300",
            },
            fontFamily: {
                "island-moment": "Island Moments, cursive",
            },
        },
    },
    plugins: [],
};

export default tailwindConfig;
