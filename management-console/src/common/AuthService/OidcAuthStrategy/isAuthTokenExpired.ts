import jwtDecode from "jwt-decode";

export default function isAuthTokenExpired(authToken: string): boolean {
    const jwt = jwtDecode<{ exp: number }>(authToken);
    return jwt.exp < Date.now() / 1000;
}
