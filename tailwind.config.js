import forms from "@tailwindcss/forms";
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./src/**/*.{html,ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [forms],
};
