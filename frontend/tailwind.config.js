/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#00b4d8", // Aqua
                secondary: "#0077b6", // Blue
                accent: "#caf0f8", // Light Aqua
                dark: "#03045e", // Dark Blue
            },
        },
    },
    plugins: [],
}
