import { IApp } from "@staticdeploy/storage";
import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
    query: {
        appIdOrName?: string;
    };
}

export default convroute({
    path: "/entrypoints",
    method: "get",
    description: "Get all entrypoints",
    tags: ["entrypoints"],
    parameters: [{ name: "appIdOrName", in: "query" }],
    responses: {
        "200": { description: "Returns an array of all entrypoints" },
        "404": { description: "Filter app not found" }
    },
    handler: async (req: IRequest, res) => {
        const { appIdOrName } = req.query;
        let filterApp: IApp | null = null;

        // Ensure the filter app exists
        if (appIdOrName) {
            filterApp = await storage.apps.findOneByIdOrName(appIdOrName);
            if (!filterApp) {
                res.status(404).send({
                    message: `No app found with id or name = ${appIdOrName}`
                });
                return;
            }
        }

        const entrypoints = await (filterApp
            ? storage.entrypoints.findManyByAppId(filterApp.id)
            : storage.entrypoints.findAll());
        res.status(200).send(entrypoints);
    }
});
