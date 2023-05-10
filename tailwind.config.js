/** @type {import('tailwindcss').Config} */
module.exports = {
    // content: ["./src/**/*.{html,js,tsx,vue,ts}"],
    theme: {
        extend: {
            colors: {
                bgColor1: "var(--bg-color)",
                bgColor2: "var(--bg-color2)",
                color1: "var(--text-color)",
                color2: "var(--text-color2)",
            },
            transitionProperty: {
                color: "background-color, color",
                opacity: "opacity",
            },
        },
    },
    plugins: [
        {
            handler({ addUtilities }) {
                addUtilities({
                    ".center": {},
                });
            },
        },
    ],
};
