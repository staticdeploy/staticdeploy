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
export class BundleNotFoundError extends Error {
    constructor(searchValue: string, searchProperty: string) {
        super(`No bundle found with ${searchProperty} = ${searchValue}`);
    }
}
export class BundleAssetNotFoundError extends Error {
    constructor(id: string, path: string) {
        super(`No asset found at path = ${path} for bundle with id = ${id}`);
    }
}
export class BundleInUseError extends Error {
    constructor(id: string, dependentEntrypointsIds: string[]) {
        const idsString = dependentEntrypointsIds.join(", ");
        super(
            `Can't delete bundle with id = ${id} as it's being used by entrypoints with ids = ${idsString}`
        );
    }
}
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
export class BundleFallbackAssetNotFound extends Error {
    constructor(fallbackAssetPath: string) {
        super(
            `Asset ${fallbackAssetPath} not found in bundle, cannot be set as fallback asset`
        );
    }
}

// Entrypoint errors
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
export class EntrypointUrlMatcherNotValidError extends Error {
    constructor(urlMatcher: string) {
        super(`${urlMatcher} is not a valid urlMatcher for an entrypoint`);
    }
}

// Operation log errors
export class OperationLogNotFoundError extends Error {
    constructor(id: string) {
        super(`No operation log found with id = ${id}`);
    }
}
