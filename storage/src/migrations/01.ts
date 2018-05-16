import Sequelize from "sequelize";

import { ENTRYPOINTS_TABLE } from "../models/Entrypoint";

export const up = async (q: Sequelize.QueryInterface) => {
    await q.addColumn(ENTRYPOINTS_TABLE, "redirectTo", {
        type: Sequelize.STRING,
        allowNull: true
    });
};
