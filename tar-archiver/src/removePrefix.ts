export default function removePrefix(target: string, prefix: string): string {
    return target.slice(0, prefix.length) === prefix
        ? target.slice(prefix.length)
        : target;
}
