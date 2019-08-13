export default interface IAuthStrategy {
    name: string;
    login(...params: any): Promise<void>;
    logout(): Promise<void>;
    getAuthToken(): string | null;
}
