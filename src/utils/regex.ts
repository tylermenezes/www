// https://stackoverflow.com/a/3561711
export function escapeRegex(reg: string): string {
    return reg.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}