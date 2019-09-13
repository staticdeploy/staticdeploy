import get from "lodash/get";

import StaticdeployClientError from "../StaticdeployClientError";

export default function convertErrors() {
    return async (err: any) => {
        const responseStatusCode = get(err, "response.status");
        const responseErrorMessage = get(err, "response.data.message");
        const message = responseStatusCode
            ? responseErrorMessage
                ? `Error ${responseStatusCode}: ${responseErrorMessage}`
                : `Error ${responseStatusCode}`
            : err.message;
        throw new StaticdeployClientError(message, err);
    };
}
