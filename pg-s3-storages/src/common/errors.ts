export class StorageSetupError extends Error {
    constructor(message: string, public originalError: any) {
        super(message);
    }
}
