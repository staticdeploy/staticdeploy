import { IAsset, IBundle } from "@staticdeploy/common-types";
import Sequelize from "sequelize";

export class BundleModel extends Sequelize.Model implements IBundle {
    id!: string;
    name!: string;
    tag!: string;
    description!: string;
    hash!: string;
    assets!: IAsset[];
    fallbackAssetPath!: string;
    fallbackStatusCode!: number;
    createdAt!: Date;
}

export const BUNDLES_TABLE = "bundles";

export default (sequelize: Sequelize.Sequelize): typeof BundleModel => {
    BundleModel.init(
        {
            id: { type: Sequelize.STRING, primaryKey: true },
            name: { type: Sequelize.STRING },
            tag: { type: Sequelize.STRING },
            description: { type: Sequelize.TEXT },
            hash: { type: Sequelize.STRING },
            assets: { type: Sequelize.JSON },
            fallbackAssetPath: { type: Sequelize.STRING },
            fallbackStatusCode: { type: Sequelize.INTEGER },
            createdAt: { type: Sequelize.DATE }
        },
        {
            sequelize: sequelize,
            tableName: BUNDLES_TABLE,
            timestamps: true,
            updatedAt: false
        }
    );
    return BundleModel;
};
