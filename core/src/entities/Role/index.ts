import matchesUrlMatcher from "./matchesUrlMatcher";

export enum RoleName {
    Root = "root",
    AppManager = "app-manager",
    EntrypointCreator = "entrypoint-creator",
    EntrypointManager = "entrypoint-manager",
    BundleManager = "bundle-manager"
}

export type RoleTuple = [RoleName, string?];

export function roleMatchesRole(
    inputRole: string,
    targetRole: RoleTuple
): boolean {
    const [inputRoleName, inputRoleTarget] = inputRole.split(":");
    const [targetRoleName, targetRoleTarget] = targetRole;
    switch (targetRoleName) {
        /*
         *  The Root role has no target. It allows the user to perform every
         *  operation
         */
        case RoleName.Root:
            return inputRoleName === targetRoleName;

        /*
         *  The target of the AppManager, BundleManager, and EntrypointManager
         *  roles is respectively an app id, a bundle id, or an entrypoint id.
         *  The target specifies the resource the role allows access to.
         *  Example:
         *
         *  - role app-manager:12345678 allows managing app with id 12345678
         */
        case RoleName.AppManager:
        case RoleName.EntrypointManager:
        case RoleName.BundleManager:
            return (
                inputRoleName === targetRoleName &&
                inputRoleTarget === targetRoleTarget
            );

        /*
         *  The target of the EntrypointCreator role is a urlMatcher-matcher,
         *  that is, a string that matches urlMatchers. urlMatcher-matchers are
         *  required so that roles can allow creating entrypoints:
         *
         *  - for a certain hostname and all of its sub-hostnames
         *  - for a certain hostname and all other hostnames ending with that
         *    hostname
         *  - for a certain path and all of its sub-paths
         *
         *  Examples:
         *
         *  - role entrypoint-creator:example.com/
         *    - can create entrypoints for:
         *      - example.com/
         *      - example.com/sub/
         *    - can't create entrypoints for:
         *      - sub.example.com/
         *      - pre-example.com/
         *
         *  - role entrypoint-creator:*.example.com/
         *    - can create entrypoints for:
         *      - sub.example.com/
         *      - sub.example.com/sub/
         *    - can't create entrypoints for:
         *      - example.com/
         *
         *  - role entrypoint-creator:*example.com/
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
        case RoleName.EntrypointCreator:
            return (
                inputRoleName === targetRoleName &&
                matchesUrlMatcher(inputRoleTarget, targetRoleTarget!)
            );

        default:
            return false;
    }
}

export function oneOfRolesMatchesRole(
    inputRoles: string[],
    targetRole: RoleTuple
): boolean {
    return inputRoles.some(inputRole => roleMatchesRole(inputRole, targetRole));
}
