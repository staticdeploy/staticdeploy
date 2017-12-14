export default {
    apiUrl: {
        default: "http://localhost:3000",
        describe: "Api server url",
        type: "string"
    },
    apiToken: {
        describe: "Api server auth token",
        type: "string",
        demandOption: true
    }
};
