import Axios, { AxiosInstance } from "axios";

import AppsClient from "./AppsClient";
import BundlesClient from "./BundlesClient";
import EntrypointsClient from "./EntrypointsClient";
import GroupsClient from "./GroupsClient";
import addAuthorizationHeader from "./interceptors/addAuthorizationHeader";
import convertErrors from "./interceptors/convertErrors";
import parseDates from "./interceptors/parseDates";
import OperationLogsClient from "./OperationLogsClient";
import UsersClient from "./UsersClient";

export { default as StaticdeployClientError } from "./StaticdeployClientError";

export default class StaticdeployClient {
    public apps: AppsClient;
    public bundles: BundlesClient;
    public entrypoints: EntrypointsClient;
    public groups: GroupsClient;
    public operationLogs: OperationLogsClient;
    public users: UsersClient;
    private axios: AxiosInstance;

    constructor(options: {
        apiUrl: string;
        apiToken: string | null | (() => Promise<string | null>);
    }) {
        this.axios = Axios.create({
            baseURL: options.apiUrl,
            withCredentials: true,
            // Increase max request (and response) body length to 100MB
            maxContentLength: 100 * 1024 * 1024
        });
        this.axios.interceptors.request.use(
            addAuthorizationHeader(options.apiToken)
        );
        this.axios.interceptors.response.use(parseDates(), convertErrors());

        this.apps = new AppsClient(this.axios);
        this.bundles = new BundlesClient(this.axios);
        this.entrypoints = new EntrypointsClient(this.axios);
        this.groups = new GroupsClient(this.axios);
        this.operationLogs = new OperationLogsClient(this.axios);
        this.users = new UsersClient(this.axios);
    }

    async deploy(options: {
        appName: string;
        entrypointUrlMatcher: string;
        bundleNameTagCombination: string;
    }): Promise<void> {
        await this.axios.post("/deploy", options);
    }
}
