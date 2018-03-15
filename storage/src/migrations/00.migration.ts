import Sequelize from "sequelize";

import { APPS_TABLE } from "../models/App";
import { BUNDLES_TABLE } from "../models/Bundle";
import { ENTRYPOINTS_TABLE } from "../models/Entrypoint";

export const up = async (q: Sequelize.QueryInterface) => {
    await q.createTable(BUNDLES_TABLE, {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        tag: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        hash: {
            type: Sequelize.STRING,
            allowNull: false
        },
        assets: {
            type: Sequelize.JSON,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });

    await q.createTable(APPS_TABLE, {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        defaultConfiguration: {
            type: Sequelize.JSON,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });

    await q.createTable(ENTRYPOINTS_TABLE, {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: { model: "apps" }
        },
        bundleId: {
            type: Sequelize.STRING,
            allowNull: true,
            references: { model: "bundles" }
        },
        urlMatcher: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        configuration: {
            type: Sequelize.JSON,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });
};
