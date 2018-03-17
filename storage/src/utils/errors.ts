// App errors
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
export class NameOrTagNotValidError extends Error {
    constructor(nameOrTag: string, type: "name" | "tag") {
        super(`${nameOrTag} is not a valid ${type} for a bundle`);
    }
}
export class NameTagCombinationNotValidError extends Error {
    constructor(nameTagCombination: string) {
        super(
            `${nameTagCombination} is not a valid name:tag combination for a bundle`
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
export class UrlMatcherNotValidError extends Error {
    constructor(urlMatcher: string) {
        super(`${urlMatcher} is not a valid urlMatcher for an entrypoint`);
    }
}
