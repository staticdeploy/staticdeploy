import Sequelize = require("sequelize");

import IApp from "../types/IApp";

export type AppModel = Sequelize.Model<
    Sequelize.Instance<Partial<IApp>>,
    Partial<IApp>
>;

export default (sequelize: Sequelize.Sequelize): AppModel =>
    sequelize.define(
        "app",
        {
            id: { type: Sequelize.STRING, primaryKey: true },
            name: { type: Sequelize.STRING },
            defaultConfiguration: { type: Sequelize.JSON },
            createdAt: { type: Sequelize.DATE },
            updatedAt: { type: Sequelize.DATE }
        },
        { tableName: "apps" }
    );
