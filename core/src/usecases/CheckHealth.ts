import Usecase from "../common/Usecase";
import { IHealthCheckResult } from "../entities/HealthCheckResult";

export default class CheckHealth extends Usecase {
    async exec(): Promise<IHealthCheckResult> {
        const healthCheckResult = await this.storages.checkHealth();
        return {
            isHealthy: healthCheckResult.isHealthy,
            details: (await this.authorizer.canSeeHealtCheckDetails())
                ? healthCheckResult.details
                : undefined
        };
    }
}
