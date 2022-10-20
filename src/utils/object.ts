export function filterGetKeys<U extends any, T extends Record<string, U>>(obj: T, filter: (v: U) => boolean): string[] {
    return Object.entries(obj).filter(([,v]) => filter(v)).map(([k]) => k);
}