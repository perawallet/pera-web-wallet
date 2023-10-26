type ValueOf<T> = T[keyof T];

type ArrayToUnion<T extends readonly any[]> = T[number];

type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

type Either<T, U> = Only<T, U> | Only<U, T>;
