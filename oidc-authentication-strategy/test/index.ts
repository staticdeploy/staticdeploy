import { JWK, JWKS, JWT } from "@panva/jose";
import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";

import OidcAuthenticationStrategy from "../src";

describe("OidcAuthenticationStrategy", () => {
    const openidConfigurationUrl = "http://openid-configuration.localhost";
    const jwksUrl = "http://jwks.localhost";
    const clientId = "clientId";

    const getMockLogger = () => ({
        addToContext: sinon.stub(),
        info: sinon.stub(),
        error: sinon.stub()
    });

    describe("setup", () => {
        it("logs an error if an error occurs fetching the openid configuration", async () => {
            const mockLogger = getMockLogger();
            nock(openidConfigurationUrl)
                .get("/")
                .reply(400);
            const oidcAuthenticationStrategy = new OidcAuthenticationStrategy(
                openidConfigurationUrl,
                clientId,
                mockLogger
            );
            const setupPromise = oidcAuthenticationStrategy.setup();
            await expect(setupPromise).to.be.rejectedWith(
                "Request failed with status code 400"
            );
            expect(
                mockLogger.error
            ).to.have.been.calledWith(
                "OidcAuthenticationStrategy: error fetching openid configuration",
                { error: sinon.match.instanceOf(Error) }
            );
        });

        it("logs an error if an error occurs fetching jwks", async () => {
            const mockLogger = getMockLogger();
            nock(openidConfigurationUrl)
                .get("/")
                .reply(200, { jwks_uri: jwksUrl });
            nock(jwksUrl)
                .get("/")
                .reply(400);
            const oidcAuthenticationStrategy = new OidcAuthenticationStrategy(
                openidConfigurationUrl,
                clientId,
                mockLogger
            );
            const setupPromise = oidcAuthenticationStrategy.setup();
            await expect(setupPromise).to.be.rejectedWith(
                "Request failed with status code 400"
            );
            expect(
                mockLogger.error
            ).to.have.been.calledWith(
                "OidcAuthenticationStrategy: error fetching jwks",
                { error: sinon.match.instanceOf(Error) }
            );
        });

        it("fetches the openid configuration and the jwks", async () => {
            const openidScope = nock(openidConfigurationUrl)
                .get("/")
                .reply(200, { issuer: "issuer", jwks_uri: jwksUrl });
            const keyStore = new JWKS.KeyStore();
            keyStore.generateSync("RSA");
            const jwksScope = nock(jwksUrl)
                .get("/")
                .reply(200, keyStore.toJWKS());
            const oidcAuthenticationStrategy = new OidcAuthenticationStrategy(
                openidConfigurationUrl,
                clientId,
                getMockLogger()
            );
            await oidcAuthenticationStrategy.setup();
            openidScope.done();
            jwksScope.done();
        });
    });

    describe("getIdpUserFromAuthToken", () => {
        const signingKey = JWK.generateSync("RSA");
        const iss = "iss";
        const sub = "sub";
        const oidcAuthenticationStrategy = new OidcAuthenticationStrategy(
            openidConfigurationUrl,
            clientId,
            getMockLogger()
        );

        before(async () => {
            nock(openidConfigurationUrl)
                .get("/")
                .reply(200, { issuer: iss, jwks_uri: jwksUrl });
            nock(jwksUrl)
                .get("/")
                .reply(200, new JWKS.KeyStore([signingKey]).toJWKS());
            await oidcAuthenticationStrategy.setup();
        });

        it("returns null on un-decodable jwt", async () => {
            const idpUser = await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                "un-decodable"
            );
            expect(idpUser).to.equal(null);
        });

        it("returns null on jwt with header.kid not corresponding to any signing key", async () => {
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

        it("returns null on jwt of wrong issuer", async () => {
            const authToken = JWT.sign(
                { sub: sub, iss: "different-iss", aud: clientId },
                signingKey
            );
            const idpUser = await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                authToken
            );
            expect(idpUser).to.equal(null);
        });

        it("returns null on jwt of wrong audience", async () => {
            const authToken = JWT.sign(
                { sub: sub, iss: iss, aud: "difference-clientId" },
                signingKey
            );
            const idpUser = await oidcAuthenticationStrategy.getIdpUserFromAuthToken(
                authToken
            );
            expect(idpUser).to.equal(null);
        });

        it("returns null on invalid jwt signature", async () => {
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

        it("returns the idp user on valid jwt", async () => {
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
