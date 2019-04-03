import Usecase from "../common/Usecase";
import { IHealthCheckResult } from "../entities/HealthCheckResult";

export default class CheckStoragesHealth extends Usecase {
    async exec(): Promise<IHealthCheckResult> {
        const healthCheckResult = await this.storages.checkHealth();
        return {
            isHealthy: healthCheckResult.isHealthy,
            // Only return details then the request is authenticated
            details: this.authorizer.isAuthenticated()
                ? healthCheckResult.details
                : undefined
        };
    }
}
