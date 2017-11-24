import logger from "services/logger";
import sequelize from "services/sequelize";

export const name = "database";
export const checkHealth = async () => {
    try {
        await sequelize.query("select 1");
    } catch (err) {
        logger.error(err, "Error executing test query");
        return {
            isHealthy: false,
            details: `Error executing test query ${err.message}`
        };
    }
    return {
        isHealthy: true
    };
};
