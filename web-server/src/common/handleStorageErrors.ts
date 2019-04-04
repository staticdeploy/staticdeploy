import * as storage from "@staticdeploy/storage";
import { IConvRoute } from "convexpress";

export default (
    handler: IConvRoute["handler"]
): IConvRoute["handler"] => async (req, res) => {
    try {
        await (handler as any)(req, res);
    } catch (err) {
        if (
            err instanceof storage.ConfigurationNotValidError ||
            err instanceof storage.AppNameNotValidError ||
            err instanceof storage.EntrypointUrlMatcherNotValidError ||
            err instanceof storage.BundleNameOrTagNotValidError ||
            err instanceof storage.BundleNameTagCombinationNotValidError ||
            err instanceof storage.BundleFallbackAssetNotFound
        ) {
            res.status(400).send({ message: err.message });
        } else if (
            err instanceof storage.AppNotFoundError ||
            err instanceof storage.BundleNotFoundError ||
            err instanceof storage.BundleAssetNotFoundError ||
            err instanceof storage.EntrypointNotFoundError ||
            err instanceof storage.OperationLogNotFoundError
        ) {
            res.status(404).send({ message: err.message });
        } else if (
            err instanceof storage.ConflictingAppError ||
            err instanceof storage.ConflictingEntrypointError ||
            err instanceof storage.BundleInUseError ||
            err instanceof storage.BundlesInUseError
        ) {
            res.status(409).send({ message: err.message });
        } else {
            throw err;
        }
    }
};
