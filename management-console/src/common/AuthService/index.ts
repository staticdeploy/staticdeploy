import StaticdeployClient from "@staticdeploy/sdk";
import EventEmitter from "eventemitter3";
import find from "lodash/find";
import isString from "lodash/isString";

import cacheFor from "../cacheFor";
import IAuthStrategy from "./IAuthStrategy";

export interface IStatus {
    isLoggingIn: boolean;
    isLoggedIn: boolean;
    loginError: Error | null;
    requiresUserCreation: boolean;
    requiresUserCreationError: Error | null;
}

export default class AuthService {
    private status: IStatus = {
        isLoggingIn: true,
        isLoggedIn: false,
        loginError: null,
        requiresUserCreation: false,
        requiresUserCreationError: null,
    };
    private statusEmitter = new EventEmitter();
    private staticdeploy: StaticdeployClient;

    constructor(
        public authEnforced: boolean,
        private authStrategies: IAuthStrategy[],
        staticdeployClient: StaticdeployClient
    ) {
        this.staticdeploy = staticdeployClient;
        this.staticdeploy.setApiToken(
            cacheFor(this.getAuthToken.bind(this), 5000)
        );
    }

    async init() {
        if (!this.authEnforced) {
            this.setStatus({
                isLoggingIn: false,
                isLoggedIn: true,
                loginError: null,
                requiresUserCreation: false,
                requiresUserCreationError: null,
            });
            return;
        }

        for (const authStrategy of this.authStrategies) {
            await authStrategy.init();
        }

        await this.setStatusFromAuthToken();
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
                loginError: null,
                requiresUserCreation: false,
                requiresUserCreationError: null,
            });

            const authStrategy = this.findAuthStrategy(strategy);
            if (!authStrategy) {
                throw new Error(`No auth strategy found with name ${strategy}`);
            }

            await authStrategy.login(...params);

            await this.setStatusFromAuthToken();
        } catch (err) {
            this.setStatus({
                isLoggingIn: false,
                isLoggedIn: false,
                loginError: err,
                requiresUserCreation: false,
                requiresUserCreationError: null,
            });
        }
    }

    async logout(): Promise<void> {
        await Promise.all(
            this.authStrategies.map((authStrategy) => authStrategy.logout())
        );
        this.setStatus({
            isLoggingIn: false,
            isLoggedIn: false,
            loginError: null,
            requiresUserCreation: false,
            requiresUserCreationError: null,
        });
    }

    hasAuthStrategy(strategy: string): boolean {
        return !!this.findAuthStrategy(strategy);
    }

    getStrategyDisplayName(strategy: string): string {
        return this.findAuthStrategy(strategy)!.displayName;
    }

    private async getAuthToken(): Promise<string | null> {
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

    private setStatus(status: IStatus): void {
        this.status = status;
        // Emit a clone
        this.statusEmitter.emit("change", { ...this.status });
    }

    private async setStatusFromAuthToken(): Promise<void> {
        const isLoggedIn = !!(await this.getAuthToken());
        const requiresUserCreationError = isLoggedIn
            ? await this.staticdeploy.users
                  .getCurrentUser()
                  .then(() => null)
                  .catch((err: any) =>
                      err &&
                      isString(err.message) &&
                      err.message.includes("NoUserCorrespondingToIdpUserError")
                          ? err
                          : null
                  )
            : null;

        this.setStatus({
            isLoggingIn: false,
            isLoggedIn: isLoggedIn,
            loginError: null,
            requiresUserCreation: requiresUserCreationError !== null,
            requiresUserCreationError: requiresUserCreationError,
        });
    }

    private findAuthStrategy(strategy: string): IAuthStrategy | null {
        return find(this.authStrategies, { name: strategy }) || null;
    }
}
