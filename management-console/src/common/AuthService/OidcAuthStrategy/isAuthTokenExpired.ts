export default function isAuthTokenExpired(expiresAt: number): boolean {
    return expiresAt < Date.now() / 1000;
}
