import { expect } from "chai";
import nock from "nock";

import StaticdeployClient from "../src";

const baseUrl = "http://localhost";
const staticdeployClient = new StaticdeployClient({
    apiUrl: baseUrl,
    apiToken: null
});

beforeEach(() => {
    nock.cleanAll();
});

describe("OperationLogsClient", () => {
    describe("getAll", () => {
        it("requests GET /operationLogs", async () => {
            const scope = nock(baseUrl)
                .get("/operationLogs")
                .reply(200, []);
            await staticdeployClient.operationLogs.getAll();
            scope.done();
        });
        it("returns a list of operation logs", async () => {
            nock(baseUrl)
                .get("/operationLogs")
                .reply(200, []);
            const operationLogs = await staticdeployClient.operationLogs.getAll();
            expect(operationLogs).to.deep.equal([]);
        });
    });

    describe("getOne", () => {
        it("requests GET /operationLogs/:operationLogId", async () => {
            const scope = nock(baseUrl)
                .get("/operationLogs/id")
                .reply(200);
            await staticdeployClient.operationLogs.getOne("id");
            scope.done();
        });
        it("returns the operationLog with the specified id", async () => {
            nock(baseUrl)
                .get("/operationLogs/id")
                .reply(200, {});
            const operationLog = await staticdeployClient.operationLogs.getOne(
                "id"
            );
            expect(operationLog).to.deep.equal({});
        });
    });
});
