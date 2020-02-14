import Knex from "knex";

import tables from "../common/tables";

/*
 * Create tables for externalCaches, added in v1.0.0
 */
export function up(knex: Knex) {
    return knex.schema.createTable(tables.externalCaches, table => {
        table.string("id").primary();
        table
            .string("domain")
            .unique()
            .notNullable();
        table.string("type").notNullable();
        table.json("configuration").notNullable();
        table.timestamp("createdAt").notNullable();
        table.timestamp("updatedAt").notNullable();
    });
}

export function down() {
    // Knex migrations require a down function, but we're not interested in
    // providing one
}
