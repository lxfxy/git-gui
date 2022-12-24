import { reactive, Ref, ref, VNode } from "vue";

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
    container?: Ref<Element | undefined>;
    onClose?: () => void;
    onOpen?: () => void;
    clickoutside?: boolean;
}
export const useContextmenu = ({
    container,
    onClose,
    onOpen,
    clickoutside = false,
}: UseContextmenuOptions = {}) => {
    let _container = container;
    const x = ref(0);
    const y = ref(0);
    const show = ref(false);
    const open = (openPosition: Position = position) => {
        x.value = openPosition.x;
        y.value = openPosition.y;
        show.value = true;
        onOpen?.();
    };
    const close = () => {
        show.value = false;
        onClose?.();
    };
    const setContainer = (newContainer: UseContextmenuOptions["container"]) => {
        _container = newContainer;
    };
    document.addEventListener("click", (e) => {
        if (!clickoutside) {
            close();
        }
    });
    document.addEventListener("contextmenu", (e) => {
        if (!_container?.value?.contains(e.target as any)) {
            close();
        }
    });
    return {
        x,
        y,
        show,
        open,
        close,
        setContainer,
    };
};
