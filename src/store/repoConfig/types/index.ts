import { RepoConfigCore } from "./core";
import { RepoConfigUser } from "./user";

export type RecordAddPrefix<
    Prefix extends string,
    Obj extends Record<string, any>
> = {
    [k in `${Prefix}.${keyof Obj & string}`]: Obj[RemovePrefix<
        `${Prefix}.`,
        k
    >];
};

export type AddPrefix<
    Prefix extends string,
    Types extends string
> = `${Prefix}${Types}`;

export type RemovePrefix<
    Prefix extends string,
    Str extends string
> = Str extends `${Prefix}${infer N}` ? N : Str;

export type Optional<O extends Record<string, any>> = {
    [k in keyof O]?: O[k] extends object ? Optional<O[k]> : O[k];
};
export type RepoConfig = Optional<RepoConfigCore & RepoConfigUser>;
