import { JWK, JWT } from "@panva/jose";
import { expect } from "chai";

import JwtAuthenticationStrategy from "../src";

describe("JwtAuthenticationStrategy", () => {
    describe("getIdpUserFromAuthToken", () => {
        function withSigningKey(
            type: string,
            secretOrPublicKey: Buffer,
            secretOrPrivateKey: Buffer
        ) {
            const iss = "iss";
            const aud = "aud";
            const sub = "sub";
            const jwtAuthenticationStrategy = new JwtAuthenticationStrategy(
                secretOrPublicKey,
                iss,
                aud
            );
            const signingKey = JWK.asKey(secretOrPrivateKey);
            describe(`cases with ${type} as signing key`, () => {
                it("returns null on un-decodable jwt", async () => {
                    const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                        "un-decodable"
                    );
                    expect(idpUser).to.equal(null);
                });

                it("returns null on jwt of wrong issuer", async () => {
                    const authToken = JWT.sign(
                        { sub: sub, iss: "different-iss", aud: aud },
                        signingKey
                    );
                    const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                        authToken
                    );
                    expect(idpUser).to.equal(null);
                });

                it("returns null on jwt of wrong audience", async () => {
                    const authToken = JWT.sign(
                        { sub: sub, iss: iss, aud: "different-aud" },
                        signingKey
                    );
                    const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                        authToken
                    );
                    expect(idpUser).to.equal(null);
                });

                it("returns null on jwt without sub", async () => {
                    const authToken = JWT.sign(
                        { iss: iss, aud: aud },
                        signingKey
                    );
                    const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                        authToken
                    );
                    expect(idpUser).to.equal(null);
                });

                it("returns null on jwt without iss", async () => {
                    const authToken = JWT.sign(
                        { sub: sub, aud: aud },
                        signingKey
                    );
                    const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                        authToken
                    );
                    expect(idpUser).to.equal(null);
                });

                it("returns null jwt with wrong signature", async () => {
                    const authToken = JWT.sign(
                        { sub: sub, iss: iss, aud: aud },
                        JWK.asKey(Buffer.from("different-secret"))
                    );
                    const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                        authToken
                    );
                    expect(idpUser).to.equal(null);
                });

                it("returns the idp user on valid jwt", async () => {
                    const authToken = JWT.sign(
                        { sub: sub, iss: iss, aud: aud },
                        signingKey
                    );
                    const idpUser = await jwtAuthenticationStrategy.getIdpUserFromAuthToken(
                        authToken
                    );
                    expect(idpUser).to.deep.equal({ id: sub, idp: iss });
                });
            });
        }

        const secret = "secret";
        withSigningKey(
            "symmetric secret",
            Buffer.from(secret),
            Buffer.from(secret)
        );

        const rsaKey = JWK.generateSync("RSA");
        withSigningKey(
            "rsa key",
            Buffer.from(rsaKey.toPEM()),
            Buffer.from(rsaKey.toPEM(true))
        );
    });
});
