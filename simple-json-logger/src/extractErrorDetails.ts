interface IErrorDetails {
    name?: string;
    message?: string;
    stack?: string;
}
export default function extractErrorDetails(error?: any): IErrorDetails | void {
    if (!error) {
        return undefined;
    }
    const errorDetails: IErrorDetails = {};
    try {
        errorDetails.name =
            typeof error.name === "string" ? error.name : undefined;
        errorDetails.message =
            typeof error.message === "string" ? error.message : undefined;
        errorDetails.stack =
            typeof error.stack === "string" ? error.stack : undefined;
    } catch {
        // Ignore errors
    }
    return errorDetails;
}
