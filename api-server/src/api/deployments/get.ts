import { IEntrypoint } from "@staticdeploy/storage";
import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
    query: {
        entrypointIdOrUrlMatcher?: string;
    };
}

export default convroute({
    path: "/deployments",
    method: "get",
    description: "Get all deployments",
    tags: ["deployments"],
    parameters: [{ name: "entrypointIdOrUrlMatcher", in: "query" }],
    responses: {
        "200": { description: "Returns an array of all deployments" },
        "404": { description: "Filter entrypoint not found" }
    },
    handler: async (req: IRequest, res) => {
        const { entrypointIdOrUrlMatcher } = req.query;
        let filterEntrypoint: IEntrypoint | null = null;

        // Ensure the filter entrypoint exists
        if (entrypointIdOrUrlMatcher) {
            filterEntrypoint = await storage.entrypoints.findOneByIdOrUrlMatcher(
                entrypointIdOrUrlMatcher
            );
            if (!filterEntrypoint) {
                res.status(404).send({
                    message: `No entrypoint found with id or urlMatcher = ${entrypointIdOrUrlMatcher}`
                });
                return;
            }
        }

        const deployments = await (filterEntrypoint
            ? storage.deployments.findManyByEntrypointId(filterEntrypoint.id)
            : storage.deployments.findAll());
        res.status(200).send(deployments);
    }
});
