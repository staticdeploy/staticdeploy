import { join } from "path";
import { Sequelize } from "sequelize-typescript";

import * as config from "config";
import logger from "services/logger";

const sequelize = new Sequelize({
    url: config.DATABASE_URL,
    logging: false,
    modelPaths: [join(__dirname, "../models")]
});

sequelize.addHook("afterConnect", async () => {
    logger.info("Connected to database");
    logger.debug("Setting sqlite pragma");
    await sequelize.query("PRAGMA foreign_keys = ON;");
    logger.debug("sqlite pragma set successfully");
});

export default sequelize;
