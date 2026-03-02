const Ease = {
    Bad: 0,
    Hard: 1,
    Good: 2,
    Easy: 4
} as const;

type Ease = (typeof Ease)[keyof typeof Ease];

export { Ease };