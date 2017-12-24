import {
    AppNotFoundError,
    ConflictingAppError,
    ConflictingEntrypointError,
    DeploymentNotFoundError,
    EntrypointNotFoundError
} from "@staticdeploy/storage";
import { IConvRoute } from "convexpress";

export default (
    handler: IConvRoute["handler"]
): IConvRoute["handler"] => async (req, res) => {
    try {
        await (handler as any)(req, res);
    } catch (err) {
        if (
            err instanceof AppNotFoundError ||
            err instanceof DeploymentNotFoundError ||
            err instanceof EntrypointNotFoundError
        ) {
            res.status(404).send({ message: err.message });
        } else if (
            err instanceof ConflictingAppError ||
            err instanceof ConflictingEntrypointError
        ) {
            res.status(409).send({ message: err.message });
        } else {
            throw err;
        }
    }
};
