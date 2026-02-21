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
                primary: "var(--primary)",
                secondary: "var(--secondary)",
                accent: "var(--accent)",
                dark: "var(--dark)",
                "bg-main": "var(--bg-main)",
                "text-main": "var(--text-main)",
            },
        },
    },
    plugins: [],
}
