/* eslint-disable max-len */
export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function shuffle<T>(array: T[]): T[] {
  const copy = array;

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [array[j], array[i]];
  }

  return array;
}

export const getRandomIntArr = (min: number, max: number, length: number, arr?: number[]) => {
  const res = arr ? new Set(arr) : new Set();
  while (res.size < length) res.add(Math.floor(Math.random() * (max - min + 1)) + min);
  return Array.from(res);
};

// function identity<Type>(arg: Type): Type {
//   return arg;
// }

// let output = identity<string>("myString");
