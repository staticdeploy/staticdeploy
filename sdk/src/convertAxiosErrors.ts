import { AxiosInstance } from "axios";
import get from "lodash/get";

export class StaticdeployClientError extends Error {
    public originalError: Error;
    constructor(message: string, originalError: Error) {
        super(message);
        this.originalError = originalError;
    }
}

function wrapMethod(method: (...args: any[]) => any) {
    return async function(this: any) {
        try {
            return await method.apply(this, arguments);
        } catch (err) {
            const responseStatusCode = get(err, "response.status");
            const responseErrorMessage = get(err, "response.data.message");
            const message = responseStatusCode
                ? responseErrorMessage
                    ? `Error ${responseStatusCode}: ${responseErrorMessage}`
                    : `Error ${responseStatusCode}`
                : err.message;
            throw new StaticdeployClientError(message, err);
        }
    };
}

export default function convertAxiosErrors(axios: AxiosInstance) {
    axios.request = wrapMethod(axios.request);
    axios.get = wrapMethod(axios.get);
    axios.head = wrapMethod(axios.head);
    axios.post = wrapMethod(axios.post);
    axios.patch = wrapMethod(axios.patch);
    axios.put = wrapMethod(axios.put);
    axios.delete = wrapMethod(axios.delete);
}
