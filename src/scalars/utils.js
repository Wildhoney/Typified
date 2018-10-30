export function yieldResult(result) {
    return { valid: result.errors.length === 0, generics: result.generics };
}
