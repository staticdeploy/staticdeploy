import { Operation } from "@staticdeploy/common-types";

import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
    params: {
        appId: string;
    };
}

export default convroute({
    path: "/apps/:appId",
    method: "delete",
    description: "Delete app",
    tags: ["apps"],
    parameters: [
        {
            name: "appId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "204": { description: "App deleted, returns nothing" },
        "404": { description: "App not found" }
    },
    handler: async (req: IRequest, res) => {
        // Retrieve deleted app and linked entrypoints for the operation log
        const deletedApp = await storage.apps.findOneById(req.params.appId);
        const deletedEntrypoints = await storage.entrypoints.findManyByAppId(
            req.params.appId
        );

        await storage.apps.delete(req.params.appId);

        await req.logOperation(Operation.deleteApp, {
            deletedApp,
            deletedEntrypoints
        });

        res.status(204).send();
    }
});
