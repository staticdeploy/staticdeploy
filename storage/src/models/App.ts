import { IApp, IConfiguration } from "@staticdeploy/common-types";
import Sequelize from "sequelize";

export class AppModel extends Sequelize.Model implements IApp {
    id!: string;
    name!: string;
    defaultConfiguration!: IConfiguration;
    createdAt!: Date;
    updatedAt!: Date;
}

export const APPS_TABLE = "apps";

export default (sequelize: Sequelize.Sequelize): typeof AppModel => {
    AppModel.init(
        {
            id: { type: Sequelize.STRING, primaryKey: true },
            name: { type: Sequelize.STRING },
            defaultConfiguration: { type: Sequelize.JSON },
            createdAt: { type: Sequelize.DATE },
            updatedAt: { type: Sequelize.DATE }
        },
        {
            sequelize: sequelize,
            tableName: APPS_TABLE
        }
    );
    return AppModel;
};
