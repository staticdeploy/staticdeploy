const REDIRECT = "oidcRedirect";
const SILENT_REDIRECT = "oidcSilentRedirect";

export function getRedirectUrl(baseRedirectUrl: string): string {
    return appendSearchParam(baseRedirectUrl, REDIRECT);
}
export function isRedirectPage(): boolean {
    return currentUrlHasSearchParam(REDIRECT);
}

export function getSilentRedirectUrl(baseRedirectUrl: string): string {
    return appendSearchParam(baseRedirectUrl, SILENT_REDIRECT);
}
export function isSilentRedirectPage(): boolean {
    return currentUrlHasSearchParam(SILENT_REDIRECT);
}

function appendSearchParam(baseUrl: string, param: string): string {
    const baseURL = new URL(baseUrl);
    baseURL.searchParams.append(param, "true");
    return baseURL.toString();
}
function currentUrlHasSearchParam(param: string): boolean {
    const url = new URL(window.location.href);
    return url.searchParams.has(param);
}
