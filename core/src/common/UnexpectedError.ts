export default class UnexpectedError extends Error {
    constructor() {
        super("An unexpected error while performing the operation");
    }
}
