# House style

When writing or reviewing TypeScript / React Native code:

- Prefer `type` over `interface` for object shapes that don't need declaration merging.
- Always pass `Promise`-returning handlers to React event props with `void` (e.g. `onPress={() => void save()}`).
- Avoid default exports for components; use named exports so editors can rename them.
- Co-locate Zod schemas with the type they describe, suffix the file `.schema.ts`.
- Keep React Query keys in factory functions (`fooQueryKey()`), never inline arrays.
- For async work in screens, route through hooks under `lib/hooks/`; never call repositories directly from JSX.
