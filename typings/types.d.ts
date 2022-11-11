declare type GetCompSetupReturn<Comp> = Comp extends {
    setup?: infer Setup extends (...args: any) => any;
}
    ? ObjValuesUnRef<
          Exclude<
              ReturnType<Setup>,
              undefined | (() => any) | void | Promise<any>
          >
      >
    : null;
declare type ObjValuesUnRef<O extends Record<string, any>> = {
    [key in keyof O]: UnRef<O[key]>;
};
declare type UnRef<Value extends Record<string, any>> = Value extends {
    value: infer V;
}
    ? V
    : Value;
declare type NTagProps = Exclude<
    typeof import("naive-ui")["NTag"]["__defaults"],
    undefined
>;

declare type Cwd = string | undefined;
