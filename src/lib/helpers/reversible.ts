export function reversible(value: number, max: number) {
    return (value > 0) ? value : (max + value);
}
