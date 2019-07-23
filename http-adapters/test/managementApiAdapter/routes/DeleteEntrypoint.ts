import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter DELETE /entrypoints/:entrypointId", () => {
    it("204 on entrypoint deleted, deletes the entrypoint", async () => {
        const execMock = sinon.stub().resolves();
        const server = await getManagementApiAdapter({
            deleteEntrypoint: execMock
        });
        await request(server)
            .delete("/entrypoints/id")
            .expect(204);
        expect(execMock).to.have.been.calledOnceWith("id");
    });
});
