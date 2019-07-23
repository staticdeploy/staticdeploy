export default function addTrailingSlash(path: string) {
    return /\/$/.test(path) ? path : `${path}/`;
}
