import {
    fromRoleTuple,
    IGroup,
    RoleName,
    toRoleTuple,
} from "@staticdeploy/core/lib";
import { map } from "bluebird";
import Knex from "knex";

import tables from "../common/tables";

/*
 * Migrate group roles app-manager:appId -> app-manager:appName, as per changes
 * in v0.14.0
 */
export async function up(knex: Knex) {
    const groups = await knex<IGroup>(tables.groups);
    for (const group of groups) {
        const roles = await map(group.roles, async (role) => {
            const [name, target] = toRoleTuple(role);
            if (name !== RoleName.AppManager) {
                return role;
            }
            const [app] = await knex(tables.apps).where({ id: target });
            if (!app) {
                return role;
            }
            return fromRoleTuple([RoleName.AppManager, app.name]);
        });
        await knex(tables.groups)
            .where({ id: group.id })
            .update({ roles: roles });
    }
}

export function down() {
    // Knex migrations require a down function, but we're not interested in
    // providing one
}
