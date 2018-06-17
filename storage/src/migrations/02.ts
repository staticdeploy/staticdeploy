import Sequelize from "sequelize";

import { BUNDLES_TABLE } from "../models/Bundle";

export const up = async (q: Sequelize.QueryInterface) => {
    await q.addColumn(BUNDLES_TABLE, "fallbackAssetPath", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "/index.html"
    });
};
