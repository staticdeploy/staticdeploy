import { join } from "path";
import { Sequelize } from "sequelize-typescript";

import * as config from "config";

export default new Sequelize({
    url: config.DATABASE_URL,
    logging: false,
    modelPaths: [join(__dirname, "../models")]
});
