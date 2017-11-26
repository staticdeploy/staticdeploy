import { Request } from "express";
import { Sequelize } from "sequelize-typescript";

import convroute from "common/convroute";
import Deployment from "models/Deployment";
import Entrypoint from "models/Entrypoint";

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
        const { query } = req;
        let filterEntrypoint: Entrypoint | null = null;

        // Ensure the filter entrypoint exists
        if (query.entrypointIdOrUrlMatcher) {
            filterEntrypoint = await Entrypoint.findOne({
                where: Sequelize.or(
                    { id: query.entrypointIdOrUrlMatcher },
                    { urlMatcher: query.entrypointIdOrUrlMatcher }
                )
            });
            if (!filterEntrypoint) {
                res.status(404).send({
                    message: `No entrypoint found with id or urlMatcher = ${
                        query.entrypointIdOrUrlMatcher
                    }`
                });
                return;
            }
        }

        // Find all deployments
        const deployments = await Deployment.findAll({
            where: {
                ...filterEntrypoint ? { entrypointId: filterEntrypoint.id } : {}
            }
        });

        // Respond to the client
        res.status(200).send(deployments);
    }
});
