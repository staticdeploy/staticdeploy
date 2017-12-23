import * as Sequelize from "sequelize";

export const up = async (q: Sequelize.QueryInterface) => {
    await q.createTable("apps", {
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
            allowNull: false,
            defaultValue: {}
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

    await q.createTable("entrypoints", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: { model: "apps" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        urlMatcher: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        urlMatcherPriority: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        smartRoutingEnabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        activeDeploymentId: {
            type: Sequelize.STRING
        },
        configuration: {
            type: Sequelize.JSON
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

    await q.createTable("deployments", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        entrypointId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: { model: "entrypoints" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        description: {
            type: Sequelize.TEXT
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });

    await q.addConstraint("entrypoints", ["activeDeploymentId"], {
        type: "foreign key",
        references: {
            table: "deployments",
            field: "id"
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    });
};
