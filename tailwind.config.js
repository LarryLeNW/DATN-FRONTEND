/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#6900d4",
                secondary: "#b683df",
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: "1rem",
                    sm: "3rem",
                },
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                ".bg-light": {
                    background: "linear-gradient(10deg, #3efde4 , #ad3190)",
                },
                ".text-light": {
                    background: "linear-gradient(10deg, #3efde4 , #ad3190)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                },
            });
        },
    ],
};
