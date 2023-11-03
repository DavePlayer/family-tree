/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                mainBg: "#1E1E1E",
                gradient: "linear-gradient(90deg, #FD7900 0.88%, #F33 48.31%, #FF00E5 100%)",
                "gradient-text": "#fff",
                "default-color": "#fff",
                error: "#FF6C6C",
                "error-hover": "#ff4f4f",
            },
            fontFamily: {
                "island-moment": "Island Moments, cursive",
            },
        },
    },
    plugins: [],
};
