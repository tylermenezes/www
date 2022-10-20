export function resolveOrReject(b: boolean): Promise<void> {
    return b ? Promise.resolve() : Promise.reject();
}