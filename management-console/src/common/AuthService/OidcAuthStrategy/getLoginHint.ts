import { User } from "oidc-client";

export default function getLoginHint(user: User): string | void {
    const { profile = {} } = user;
    return (
        // Azure AD
        profile.preferred_username ||
        // Google Identity Platform
        profile.sub
    );
}
