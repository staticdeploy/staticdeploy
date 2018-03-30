import { expect } from "chai";

import { eq } from "../src/utils/sequelizeOperators";
import { insertFixtures, models, storageClient } from "./setup";

describe("OperationLogsClient.findAll", () => {
    beforeEach(async () => {
        await insertFixtures({ operationLogs: [{ id: "1" }] });
    });
    it("returns all operationLogs as pojo-s", async () => {
        const operationLogs = await storageClient.operationLogs.findAll();
        expect(operationLogs).to.have.length(1);
        expect(operationLogs[0]).to.have.property("id", "1");
    });
});

describe("OperationLogsClient.create", () => {
    beforeEach(async () => {
        await insertFixtures({});
    });
    it("creates an operationLog", async () => {
        await storageClient.operationLogs.create({
            operation: "1",
            parameters: {},
            performedBy: "1"
        });
        const operationLogInstance = await models.OperationLog.findOne({
            where: { operation: eq("1") }
        });
        expect(operationLogInstance).not.to.equal(null);
    });
    it("returns the created app as a pojo", async () => {
        const operationLog = await storageClient.operationLogs.create({
            operation: "1",
            parameters: {},
            performedBy: "1"
        });
        const operationLogInstance = await models.OperationLog.findOne({
            where: { operation: eq("1") }
        });
        expect(operationLog).to.deep.equal(operationLogInstance!.get());
    });
});
