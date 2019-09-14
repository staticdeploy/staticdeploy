export default interface IAuthStrategy {
    name: string;
    displayName: string;
    init(): Promise<void>;
    login(...params: any): Promise<void>;
    logout(): Promise<void>;
    getAuthToken(): Promise<string | null>;
}
