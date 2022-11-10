declare type GetCompSetupReturn<Comp> = Comp extends { setup?: infer Setup }
    ? Exclude<ReturnType<Setup>, undefined | (() => any) | void | Promise<any>>
    : null;

declare type NTagProps = Exclude<
    typeof import("naive-ui")["NTag"]["__defaults"],
    undefined
>;
