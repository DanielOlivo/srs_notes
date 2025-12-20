const Person = {
    First: 0,
    Second: 1,
    Third: 2
} as const;

type Person = (typeof Person)[keyof typeof Person];

export { Person };