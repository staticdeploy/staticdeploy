import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter DELETE /bundleNames/:bundleName/bundleTags/:bundleTag/bundles", () => {
    it("204 on bundles deleted, deletes the bundles", async () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({
            deleteBundlesByNameAndTag: execMock
        });
        await request(server)
            .delete("/bundleNames/bundleName/bundleTags/bundleTag/bundles")
            .expect(204);
        expect(execMock).to.have.been.calledOnceWith("bundleName", "bundleTag");
    });
});
