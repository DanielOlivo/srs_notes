const Quantity = {
    Singular: 0,
    Plural: 1
} as const;

type Quantity = (typeof Quantity)[keyof typeof Quantity];

export { Quantity };