import StaticdeployClient from "@staticdeploy/sdk";

import { API_URL } from "../config";
import authService from "./authService";

const staticdeployClient = new StaticdeployClient({
    apiUrl: API_URL,
    apiToken: authService.getStatus().authToken || undefined
});

authService.onStatusChange(status => {
    staticdeployClient.setApiToken(status.authToken);
});

export default staticdeployClient;
