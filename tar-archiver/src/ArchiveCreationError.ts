export default class ArchiveCreationError extends Error {
    constructor() {
        super("Error creating archive from files");
    }
}
