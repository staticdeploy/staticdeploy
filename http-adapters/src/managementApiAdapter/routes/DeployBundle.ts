import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    body: {
        appName: string;
        entrypointUrlMatcher: string;
        bundleNameTagCombination: string;
    };
}

const bodySchema = {
    type: "object",
    properties: {
        appName: { type: "string" },
        entrypointUrlMatcher: { type: "string" },
        bundleNameTagCombination: { type: "string" },
    },
    required: ["appName", "entrypointUrlMatcher", "bundleNameTagCombination"],
    additionalProperties: false,
};

export default convroute({
    path: "/deploy",
    method: "post",
    description: "Deploy a bundle to an entrypoint",
    tags: ["bundles"],
    parameters: [
        {
            name: "deploymentOptions",
            in: "body",
            required: true,
            schema: bodySchema,
        },
    ],
    responses: {
        "204": { description: "Bundle deployed to entrypoint" },
        "404": { description: "Bundle not found" },
        "409": { description: "Entrypoint does not link to the app" },
    },
    handler: async (req: IRequest, res) => {
        const deployBundle = req.makeUsecase("deployBundle");
        await deployBundle.exec(req.body);
        res.status(204).send();
    },
});
