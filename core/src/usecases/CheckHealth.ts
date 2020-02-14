import Usecase from "../common/Usecase";
import { IHealthCheckResult } from "../entities/HealthCheckResult";

type Arguments = [];
type ReturnValue = IHealthCheckResult;

export default class CheckHealth extends Usecase<Arguments, ReturnValue> {
    protected async _exec(): Promise<ReturnValue> {
        const healthCheckResult = await this.storages.checkHealth();
        return {
            isHealthy: healthCheckResult.isHealthy,
            details: this.authorizer.canSeeHealtCheckDetails()
                ? healthCheckResult.details
                : undefined
        };
    }
}
