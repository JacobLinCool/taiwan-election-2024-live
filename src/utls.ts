export function sort_object(obj: Record<string, number>) {
    const keys = Object.keys(obj);
    keys.sort((a, b) => obj[b] - obj[a]);
    const result: Record<string, number> = {};
    for (const k of keys) {
        result[k] = obj[k];
    }
    return result;
}
