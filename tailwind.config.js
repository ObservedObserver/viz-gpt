import forms from "@tailwindcss/forms";
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "media",
    content: ["./src/**/*.{html,ts,tsx}"],
    theme: {
        extend: {},
    },
    safelist: [
        {
            pattern: /(bg|border)-(indigo)-([1-9]00)/,
        }
    ],
    plugins: [forms],
};
