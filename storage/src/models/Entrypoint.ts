import { IConfiguration, IEntrypoint } from "@staticdeploy/common-types";
import Sequelize from "sequelize";

export class EntrypointModel extends Sequelize.Model implements IEntrypoint {
    id!: string;
    appId!: string;
    bundleId!: string | null;
    redirectTo!: string | null;
    urlMatcher!: string;
    configuration!: IConfiguration | null;
    createdAt!: Date;
    updatedAt!: Date;
}

export const ENTRYPOINTS_TABLE = "entrypoints";

export default (sequelize: Sequelize.Sequelize): typeof EntrypointModel => {
    EntrypointModel.init(
        {
            id: { type: Sequelize.STRING, primaryKey: true },
            appId: { type: Sequelize.STRING },
            bundleId: { type: Sequelize.STRING },
            redirectTo: { type: Sequelize.STRING },
            urlMatcher: { type: Sequelize.STRING },
            configuration: { type: Sequelize.JSON },
            createdAt: { type: Sequelize.DATE },
            updatedAt: { type: Sequelize.DATE }
        },
        {
            sequelize: sequelize,
            tableName: ENTRYPOINTS_TABLE
        }
    );

    return EntrypointModel;
};
