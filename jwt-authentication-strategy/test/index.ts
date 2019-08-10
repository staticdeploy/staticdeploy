import { expect } from "chai";
import { sign } from "jsonwebtoken";

import JwtAuthenticationStrategy from "../src";

describe("JwtAuthenticationStrategy", () => {
    const secret = Buffer.from("secret");
    const iss = "iss";
    const aud = "aud";
    const sub = "sub";
    const jwtAuthenticationStrategy = new JwtAuthenticationStrategy(
        secret,
        iss,
        aud
    );

    describe("getIdpUserFromAuthToken", () => {
        it("returns null on invalid jwt", async () => {
            const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                "invalid"
            );
            expect(idpUser).to.equal(null);
        });

        it("returns null on jwt of wrong issuer", async () => {
            const authToken = sign(
                { sub: sub, iss: "different-iss", aud: aud } as any,
                secret
            );
            const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                authToken
            );
            expect(idpUser).to.equal(null);
        });

        it("returns null on jwt of wrong audience", async () => {
            const authToken = sign(
                { sub: sub, iss: iss, aud: "different-aud" } as any,
                secret
            );
            const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                authToken
            );
            expect(idpUser).to.equal(null);
        });

        it("returns null on jwt without sub", async () => {
            const authToken = sign({ iss: iss, aud: aud } as any, secret);
            const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                authToken
            );
            expect(idpUser).to.equal(null);
        });

        it("returns null on jwt without iss", async () => {
            const authToken = sign({ sub: sub, aud: aud } as any, secret);
            const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                authToken
            );
            expect(idpUser).to.equal(null);
        });

        it("returns the idp user on valid jwt", async () => {
            const authToken = sign(
                { sub: sub, iss: iss, aud: aud } as any,
                secret
            );
            const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                authToken
            );
            expect(idpUser).to.deep.equal({ id: sub, idp: iss });
        });
    });
});
