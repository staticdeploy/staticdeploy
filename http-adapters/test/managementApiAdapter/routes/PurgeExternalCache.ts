import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter PURGE /externalCaches/:externalCacheId", () => {
    it("400 on invalid request body", () => {
        const server = getManagementApiAdapter({});
        return request(server)
            .purge("/externalCaches/id")
            .send([])
            .expect(400)
            .expect(/Validation failed/);
    });

    it("202 on externalCache purged, invokes the usecase correctly", async () => {
        const execMock = sinon.stub().resolves(undefined);
        const server = getManagementApiAdapter({
            purgeExternalCache: execMock
        });
        await request(server)
            .purge("/externalCaches/id")
            .send(["/*"])
            .expect(202);
        expect(execMock).to.have.been.calledOnceWith("id", ["/*"]);
    });
});
