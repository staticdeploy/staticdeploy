import StaticdeployClient from "../../../sdk/lib";

export default function(apiUrl: string, apiToken: string) {
    return new StaticdeployClient({ apiUrl, apiToken });
}
