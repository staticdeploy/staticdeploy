import logger from "services/logger";
import storage from "services/storage";

export default {
    name: "storage",
    checkHealth: async () => {
        const result = await storage.checkHealth();
        if (!result.isHealthy) {
            logger.error(result.details, "Storage health check failed");
        }
        return result;
    }
};
