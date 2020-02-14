import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter DELETE /externalCaches/:externalCacheId", () => {
    it("204 on externalCache deleted, deletes the externalCache", async () => {
        const execMock = sinon.stub().resolves();
        const server = getManagementApiAdapter({
            deleteExternalCache: execMock
        });
        await request(server)
            .delete("/externalCaches/id")
            .expect(204);
        expect(execMock).to.have.been.calledOnceWith("id");
    });
});
