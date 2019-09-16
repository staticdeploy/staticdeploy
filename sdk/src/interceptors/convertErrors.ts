import get from "lodash/get";

import StaticdeployClientError from "../StaticdeployClientError";

export default function convertErrors() {
    return async (err: any) => {
        const responseStatusCode = get(err, "response.status");
        const responseErrorName = get(err, "response.data.name");
        const responseErrorMessage = get(err, "response.data.message");

        const errorTitle = responseErrorName
            ? responseErrorName
            : responseStatusCode
            ? `Error ${responseStatusCode}`
            : "Error";
        const errorDescription = responseErrorMessage
            ? responseErrorMessage
            : err.message;
        const errorMessage = `${errorTitle}: ${errorDescription}`;

        throw new StaticdeployClientError(errorMessage, err);
    };
}
