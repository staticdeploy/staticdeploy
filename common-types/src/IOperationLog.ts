export enum Operation {
    // Apps
    createApp = "apps:create",
    updateApp = "apps:update",
    deleteApp = "apps:delete",

    // Entrypoints
    createEntrypoint = "entrypoints:create",
    updateEntrypoint = "entrypoints:update",
    deleteEntrypoint = "entrypoints:delete",

    // Bundles
    createBundle = "bundles:create",
    deleteBundle = "bundles:delete"
}

export default interface IOperationLog {
    id: string;
    operation: Operation;
    // Un-typed JSON object
    parameters: { [key: string]: any };
    performedBy: string;
    performedAt: Date;
}
