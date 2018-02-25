import Axios, { AxiosInstance } from "axios";

import AppsClient from "./AppsClient";
import convertAxiosErrors from "./convertAxiosErrors";
import DeploymentsClient from "./DeploymentsClient";
import EntrypointsClient from "./EntrypointsClient";

export {
    IApp,
    IConfiguration,
    IDeployment,
    IEntrypoint
} from "@staticdeploy/storage";
export { StaticdeployClientError } from "./convertAxiosErrors";

export default class StaticdeployClient {
    public apps: AppsClient;
    public deployments: DeploymentsClient;
    public entrypoints: EntrypointsClient;
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
        this.deployments = new DeploymentsClient(this.axios);
        this.entrypoints = new EntrypointsClient(this.axios);
    }

    setApiToken(apiToken: string | null) {
        if (apiToken) {
            this.axios.defaults.headers.Authorization = `Bearer ${apiToken}`;
        } else {
            delete this.axios.defaults.headers.Authorization;
        }
    }
}
