import Knex from "knex";

import tables from "../common/tables";

export function up(knex: Knex) {
    return knex.schema
        .createTable(tables.groups, table => {
            table.string("id").primary();
            table
                .string("name")
                .unique()
                .notNullable()
                .index();
            table.specificType("roles", "varchar(255)[]").notNullable();
            table.timestamp("createdAt").notNullable();
            table.timestamp("updatedAt").notNullable();
        })
        .createTable(tables.users, table => {
            table.string("id").primary();
            table.string("idp").notNullable();
            table.string("idpId").notNullable();
            table.unique(["idp", "idpId"]);
            table.string("type").notNullable();
            table.string("name").notNullable();
            table.timestamp("createdAt").notNullable();
            table.timestamp("updatedAt").notNullable();
        })
        .createTable(tables.usersAndGroups, table => {
            table
                .string("userId")
                .notNullable()
                .index()
                .references("id")
                .inTable(tables.users)
                .onDelete("CASCADE");
            table
                .string("groupId")
                .notNullable()
                .index()
                .references("id")
                .inTable(tables.groups);
            table.primary(["userId", "groupId"]);
        });
}

export function down() {
    // Knex migrations require a down function. In theory here we should drop
    // the tables created above, but since we're likely never going to migrate
    // down from the initial setup, to avoid accidental damage we implement this
    // function as a no-op
}
