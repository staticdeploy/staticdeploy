import { join } from "path";
import Umzug = require("umzug");

import logger from "services/logger";
import sequelize from "services/sequelize";

export async function migrate() {
    try {
        const umzug = new Umzug({
            storage: "sequelize",
            storageOptions: {
                sequelize: sequelize
            },
            migrations: {
                params: [sequelize.getQueryInterface()],
                path: join(__dirname, "/../migrations"),
                pattern: /\.(js|ts)$/
            },
            logging: false
        });
        logger.debug("Database migration started");
        await umzug.up();
        logger.debug("Database migration succeeded");
    } catch (err) {
        logger.error(err, "Database migration failed");
        throw err;
    }
}
