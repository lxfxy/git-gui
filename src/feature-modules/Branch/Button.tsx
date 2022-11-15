import { ButtonProps, NButton } from "naive-ui";
import { tw } from "twind";
import { FunctionalComponent } from "vue";

interface Button extends FunctionalComponent<ButtonProps> {
    Danger: FunctionalComponent<ButtonProps>;
}
const Button: Button = (props, context) => {
    return (
        <NButton
            quaternary
            type="success"
            class={tw`justify-start`}
            {...props}
            size="medium"
        >
            {context.slots.default?.()}
        </NButton>
    );
};
Button.Danger = (props, context) => {
    return (
        <Button {...props} type="error">
            {{ ...context.slots }}
        </Button>
    );
};

export default Button;
