export default class StaticdeployClientError extends Error {
    constructor(message: string, public originalError: Error) {
        super(message);
    }
}
