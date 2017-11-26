import { Request } from "express";
import { Sequelize } from "sequelize-typescript";

import convroute from "common/convroute";
import App from "models/App";
import Entrypoint from "models/Entrypoint";

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
        const { query } = req;
        let filterApp: App | null = null;

        // Ensure the filter app exists
        if (query.appIdOrName) {
            filterApp = await App.findOne({
                where: Sequelize.or(
                    { id: query.appIdOrName },
                    { name: query.appIdOrName }
                )
            });
            if (!filterApp) {
                res.status(404).send({
                    message: `No app found with id or name = ${
                        query.appIdOrName
                    }`
                });
                return;
            }
        }

        // Find all entrypoints
        const entrypoints = await Entrypoint.findAll({
            where: filterApp ? { appId: filterApp.id } : {}
        });

        // Respond to the client
        res.status(200).send(entrypoints);
    }
});
