import { apply, setup, tw } from "twind";
// import "twind/shim";
import { css } from "twind/css";
setup({
    darkMode: "class",
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
    plugins: {
        center: "flex justify-center items-center",
        title: "text-[16px] p-[10px] bg-bgColor1 text-color1",
        "form-horizontal": (parts) => {
            return css`
                .n-form-item {
                    ${apply`formitem-horizontal-${parts.join("-")}`};
                }
            `;
        },
        "formitem-horizontal": (parts) => {
            return css`
                display: grid;
                grid-template-columns: ${parts[0]
                    .slice(1, -1)
                    .replaceAll(",", " ")};
                grid-template-areas:
                    "label input"
                    "label tips";
                .n-form-item-label {
                    grid-area: label;
                    ${apply`text-right inline pt-[6px]`}
                }
                .n-form-item-blank {
                    grid-area: input;
                }
                .n-form-item-feedback-wrapper {
                    grid-area: tips;
                }
            `;
        },
    },
});
