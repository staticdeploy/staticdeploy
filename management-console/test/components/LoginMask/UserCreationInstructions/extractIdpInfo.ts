import { NoUserCorrespondingToIdpUserError } from "@staticdeploy/core";
import { expect } from "chai";

import extractIdpInfo from "../../../../src/components/LoginMask/UserCreationInstructions/extractIdpInfo";

describe("LoginMask extractIdpInfo util", () => {
    describe("extracts idp info from a NoUserCorrespondingToIdpUserError message", () => {
        it("case: simple characters", () => {
            const idp = "staticdeploy.staticdeploy.io";
            const idpId = "first.last";
            const idpInfo = extractIdpInfo(
                new NoUserCorrespondingToIdpUserError({ idp: idp, id: idpId })
                    .message
            );
            expect(idpInfo).to.deep.equal({
                idp: idp,
                idpId: idpId
            });
        });
        it("case: complex characters", () => {
            const idp =
                "https://staticdeploy.staticdeploy.io/openid-connect-provider/";
            const idpId = "platform|first.last";
            const idpInfo = extractIdpInfo(
                new NoUserCorrespondingToIdpUserError({ idp: idp, id: idpId })
                    .message
            );
            expect(idpInfo).to.deep.equal({
                idp: idp,
                idpId: idpId
            });
        });
    });
});
