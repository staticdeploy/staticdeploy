import EventEmitter from "eventemitter3";

import IAuthTokenService, { IStatus } from "./IAuthTokenService";

export default class LocalStorageAuthTokenService implements IAuthTokenService {
    private status: IStatus;
    private localStorageKey: string;
    private statusEmitter: EventEmitter;

    constructor(localStorageKey: string = "authToken") {
        this.localStorageKey = localStorageKey;
        this.statusEmitter = new EventEmitter();
        const authToken = this.getAuthToken();
        this.status = {
            authToken: authToken,
            isSet: authToken !== null,
            isRetrieving: false,
            retrievingError: null
        };
    }

    public getStatus(): IStatus {
        // Return a clone
        return { ...this.status };
    }
    public onStatusChange(fn: (status: IStatus) => void) {
        this.statusEmitter.on("change", fn);
    }
    public offStatusChange(fn: (status: IStatus) => void) {
        this.statusEmitter.on("change", fn);
    }

    public setAuthToken(authToken: string | null) {
        if (authToken) {
            localStorage.setItem(this.localStorageKey, authToken);
        } else {
            localStorage.removeItem(this.localStorageKey);
        }
        this.status = {
            authToken: authToken,
            isSet: authToken !== null,
            isRetrieving: false,
            retrievingError: null
        };
        this.statusEmitter.emit("change", this.status);
    }

    private getAuthToken() {
        return localStorage.getItem(this.localStorageKey);
    }
}
