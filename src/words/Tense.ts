const Tense = {
    Past: 0,
    Present: 1,
    Future: 2,
    Imperative: 3,
    Infinitive: 4
} as const;

type Tense = (typeof Tense)[keyof typeof Tense];

export { Tense };