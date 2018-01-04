export class AppNotFoundError extends Error {
    constructor(id: string) {
        super(`No app found with id = ${id}`);
    }
}

export class DeploymentNotFoundError extends Error {
    constructor(id: string) {
        super(`No deployment found with id = ${id}`);
    }
}

export class EntrypointNotFoundError extends Error {
    constructor(id: string) {
        super(`No entrypoint found with id = ${id}`);
    }
}

export class ConflictingAppError extends Error {
    constructor(name: string) {
        super(`An app with name = ${name} already exists`);
    }
}

export class ConflictingEntrypointError extends Error {
    constructor(urlMatcher: string) {
        super(`An entrypoint with urlMatcher = ${urlMatcher} already exists`);
    }
}

export class UrlMatcherNotValidError extends Error {
    constructor(urlMatcher: string) {
        super(`${urlMatcher} is not a valid urlMatcher`);
    }
}
