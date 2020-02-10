import { IIdpUser } from "../entities/User";

// Auth errors
export class AuthenticationStrategySetupError extends Error {
    constructor(
        public authenticationStrategy: string,
        message: string,
        public originalError: any
    ) {
        super(message);
    }
}
export class AuthenticationRequiredError extends Error {
    constructor() {
        super("This operation requires the request to be authenticated");
    }
}
export class NoUserCorrespondingToIdpUserError extends Error {
    constructor(idpUser: IIdpUser) {
        super(
            `Access denied. To gain access, ask an admin to create a user with idp = ${idpUser.idp} and idpId = ${idpUser.id}`
        );
    }
}
export class MissingRoleError extends Error {
    constructor() {
        super(
            "The user doesn't have the necessary roles to perform this operation"
        );
    }
}

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
export class AppHasEntrypointsError extends Error {
    constructor(id: string) {
        super(
            `Can't delete app with id = ${id} because it has linked entrypoints`
        );
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
    constructor(ids: string[]) {
        const bundlesIdsString = ids.join(", ");
        super(
            `Can't delete bundles with ids = [ ${bundlesIdsString} ], as one or more of them are being used by some entrypoints`
        );
    }
}
export class ArchiveCreationError extends Error {
    constructor() {
        super("Error creating archive from files");
    }
}
export class ArchiveExtractionError extends Error {
    constructor() {
        super("Error extracting files from archive");
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

// External cache errors
export class ExternalCacheTypeNotSupportedError extends Error {
    constructor(type: string) {
        super(`${type} is not a supported external cache type`);
    }
}
export class ExternalCacheDomainNotValidError extends Error {
    constructor(domain: string) {
        super(`${domain} is not a valid domain name`);
    }
}
export class ExternalCacheConfigurationNotValidError extends Error {
    constructor() {
        super("Invalid external cache configuration object");
    }
}
export class ConflictingExternalCacheError extends Error {
    constructor(domain: string) {
        super(`An external cache with domain = ${domain} already exists`);
    }
}
export class ExternalCacheNotFoundError extends Error {
    constructor(id: string) {
        super(`No external cache found with id = ${id}`);
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

// Group and role errors
export class GroupNotFoundError extends Error {
    constructor(id: string) {
        super(`No group found with id = ${id}`);
    }
}
export class SomeGroupNotFoundError extends Error {
    constructor(ids: string[]) {
        const idsString = ids.join(", ");
        super(`Not all ids = [ ${idsString} ] correspond to an existing group`);
    }
}
export class ConflictingGroupError extends Error {
    constructor(name: string) {
        super(`A group with name = ${name} already exists`);
    }
}
export class GroupHasUsersError extends Error {
    constructor(id: string) {
        super(`Can't delete group with id = ${id} because it has linked users`);
    }
}
export class RoleNotValidError extends Error {
    constructor(role: string) {
        super(`${role} is not a valid role`);
    }
}

// User errors
export class UserNotFoundError extends Error {
    constructor(id: string) {
        super(`No user found with id = ${id}`);
    }
}
export class ConflictingUserError extends Error {
    constructor(idp: string, idpId: string) {
        super(`A user with idp = ${idp} and idpId = ${idpId} already exists`);
    }
}

// Storages errors
export class StoragesSetupError extends Error {
    constructor(message: string, public originalError: any) {
        super(message);
    }
}
export class GenericStoragesError extends Error {
    constructor(public originalError: Error) {
        super("An error occurred while accessing StaticDeploy's storage");
    }
}
export class StoragesInconsistencyError extends Error {}
