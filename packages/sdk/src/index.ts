import Axios from "axios";

import AppsClient from "./AppsClient";
import DeploymentsClient from "./DeploymentsClient";
import EntrypointsClient from "./EntrypointsClient";

export default class StaticdeployClient {
    public apps: AppsClient;
    public deployments: DeploymentsClient;
    public entrypoints: EntrypointsClient;

    constructor(apiUrl: string, apiToken: string) {
        const axios = Axios.create({
            baseURL: apiUrl,
            headers: {
                Authorization: `Bearer ${apiToken}`
            },
            withCredentials: true
        });
        this.apps = new AppsClient(axios);
        this.deployments = new DeploymentsClient(axios);
        this.entrypoints = new EntrypointsClient(axios);
    }
}
