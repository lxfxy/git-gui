export type StoreSetupFn = (state: StoreState) => void;

const storeSetupFns: Set<StoreSetupFn> = new Set();
export const setup = (fn: StoreSetupFn) => {
    storeSetupFns.add(fn);
};

export const triggerStoreSetup = (state: StoreState) => {
    for (const setup of storeSetupFns) {
        setup(state);
    }
};
