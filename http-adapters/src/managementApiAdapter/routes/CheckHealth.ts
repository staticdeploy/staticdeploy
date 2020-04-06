import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        appId: string;
    };
}

export default convroute({
    path: "/health",
    method: "get",
    description: "Get the health of the service",
    tags: ["health"],
    responses: {
        "200": { description: "Service healthy" },
        "503": { description: "Service unhealthy" },
    },
    handler: async (req: IRequest, res) => {
        const checkHealth = req.makeUsecase("checkHealth");
        const health = await checkHealth.exec();
        res.status(health.isHealthy ? 200 : 503).send(health);
    },
});
