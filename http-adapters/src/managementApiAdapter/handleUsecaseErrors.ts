import * as sd from "@staticdeploy/core";
import { IConvRoute } from "convexpress";

const errorStatusMappings: [any, number][] = [
    // Auth errors
    [sd.AuthenticationRequiredError, 401],
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
    // Endpoint response errors
    [sd.NoMatchingEntrypointError, 404],
    [sd.NoBundleOrRedirectToError, 404],
    // Group errors
    [sd.GroupNotFoundError, 404],
    [sd.SomeGroupNotFoundError, 404],
    [sd.ConflictingGroupError, 409],
    [sd.GroupHasUsersError, 409],
    // User errors
    [sd.UserNotFoundError, 404],
    [sd.ConflictingUserError, 409],
    // Storage errors
    [sd.GenericStorageError, 500],
    [sd.StorageInconsistencyError, 500]
];

export default (
    handler: IConvRoute["handler"]
): IConvRoute["handler"] => async (req, res) => {
    try {
        await (handler as any)(req, res);
    } catch (err) {
        const matchingMapping = errorStatusMappings.find(
            ([ErrorClass]) => err instanceof ErrorClass
        );
        if (!matchingMapping) {
            throw err;
        }
        res.status(matchingMapping[1]).send({ message: err.message });
    }
};
