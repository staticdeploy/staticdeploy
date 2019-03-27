import { every } from "lodash";

import Usecase from "../common/Usecase";
import { IHealthCheckResult } from "../entities/HealthCheckResult";

export default class CheckStoragesHealth extends Usecase {
    async exec(): Promise<IHealthCheckResult> {
        // Check the health of all storage services
        const healthCheckResults = await Promise.all([
            this.appsStorage.checkHealth(),
            this.bundlesStorage.checkHealth(),
            this.entrypointsStorage.checkHealth(),
            this.operationLogsStorage.checkHealth()
        ]);

        // Return an aggregate result
        return {
            isHealthy: every(healthCheckResults, "isHealthy"),
            // Only return details then the request is authenticated
            details: this.authorizer.isAuthenticated()
                ? {
                      appsStorage: healthCheckResults[0].details,
                      bundlesStorage: healthCheckResults[1].details,
                      entrypointsStorage: healthCheckResults[2].details,
                      operationLogsStorage: healthCheckResults[3].details
                  }
                : undefined
        };
    }
}
