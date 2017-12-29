import Sequelize = require("sequelize");

import IEntrypoint from "../types/IEntrypoint";

export type EntrypointModel = Sequelize.Model<
    Sequelize.Instance<Partial<IEntrypoint>>,
    Partial<IEntrypoint>
>;

export default (sequelize: Sequelize.Sequelize): EntrypointModel =>
    sequelize.define(
        "entrypoint",
        {
            id: { type: Sequelize.STRING, primaryKey: true },
            appId: { type: Sequelize.STRING },
            urlMatcher: { type: Sequelize.STRING },
            fallbackResource: { type: Sequelize.STRING },
            configuration: { type: Sequelize.JSON },
            activeDeploymentId: { type: Sequelize.STRING },
            createdAt: { type: Sequelize.DATE },
            updatedAt: { type: Sequelize.DATE }
        },
        { tableName: "entrypoints" }
    );
