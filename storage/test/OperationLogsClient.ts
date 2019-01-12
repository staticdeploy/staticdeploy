import { expect } from "chai";

import * as errors from "../src/utils/errors";
import { eq } from "../src/utils/sequelizeOperators";
import { insertFixtures, models, storageClient } from "./setup";

describe("OperationLogsClient.findOneById", () => {
    beforeEach(async () => {
        await insertFixtures({ operationLogs: [{ id: "1" }] });
    });
    it("if an operation log with the specified id doesn't exist, returns null", async () => {
        const operationLog = await storageClient.operationLogs.findOneById("2");
        expect(operationLog).to.equal(null);
    });
    it("returns the found operation log as a pojo", async () => {
        const operationLog = await storageClient.operationLogs.findOneById("1");
        expect(operationLog).to.have.property("id", "1");
    });
});

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

describe("OperationLogsClient.delete", () => {
    beforeEach(async () => {
        await insertFixtures({ operationLogs: [{ id: "1" }] });
    });
    it("throws an OperationLogNotFoundError if no operation log with the specified id exists", async () => {
        const deletePromise = storageClient.operationLogs.delete("2");
        await expect(deletePromise).to.be.rejectedWith(
            errors.OperationLogNotFoundError
        );
        await expect(deletePromise).to.be.rejectedWith(
            "No operation log found with id = 2"
        );
    });
    it("deletes the operation log", async () => {
        await storageClient.operationLogs.delete("1");
        const operationLogInstance = await models.OperationLog.findByPk("1");
        expect(operationLogInstance).to.equal(null);
    });
});
