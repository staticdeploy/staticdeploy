export default function getPathFromOriginalUrl(originalUrl: string): string {
    return new URL(originalUrl, `http://placeholder-domain/`).pathname;
}
