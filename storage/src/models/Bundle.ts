import { IBundle } from "@staticdeploy/common-types";
import Sequelize from "sequelize";

export type BundleModel = Sequelize.Model<
    Sequelize.Instance<Partial<IBundle>>,
    Partial<IBundle>
>;

export const BUNDLES_TABLE = "bundles";

export default (sequelize: Sequelize.Sequelize): BundleModel =>
    sequelize.define<Sequelize.Instance<Partial<IBundle>>, Partial<IBundle>>(
        "bundle",
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
            tableName: BUNDLES_TABLE,
            timestamps: true,
            updatedAt: false
        }
    );
