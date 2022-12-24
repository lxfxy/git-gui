import { computed, defineComponent } from "vue";

/**
 * 将英文用`<code>`标签来渲染
 */
const EngRenderCodeTag = defineComponent({
    setup(props, context) {
        const text = computed(() => {
            const text =
                (context.slots.default?.()[0].children as string) || "";
            return text.replace(/(^\w)(\w+)(^\w)/, `<code>$1</code>`);
        });
        return () => {
            return <span innerHTML={text.value}>{text.value}</span>;
        };
    },
});

export default EngRenderCodeTag;
