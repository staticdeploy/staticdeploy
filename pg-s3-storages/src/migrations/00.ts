import Knex from "knex";

import { APPS_TABLE } from "../AppsStorage";
import { BUNDLES_TABLE } from "../BundlesStorage";
import { ENTRYPOINTS_TABLE } from "../EntrypointsStorage";
import { OPERATION_LOGS_TABLE } from "../OperationLogsStorage";

export function up(knex: Knex) {
    return knex.schema
        .createTable(APPS_TABLE, table => {
            table.string("id").primary();
            table
                .string("name")
                .unique()
                .notNullable();
            table.json("defaultConfiguration").notNullable();
            table.timestamp("createdAt").notNullable();
            table.timestamp("updatedAt").notNullable();
        })
        .createTable(BUNDLES_TABLE, table => {
            table.string("id").primary();
            table.string("name").notNullable();
            table.string("tag").notNullable();
            table.index(["name", "tag"]);
            table.text("description").notNullable();
            table.string("hash").notNullable();
            table.json("assets").notNullable();
            table.string("fallbackAssetPath").notNullable();
            table.integer("fallbackStatusCode").notNullable();
            table.timestamp("createdAt").notNullable();
        })
        .createTable(ENTRYPOINTS_TABLE, table => {
            table.string("id").primary();
            table
                .string("urlMatcher")
                .unique()
                .notNullable();
            table
                .string("appId")
                .notNullable()
                .references("id")
                .inTable(APPS_TABLE);
            table
                .string("bundleId")
                .references("id")
                .inTable(BUNDLES_TABLE);
            table.string("redirectTo");
            table.json("configuration");
            table.timestamp("createdAt").notNullable();
            table.timestamp("updatedAt").notNullable();
        })
        .createTable(OPERATION_LOGS_TABLE, table => {
            table.string("id").primary();
            table.string("operation").notNullable();
            table.json("parameters").notNullable();
            table.string("performedBy").notNullable();
            table.timestamp("performedAt").notNullable();
        });
}

export function down() {
    // Knex migrations require a down function. In theory here we should drop
    // the tables created above, but since we're likely never going to migrate
    // down from the initial setup, to avoid accidental damage we implement this
    // function as a no-op
}
