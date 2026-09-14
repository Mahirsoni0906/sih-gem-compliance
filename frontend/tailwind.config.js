/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gem: {
                    navy: "#162c5b",
                    dark: "#0d1d3d",
                    orange: "#e67e22",
                }
            }
        },
    },
    plugins: [],
}