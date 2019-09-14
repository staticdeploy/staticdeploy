import EventEmitter from "eventemitter3";
import find from "lodash/find";

import IAuthStrategy from "./IAuthStrategy";

export interface IStatus {
    isLoggingIn: boolean;
    isLoggedIn: boolean;
    loginError: Error | null;
}

export default class AuthService {
    private status: IStatus = {
        isLoggingIn: true,
        isLoggedIn: false,
        loginError: null
    };
    private statusEmitter = new EventEmitter();

    constructor(
        public authEnforced: boolean,
        private authStrategies: IAuthStrategy[]
    ) {}

    async init() {
        if (!this.authEnforced) {
            this.setStatus({
                isLoggingIn: false,
                isLoggedIn: true,
                loginError: null
            });
            return;
        }

        for (const authStrategy of this.authStrategies) {
            await authStrategy.init();
        }

        this.setStatus({
            isLoggingIn: false,
            isLoggedIn: !!(await this.getAuthToken()),
            loginError: null
        });
    }

    async getAuthToken(): Promise<string | null> {
        let authToken: string | null = null;

        // Try to get an auth token from any of the auth strategies
        for (const authStrategy of this.authStrategies) {
            authToken = await authStrategy.getAuthToken();
            if (authToken) {
                break;
            }
        }

        return authToken;
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
                isLoggingIn: true,
                isLoggedIn: false,
                loginError: null
            });

            const authStrategy = this.findAuthStrategy(strategy);
            if (!authStrategy) {
                throw new Error(`No auth strategy found with name ${strategy}`);
            }

            await authStrategy.login(...params);

            this.setStatus({
                isLoggingIn: false,
                isLoggedIn: !!(await this.getAuthToken()),
                loginError: null
            });
        } catch (err) {
            this.setStatus({
                isLoggingIn: false,
                isLoggedIn: false,
                loginError: err
            });
        }
    }

    async logout(): Promise<void> {
        await Promise.all(
            this.authStrategies.map(authStrategy => authStrategy.logout())
        );
        this.setStatus({
            isLoggingIn: false,
            isLoggedIn: false,
            loginError: null
        });
    }

    hasAuthStrategy(strategy: string): boolean {
        return !!this.findAuthStrategy(strategy);
    }

    getStrategyDisplayName(strategy: string): string {
        return this.findAuthStrategy(strategy)!.displayName;
    }

    private setStatus(status: IStatus): void {
        this.status = status;
        // Emit a clone
        this.statusEmitter.emit("change", { ...this.status });
    }

    private findAuthStrategy(strategy: string): IAuthStrategy | null {
        return find(this.authStrategies, { name: strategy }) || null;
    }
}
