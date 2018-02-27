import { Options } from "yargs";

export interface IApiConfig {
    apiUrl: string;
    apiToken: string;
}

export const builder: { [name: string]: Options } = {
    apiUrl: {
        describe: "Api server url",
        type: "string",
        demandOption: true
    },
    apiToken: {
        describe: "Api server auth token",
        type: "string",
        demandOption: true
    }
};
