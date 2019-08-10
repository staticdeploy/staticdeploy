import { IAuthenticationStrategy, IIdpUser } from "@staticdeploy/core";
import { verify } from "jsonwebtoken";
import { has, isString } from "lodash";

export default class JwtAuthenticationStrategy
    implements IAuthenticationStrategy {
    constructor(
        private secretOrPublicKey: Buffer,
        private issuer: string,
        private audience: string
    ) {}

    async getIdpUserFromAuthToken(authToken: string): Promise<IIdpUser | null> {
        try {
            const jwt: any = verify(authToken, this.secretOrPublicKey, {
                issuer: this.issuer,
                audience: this.audience
            });
            return has(jwt, "sub") && isString(jwt.sub)
                ? { idp: jwt.iss, id: jwt.sub }
                : null;
        } catch {
            return null;
        }
    }
}
