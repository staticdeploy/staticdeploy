import Axios, { AxiosInstance } from "axios";

import AppsClient from "./AppsClient";
import BundlesClient from "./BundlesClient";
import convertAxiosErrors from "./convertAxiosErrors";
import EntrypointsClient from "./EntrypointsClient";
import GroupsClient from "./GroupsClient";
import OperationLogsClient from "./OperationLogsClient";
import UsersClient from "./UsersClient";

export { StaticdeployClientError } from "./convertAxiosErrors";

export default class StaticdeployClient {
    public apps: AppsClient;
    public bundles: BundlesClient;
    public entrypoints: EntrypointsClient;
    public groups: GroupsClient;
    public operationLogs: OperationLogsClient;
    public users: UsersClient;
    private axios: AxiosInstance;

    constructor(config: { apiUrl: string; apiToken?: string }) {
        this.axios = Axios.create({
            baseURL: config.apiUrl,
            withCredentials: true,
            // Increase max request (and response) body length to 100MB
            maxContentLength: 100 * 1024 * 1024
        });
        convertAxiosErrors(this.axios);
        if (config.apiToken) {
            this.setApiToken(config.apiToken);
        }
        this.apps = new AppsClient(this.axios);
        this.bundles = new BundlesClient(this.axios);
        this.entrypoints = new EntrypointsClient(this.axios);
        this.groups = new GroupsClient(this.axios);
        this.operationLogs = new OperationLogsClient(this.axios);
        this.users = new UsersClient(this.axios);
    }

    setApiToken(apiToken: string | null): void {
        if (apiToken) {
            this.axios.defaults.headers.Authorization = `Bearer ${apiToken}`;
        } else {
            delete this.axios.defaults.headers.Authorization;
        }
    }

    async deploy(options: {
        appName: string;
        entrypointUrlMatcher: string;
        bundleNameTagCombination: string;
    }): Promise<void> {
        await this.axios.post("/deploy", options);
    }
}
