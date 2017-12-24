import Sequelize = require("sequelize");

import IDeployment from "../types/IDeployment";

export type DeploymentModel = Sequelize.Model<
    Sequelize.Instance<Partial<IDeployment>>,
    Partial<IDeployment>
>;

export default (sequelize: Sequelize.Sequelize): DeploymentModel =>
    sequelize.define(
        "deployment",
        {
            id: { type: Sequelize.STRING, primaryKey: true },
            entrypointId: { type: Sequelize.STRING },
            description: { type: Sequelize.TEXT },
            createdAt: { type: Sequelize.DATE }
        },
        {
            tableName: "deployments",
            timestamps: true,
            updatedAt: false
        }
    );
