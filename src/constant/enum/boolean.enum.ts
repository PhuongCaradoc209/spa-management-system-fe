export const BooleanString = {
  True: "true",
  False: "false",
} as const;
export type BooleanString = typeof BooleanString[keyof typeof BooleanString];
