export enum Operation {
    // Apps
    CreateApp = "apps:create",
    UpdateApp = "apps:update",
    DeleteApp = "apps:delete",

    // Bundles
    CreateBundle = "bundles:create",
    DeleteBundle = "bundles:delete",

    // Entrypoints
    CreateEntrypoint = "entrypoints:create",
    UpdateEntrypoint = "entrypoints:update",
    DeleteEntrypoint = "entrypoints:delete",

    // External Caches
    CreateExternalCache = "externalCaches:create",
    UpdateExternalCache = "externalCaches:update",
    DeleteExternalCache = "externalCaches:delete",
    PurgeExternalCache = "externalCaches:purge",

    // Groups
    CreateGroup = "groups:create",
    UpdateGroup = "groups:update",
    DeleteGroup = "groups:delete",

    // Users
    CreateUser = "users:create",
    UpdateUser = "users:update",
    DeleteUser = "users:delete"
}

export interface IOperationLog {
    id: string;
    operation: Operation;
    // Un-typed JSON object
    parameters: { [key: string]: any };
    performedBy: string;
    performedAt: Date;
}
