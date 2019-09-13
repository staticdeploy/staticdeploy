export default class StaticdeployClientError extends Error {
    public originalError: Error;
    constructor(message: string, originalError: Error) {
        super(message);
        this.originalError = originalError;
    }
}
