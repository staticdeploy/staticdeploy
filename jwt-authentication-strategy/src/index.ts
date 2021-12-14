import { JWK, JWT } from "@panva/jose";
import { IAuthenticationStrategy, IIdpUser } from "@staticdeploy/core";
import { has, isString } from "lodash";

export default class JwtAuthenticationStrategy
    implements IAuthenticationStrategy
{
    private verifyingKey: JWK.Key;
    constructor(secretOrPublicKey: Buffer) {
        this.verifyingKey = JWK.asKey(secretOrPublicKey);
    }

    async getIdpUserFromAuthToken(authToken: string): Promise<IIdpUser | null> {
        try {
            const jwt: any = JWT.verify(authToken, this.verifyingKey);
            return has(jwt, "sub") &&
                isString(jwt.sub) &&
                has(jwt, "iss") &&
                isString(jwt.iss)
                ? { idp: jwt.iss, id: jwt.sub }
                : null;
        } catch {
            // When errors occur, we simply return a null idp user
            return null;
        }
    }
}
