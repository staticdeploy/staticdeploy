import values from "lodash/values";

import { RoleNotValidError } from "../../common/errors";
import matchesName from "./matchesName";
import matchesUrlMatcher from "./matchesUrlMatcher";
import separatorChar from "./separatorChar";

export enum RoleName {
    Root = "root",
    AppManager = "app-manager",
    EntrypointManager = "entrypoint-manager",
    BundleManager = "bundle-manager",
}

export type RoleTuple = [RoleName, string?];

export function isRoleValid(role: string): boolean {
    const tokens = role.split(separatorChar);
    const [name] = tokens;
    return (
        (values(RoleName) as string[]).includes(name) &&
        (name === RoleName.Root ? tokens.length === 1 : tokens.length === 2)
    );
}
export function validateRole(role: string): void {
    if (!isRoleValid(role)) {
        throw new RoleNotValidError(role);
    }
}

export function fromRoleTuple(roleTuple: RoleTuple): string {
    return roleTuple.join(separatorChar);
}

export function toRoleTuple(role: string): RoleTuple {
    return role.split(separatorChar) as RoleTuple;
}

export function roleMatchesRole(
    heldRole: string,
    requiredRole: RoleTuple
): boolean {
    const [heldRoleName, heldRoleTarget] = toRoleTuple(heldRole);
    const [requiredRoleName, requiredRoleTarget] = requiredRole;
    switch (requiredRoleName) {
        /*
         *  The Root role has no target, and it allows the user to perform every
         *  operation
         */
        case RoleName.Root:
            return heldRoleName === requiredRoleName;

        /*
         *  The target of the AppManager and BundleManager roles is a
         *  name-matcher for an app name or a bundle name (respectively). The
         *  name-matcher allows managing resources whose name match it. Example:
         *
         *  - role app-manager:my-app allows managing app with name my-app
         *  - role app-manager:*my-app allows managing app with name
         *    prefix-my-app
         *  - role app-manager:my-app* allows managing app with name
         *    my-app-suffix
         *  - role app-manager:* allows managing apps with any name
         */
        case RoleName.AppManager:
        case RoleName.BundleManager:
            return (
                heldRoleName === requiredRoleName &&
                matchesName(heldRoleTarget!, requiredRoleTarget!)
            );

        /*
         *  The target of the EntrypointManager role is a urlMatcher-matcher,
         *  that is, a string that matches urlMatchers. urlMatcher-matchers are
         *  used so that roles can allow managing entrypoints:
         *
         *  - for a certain hostname and all of its sub-hostnames
         *  - for a certain hostname and all other hostnames ending with that
         *    hostname
         *  - for a certain path and all of its sub-paths
         *
         *  Examples:
         *
         *  - role entrypoint-manager:example.com/
         *    - can create entrypoints for:
         *      - example.com/
         *      - example.com/sub/
         *    - can't create entrypoints for:
         *      - sub.example.com/
         *      - pre-example.com/
         *
         *  - role entrypoint-manager:*.example.com/
         *    - can create entrypoints for:
         *      - sub.example.com/
         *      - sub.example.com/sub/
         *    - can't create entrypoints for:
         *      - example.com/
         *
         *  - role entrypoint-manager:*example.com/
         *    - can create entrypoints for:
         *      - example.com/
         *      - example.com/sub/
         *      - pre-example.com/
         *      - pre-example.com/sub/
         *      - sub.example.com/
         *      - sub.example.com/sub/
         *
         *  Currently urlMatcher-matchers are just urlMatchers with an optional
         *  * or *. prefix. As shown by the example above:
         *
         *  - *example.com matches every hostname that ends in example.com
         *    (pre-example.com, sub.example.com, etc)
         *
         *  - *.example.com matches every hostname that ends in .example.com
         *    (sub.example.com, but not pre-example.com, nor example.com)
         */
        case RoleName.EntrypointManager:
            return (
                heldRoleName === requiredRoleName &&
                matchesUrlMatcher(heldRoleTarget!, requiredRoleTarget!)
            );

        default:
            return false;
    }
}

export function oneOfRolesMatchesRole(
    heldRoles: string[],
    requiredRole: RoleTuple
): boolean {
    return heldRoles.some((inputRole) =>
        roleMatchesRole(inputRole, requiredRole)
    );
}
