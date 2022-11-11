export const intersectionObserver = new IntersectionObserver(
    (entrys) => {
        for (const item of entrys) {
            if (item.intersectionRatio > 0) {
                cbs.get(item.target)!();
            }
        }
    },
    {
        threshold: [0.1],
    }
);
const cbs = new WeakMap<Element, Function>();
export const observer = <T extends Element>(el: T, onShow: Function) => {
    intersectionObserver.observe(el);
    cbs.set(el, onShow);
};
export const unObserver = <T extends Element>(el: T) => {
    intersectionObserver.unobserve(el);
    cbs.delete(el);
};
