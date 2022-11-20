import { reactive, Ref, ref } from "vue";

interface Position {
    x: number;
    y: number;
}
const position = reactive<Position>({ x: 0, y: 0 });
document.addEventListener("mousemove", (e) => {
    position.x = e.clientX;
    position.y = e.clientY;
});
interface UseContextmenuOptions {
    container: Ref<Element | undefined>;
}
export const useContextmenu = ({ container }: UseContextmenuOptions) => {
    const x = ref(0);
    const y = ref(0);
    const show = ref(false);
    const open = (openPosition: Position = position) => {
        x.value = openPosition.x;
        y.value = openPosition.y;
        show.value = true;
    };
    const close = () => {
        show.value = false;
    };
    document.addEventListener("click", () => {
        close();
    });
    document.addEventListener("contextmenu", (e) => {
        if (!container.value?.contains(e.target as any)) {
            close();
        }
    });
    return {
        x,
        y,
        show,
        open,
        close,
    };
};
