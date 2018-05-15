import Axios, { AxiosInstance } from "axios";

import AppsClient from "./AppsClient";
import BundlesClient from "./BundlesClient";
import convertAxiosErrors from "./convertAxiosErrors";
import EntrypointsClient from "./EntrypointsClient";
import OperationLogsClient from "./OperationLogsClient";

export {
    IApp,
    IBundle,
    IConfiguration,
    IEntrypoint,
    IOperationLog
} from "@staticdeploy/storage";
export { StaticdeployClientError } from "./convertAxiosErrors";

export default class StaticdeployClient {
    public apps: AppsClient;
    public bundles: BundlesClient;
    public entrypoints: EntrypointsClient;
    public operationLogs: OperationLogsClient;
    private axios: AxiosInstance;

    constructor(config: { apiUrl: string; apiToken?: string }) {
        this.axios = Axios.create({
            baseURL: config.apiUrl,
            withCredentials: true
        });
        convertAxiosErrors(this.axios);
        if (config.apiToken) {
            this.setApiToken(config.apiToken);
        }
        this.apps = new AppsClient(this.axios);
        this.bundles = new BundlesClient(this.axios);
        this.entrypoints = new EntrypointsClient(this.axios);
        this.operationLogs = new OperationLogsClient(this.axios);
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
