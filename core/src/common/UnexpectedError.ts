export default class UnexpectedError extends Error {
    constructor() {
        super("An unexpected error occurred while performing the operation");
    }
}
