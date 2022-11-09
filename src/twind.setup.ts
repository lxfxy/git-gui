import { setup } from "twind";
setup({
    theme: {
        extend: {
            colors: {
                bgColor1: "var(--bg-color)",
                bgColor2: "var(--bg-color2)",
                color1: "var(--color)",
            },
        },
        transitionProperty: {
            color: "background-color, color",
            opacity: "opacity",
        },
    },
    plugins: {
        center: "flex justify-center items-center",
        title: "text-[16px] p-[10px] bg-bgColor1 text-color1",
    },
});
