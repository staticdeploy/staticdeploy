export default function isAuthTokenExpired(expiryDateInSeconds: number): boolean {
    return expiryDateInSeconds < Date.now() / 1000;
}
