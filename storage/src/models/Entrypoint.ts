import Sequelize from "sequelize";

import IEntrypoint from "../types/IEntrypoint";

export type EntrypointModel = Sequelize.Model<
    Sequelize.Instance<Partial<IEntrypoint>>,
    Partial<IEntrypoint>
>;

export const ENTRYPOINTS_TABLE = "entrypoints";

export default (sequelize: Sequelize.Sequelize): EntrypointModel =>
    sequelize.define(
        "entrypoint",
        {
            id: { type: Sequelize.STRING, primaryKey: true },
            appId: { type: Sequelize.STRING },
            bundleId: { type: Sequelize.STRING },
            urlMatcher: { type: Sequelize.STRING },
            configuration: { type: Sequelize.JSON },
            createdAt: { type: Sequelize.DATE },
            updatedAt: { type: Sequelize.DATE }
        },
        { tableName: ENTRYPOINTS_TABLE }
    );
