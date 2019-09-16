import { JWK, JWT } from "@panva/jose";
import { expect } from "chai";

import isAuthTokenExpired from "../../../../src/common/AuthService/OidcAuthStrategy/isAuthTokenExpired";

const signingKey = JWK.generateSync("RSA");

describe("OidcAuthStrategy util isAuthTokenExpired", () => {
    describe("returns wether a jwt auth token is expired or not", () => {
        it("case: expired", () => {
            const nowInSeconds = Date.now() / 1000;
            const jwt = JWT.sign({ exp: nowInSeconds - 1000 }, signingKey);
            expect(isAuthTokenExpired(jwt)).to.equal(true);
        });

        it("case: not expired", () => {
            const nowInSeconds = Date.now() / 1000;
            const jwt = JWT.sign({ exp: nowInSeconds + 1000 }, signingKey);
            expect(isAuthTokenExpired(jwt)).to.equal(false);
        });
    });
});
