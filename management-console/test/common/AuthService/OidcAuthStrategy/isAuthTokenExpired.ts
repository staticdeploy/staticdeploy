import { expect } from "chai";

import isAuthTokenExpired from "../../../../src/common/AuthService/OidcAuthStrategy/isAuthTokenExpired";

describe("OidcAuthStrategy util isAuthTokenExpired", () => {
    describe("returns wether a jwt auth token is expired or not", () => {
        it("case: expired", () => {
            const nowInSeconds = Date.now() / 1000;
            expect(isAuthTokenExpired(nowInSeconds - 1000)).to.equal(true);
        });

        it("case: not expired", () => {
            const nowInSeconds = Date.now() / 1000;
            expect(isAuthTokenExpired(nowInSeconds + 1000)).to.equal(false);
        });
    });
});
