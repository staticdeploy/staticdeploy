export interface IStatus {
    authToken: string | null;
    isSet: boolean;
    isRetrieving: boolean;
    retrievingError: Error | null;
}

export default interface IAuthTokenService {
    getStatus(): IStatus;
    onStatusChange(fn: (status: IStatus) => void): void;
    offStatusChange(fn: (status: IStatus) => void): void;
    setAuthToken(authToken: string | null): void;
}
