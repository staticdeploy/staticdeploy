import { JWK, JWKS, JWT } from "@panva/jose";
import Logger from "bunyan";
import { expect } from "chai";
import nock from "nock";

import OidcAuthenticationStrategy from "../src";

describe("OidcAuthenticationStrategy", () => {
    describe("getIdpUserFromAuthToken", () => {
        const openidConfigurationUrl = "http://openid-configuration.localhost";
        const jwksUrl = "http://jwks.localhost";
        const clientId = "clientId";
        const logger = Logger.createLogger({ name: "test", streams: [] });
        const signingKey = JWK.generateSync("RSA");
        const iss = "iss";
        const sub = "sub";

        it("fetches the openid configuration and the jwks", async () => {
            nock.cleanAll();
            const keyStore = new JWKS.KeyStore();
            keyStore.generateSync("RSA");
            const openidScope = nock(openidConfigurationUrl)
                .get("/")
                .reply(200, { issuer: "issuer", jwks_uri: jwksUrl });
            const jwksScope = nock(jwksUrl)
                .get("/")
                .reply(200, keyStore.toJWKS());
            const oidcAuthenticationStrategy = new OidcAuthenticationStrategy(
                openidConfigurationUrl,
                clientId,
                logger
            );
            await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                "authToken"
            );
            openidScope.done();
            jwksScope.done();
        });

        it("caches the fetch for the openid configuration and the jwks", async () => {
            nock.cleanAll();
            const keyStore = new JWKS.KeyStore();
            keyStore.generateSync("RSA");
            const openidScope = nock(openidConfigurationUrl)
                .get("/")
                .twice()
                .reply(200, { issuer: "issuer", jwks_uri: jwksUrl });
            const jwksScope = nock(jwksUrl)
                .get("/")
                .twice()
                .reply(200, keyStore.toJWKS());
            const oidcAuthenticationStrategy = new OidcAuthenticationStrategy(
                openidConfigurationUrl,
                clientId,
                logger
            );
            await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                "authToken"
            );
            await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                "authToken"
            );
            expect(openidScope.isDone()).to.equal(false);
            expect(jwksScope.isDone()).to.equal(false);
        });

        describe("returns", () => {
            const oidcAuthenticationStrategy = new OidcAuthenticationStrategy(
                openidConfigurationUrl,
                clientId,
                logger
            );

            before(() => {
                nock.cleanAll();
                nock(openidConfigurationUrl)
                    .get("/")
                    .reply(200, { issuer: iss, jwks_uri: jwksUrl });
                nock(jwksUrl)
                    .get("/")
                    .reply(200, new JWKS.KeyStore([signingKey]).toJWKS());
            });

            it("null on un-decodable jwt", async () => {
                const idpUser = await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                    "un-decodable"
                );
                expect(idpUser).to.equal(null);
            });

            it("null on jwt with header.kid not corresponding to any signing key", async () => {
                const authToken = JWT.sign(
                    { sub: sub, iss: iss, aud: clientId },
                    signingKey,
                    { kid: false, header: { kid: "different-kid" } }
                );
                const idpUser = await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                    authToken
                );
                expect(idpUser).to.equal(null);
            });

            it("null on jwt of wrong issuer", async () => {
                const authToken = JWT.sign(
                    { sub: sub, iss: "different-iss", aud: clientId },
                    signingKey
                );
                const idpUser = await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                    authToken
                );
                expect(idpUser).to.equal(null);
            });

            it("null on jwt of wrong audience", async () => {
                const authToken = JWT.sign(
                    { sub: sub, iss: iss, aud: "difference-clientId" },
                    signingKey
                );
                const idpUser = await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                    authToken
                );
                expect(idpUser).to.equal(null);
            });

            it("null on invalid jwt signature", async () => {
                const authToken = JWT.sign(
                    { sub: sub, iss: iss, aud: clientId },
                    JWK.generateSync("RSA"),
                    { kid: false, header: { kid: signingKey.kid } }
                );
                const idpUser = await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                    authToken
                );
                expect(idpUser).to.equal(null);
            });

            it("the idp user on valid jwt", async () => {
                const authToken = JWT.sign(
                    { sub: sub, iss: iss, aud: clientId },
                    signingKey
                );
                const idpUser = await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                    authToken
                );
                expect(idpUser).to.deep.equal({ id: sub, idp: iss });
            });
        });
    });
});
