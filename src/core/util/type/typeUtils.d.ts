type ValueOf<T> = T[keyof T];

type ArrayToUnion<T extends readonly any[]> = T[number];
