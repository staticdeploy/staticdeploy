// Auth errors
export class AuthenticationRequiredError extends Error {
    constructor() {
        super("This operation requires the request to be authenticated");
    }
}
export class AuthorizationError extends Error {}

// Configuration errors
export class ConfigurationNotValidError extends Error {
    constructor(configurationProperty: string) {
        super(`${configurationProperty} is not a valid configuration object`);
    }
}

// App errors
export class AppNameNotValidError extends Error {
    constructor(name: string) {
        super(`${name} is not a valid name for an app`);
    }
}
export class AppNotFoundError extends Error {
    constructor(searchValue: string, searchProperty: string) {
        super(`No app found with ${searchProperty} = ${searchValue}`);
    }
}
export class ConflictingAppError extends Error {
    constructor(name: string) {
        super(`An app with name = ${name} already exists`);
    }
}

// Bundle errors
export class BundleNameOrTagNotValidError extends Error {
    constructor(nameOrTag: string, type: "name" | "tag") {
        super(`${nameOrTag} is not a valid ${type} for a bundle`);
    }
}
export class BundleNameTagCombinationNotValidError extends Error {
    constructor(nameTagCombination: string) {
        super(
            `${nameTagCombination} is not a valid name:tag combination for a bundle`
        );
    }
}
export class BundleFallbackAssetNotFoundError extends Error {
    constructor(fallbackAssetPath: string) {
        super(
            `Asset ${fallbackAssetPath} not found in bundle, cannot be set as fallback asset`
        );
    }
}
export class BundleNotFoundError extends Error {
    constructor(searchValue: string, searchProperty: string) {
        super(`No bundle found with ${searchProperty} = ${searchValue}`);
    }
}
export class BundlesInUseError extends Error {
    constructor(ids: string[], dependentEntrypointsIds: string[]) {
        const bundleIdsString = ids.join(", ");
        const entrypointIdsString = dependentEntrypointsIds.join(", ");
        super(
            `Can't delete bundles with id = ${bundleIdsString}, as ore or more of them are being used by entrypoints with ids = ${entrypointIdsString}`
        );
    }
}

// Entrypoint errors
export class EntrypointUrlMatcherNotValidError extends Error {
    constructor(urlMatcher: string) {
        super(`${urlMatcher} is not a valid urlMatcher for an entrypoint`);
    }
}
export class EntrypointNotFoundError extends Error {
    constructor(searchValue: string, searchProperty: string) {
        super(`No entrypoint found with ${searchProperty} = ${searchValue}`);
    }
}
export class ConflictingEntrypointError extends Error {
    constructor(urlMatcher: string) {
        super(`An entrypoint with urlMatcher = ${urlMatcher} already exists`);
    }
}
export class EntrypointMismatchedAppIdError extends Error {
    constructor(entrypointUrlMatcher: string, appName: string) {
        super(
            `Entrypoint with urlMatcher = ${entrypointUrlMatcher} doesn't link to app with name = ${appName}`
        );
    }
}

// Endpoint response errors
export class NoMatchingEntrypointError extends Error {
    constructor(public requestedUrl: string) {
        super(`No entrypoint found matching requestedUrl = ${requestedUrl}`);
    }
}
export class NoBundleOrRedirectToError extends Error {
    constructor(public matchingEntrypointUrlMatcher: string) {
        super(
            `Entrypoint with urlMatcher = ${matchingEntrypointUrlMatcher} doesn't specify neither a bundle to serve nor a location to redirect to`
        );
    }
}

// Storage errors
export class GenericStorageError extends Error {}
export class StorageInconsistencyError extends Error {}
