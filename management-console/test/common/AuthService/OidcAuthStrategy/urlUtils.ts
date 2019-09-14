import { expect } from "chai";

import * as urlUtils from "../../../../src/common/AuthService/OidcAuthStrategy/urlUtils";

describe("OidcAuthStrategy urlUtils", () => {
    const originalWindow = (global as any).window;
    const setLocation = (href: string) =>
        ((global as any).window = { location: { href } });
    afterEach(() => {
        (global as any).window = originalWindow;
    });

    describe("getRedirectUrl / isRedirectPage", () => {
        it("getRedirectUrl produces a url which marks the page being a redirect page", () => {
            const baseRedirectUrl = "http://localhost:3000";
            setLocation(urlUtils.getRedirectUrl(baseRedirectUrl));
            expect(urlUtils.isRedirectPage()).to.equal(true);
        });
    });

    describe("getSilentRedirectUrl / isSilentRedirectIframe", () => {
        it("getSilentRedirectUrl produces a url which marks the page being a silent redirect page", () => {
            const baseRedirectUrl = "http://localhost:3000";
            setLocation(urlUtils.getSilentRedirectUrl(baseRedirectUrl));
            expect(urlUtils.isSilentRedirectPage()).to.equal(true);
        });
    });
});
