import { map, pick } from "lodash";

import convroute from "common/convroute";
import storage from "services/storage";

export default convroute({
    path: "/bundles",
    method: "get",
    description: "Get all bundles",
    tags: ["bundles"],
    responses: {
        "200": {
            description:
                "Returns an array of all bundles with only the most important inforrmation"
        }
    },
    handler: async (_req, res) => {
        const bundles = await storage.bundles.findAll();

        // Include only the most important information about the bundles
        const strippedBundles = map(bundles, bundle =>
            pick(bundle, ["id", "name", "tag", "createdAt"])
        );

        res.status(200).send(strippedBundles);
    }
});
