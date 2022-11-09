### 通信 &存储数据

- 都是用`vue3`的响应式`api`，来做全局数据存储



### 组件的`props`

```ts
declare type NTagProps = Exclude<
    typeof import("naive-ui")["NTag"]["__defaults"],
    undefined
>;
```

- 后期可以弄个自动导入的



