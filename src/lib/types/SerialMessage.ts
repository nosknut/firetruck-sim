export type SerialMessage =
    { p: number; v: number }
    | { p: number; m: 'i' | 'o' }
    | { print: string }
