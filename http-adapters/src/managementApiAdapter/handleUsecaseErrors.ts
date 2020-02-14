import * as sd from "@staticdeploy/core";
import { IConvRoute } from "convexpress";

import IBaseRequest from "../IBaseRequest";

type ErrorStatusMapping = [any, number];
export const errorStatusMappings: ErrorStatusMapping[] = [
    // Auth errors
    [sd.AuthenticationRequiredError, 401],
    [sd.NoUserCorrespondingToIdpUserError, 403],
    [sd.MissingRoleError, 403],
    // Configuration errors
    [sd.ConfigurationNotValidError, 400],
    // App errors
    [sd.AppNameNotValidError, 400],
    [sd.AppNotFoundError, 404],
    [sd.ConflictingAppError, 409],
    [sd.AppHasEntrypointsError, 409],
    // Bundle errors
    [sd.BundleNameOrTagNotValidError, 400],
    [sd.BundleNameTagCombinationNotValidError, 400],
    [sd.BundleFallbackAssetNotFoundError, 400],
    [sd.BundleNotFoundError, 404],
    [sd.BundlesInUseError, 409],
    [sd.ArchiveExtractionError, 400],
    // Entrypoint errors
    [sd.EntrypointUrlMatcherNotValidError, 400],
    [sd.EntrypointNotFoundError, 404],
    [sd.ConflictingEntrypointError, 409],
    [sd.EntrypointMismatchedAppIdError, 400],
    // ExternalCache errors
    [sd.ExternalCacheTypeNotSupportedError, 400],
    [sd.ExternalCacheDomainNotValidError, 400],
    [sd.ExternalCacheConfigurationNotValidError, 400],
    [sd.ConflictingExternalCacheError, 409],
    [sd.ExternalCacheNotFoundError, 404],
    // Endpoint response errors
    [sd.NoMatchingEntrypointError, 404],
    [sd.NoBundleOrRedirectToError, 404],
    // Group errors
    [sd.GroupNotFoundError, 404],
    [sd.SomeGroupNotFoundError, 404],
    [sd.ConflictingGroupError, 409],
    [sd.GroupHasUsersError, 409],
    [sd.RoleNotValidError, 400],
    // User errors
    [sd.UserNotFoundError, 404],
    [sd.ConflictingUserError, 409],
    // Unexpected error
    [sd.UnexpectedError, 500]
];
function findMatchingMapping(err: any): ErrorStatusMapping | null {
    return (
        errorStatusMappings.find(([ErrorClass]) => err instanceof ErrorClass) ||
        null
    );
}

export default (
    handler: IConvRoute["handler"]
): IConvRoute["handler"] => async (req: IBaseRequest, res) => {
    try {
        await (handler as any)(req, res);
    } catch (error) {
        const matchingMapping = findMatchingMapping(error);
        if (!matchingMapping) {
            req.log.error("unhandled request error", {
                error: error
            });
            res.status(500).send({
                name: "UnhandledRequestError",
                message:
                    "An unexpected error occurred while performing the operation"
            });
        } else {
            const [ErrorClass, statusCode] = matchingMapping;
            res.status(statusCode).send({
                name: ErrorClass.name,
                message: error.message
            });
        }
    }
};
