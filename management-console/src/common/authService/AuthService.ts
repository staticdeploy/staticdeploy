import EventEmitter from "eventemitter3";

import IAuthStrategy from "./IAuthStrategy";

export interface IStatus {
    authToken: string | null;
    isLoggingIn: boolean;
    loginError: Error | null;
}

export default class AuthService {
    private status: IStatus;
    private statusEmitter: EventEmitter;

    constructor(
        public authEnforced: boolean,
        private authStrategies: IAuthStrategy[]
    ) {
        this.statusEmitter = new EventEmitter();

        if (!authEnforced) {
            this.status = {
                authToken: null,
                isLoggingIn: false,
                loginError: null
            };
            return;
        }

        // Try to get an auth token from any of the auth strategies
        const authStrategyWithToken = this.authStrategies.find(a =>
            a.getAuthToken()
        );
        const authToken = authStrategyWithToken
            ? authStrategyWithToken.getAuthToken()
            : null;

        // Set the initial status
        this.status = {
            authToken: authToken,
            isLoggingIn: false,
            loginError: null
        };
    }

    hasAuthStrategy(strategy: string): boolean {
        return !!this.authStrategies.find(a => a.name === strategy);
    }

    getStatus(): IStatus {
        // Return a clone
        return { ...this.status };
    }
    onStatusChange(fn: (status: IStatus) => void): void {
        this.statusEmitter.on("change", fn);
    }
    offStatusChange(fn: (status: IStatus) => void): void {
        this.statusEmitter.on("change", fn);
    }

    async loginWith(strategy: string, ...params: any): Promise<void> {
        try {
            this.setStatus({
                authToken: null,
                isLoggingIn: true,
                loginError: null
            });

            const authStrategy = this.authStrategies.find(
                a => a.name === strategy
            );
            if (!authStrategy) {
                throw new Error(`No auth strategy found with name ${strategy}`);
            }

            await authStrategy.login(...params);

            const authToken = authStrategy.getAuthToken();
            this.setStatus({
                authToken: authToken,
                isLoggingIn: false,
                loginError: null
            });
        } catch (err) {
            this.setStatus({
                authToken: null,
                isLoggingIn: false,
                loginError: err
            });
        }
    }

    async logout(): Promise<void> {
        await Promise.all(this.authStrategies.map(a => a.logout()));
        this.setStatus({
            authToken: null,
            isLoggingIn: false,
            loginError: null
        });
    }

    private setStatus(status: IStatus): void {
        this.status = status;
        // Emit a clone
        this.statusEmitter.emit("change", { ...this.status });
    }
}
