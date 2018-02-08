import StaticdeployClient from "@staticdeploy/sdk";

export default function(apiUrl: string, apiToken: string) {
    return new StaticdeployClient({ apiUrl, apiToken });
}
