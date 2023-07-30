export function parseIntOrDefault(value: any, defaultValue: number): number {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
}
