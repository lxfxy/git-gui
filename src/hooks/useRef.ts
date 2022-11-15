import { ref, Ref, UnwrapRef } from "vue";

export const useRef = <T, Set = (val?: T) => void>(
    set?: Set,
    initialValue?: T
): [Ref<UnwrapRef<T> | undefined>, Set] => {
    const value = ref<T | undefined>(initialValue);
    const setValue =
        set ||
        ((newVal: T) => {
            value.value = newVal as any;
        });
    return [value, setValue as any];
};
