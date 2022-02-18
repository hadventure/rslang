// declaration.d.ts
declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
// https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
declare module '*.png'
declare module '*.svg'
declare module '*.mp3'
