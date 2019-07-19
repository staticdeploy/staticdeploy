import * as sd from "@staticdeploy/core";
import { IConvRoute } from "convexpress";

const errorStatusMappings: [any, number][] = [
    [sd.AuthenticationRequiredError, 401],
    [sd.AuthorizationError, 403],
    [sd.ConfigurationNotValidError, 400],
    [sd.AppNameNotValidError, 400],
    [sd.AppNotFoundError, 404],
    [sd.ConflictingAppError, 409],
    [sd.BundleNameOrTagNotValidError, 400],
    [sd.BundleNameTagCombinationNotValidError, 400],
    [sd.BundleFallbackAssetNotFoundError, 400],
    [sd.BundleNotFoundError, 404],
    [sd.BundlesInUseError, 409],
    [sd.EntrypointUrlMatcherNotValidError, 400],
    [sd.EntrypointNotFoundError, 404],
    [sd.ConflictingEntrypointError, 409],
    [sd.EntrypointMismatchedAppIdError, 400],
    [sd.NoMatchingEntrypointError, 404],
    [sd.NoBundleOrRedirectToError, 404],
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
