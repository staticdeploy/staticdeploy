import * as sd from "@staticdeploy/core";
import { expect } from "chai";
import express from "express";
import { filter } from "lodash";
import sinon from "sinon";
import request from "supertest";

import handleUsecaseErrors, {
    errorStatusMappings
} from "../../src/managementApiAdapter/handleUsecaseErrors";

const getServerThrowing = (error: any, logError?: any) =>
    express()
        .use((req, _res, next) => {
            (req as any).log = { error: logError ?? (() => undefined) };
            next();
        })
        .use(
            handleUsecaseErrors(() => {
                throw error;
            })
        );

describe("handleUsecaseErrors", () => {
    it("handles FunctionalError-s", () => {
        return request(getServerThrowing(new sd.AuthenticationRequiredError()))
            .get("/")
            .expect(401)
            .expect({
                name: "AuthenticationRequiredError",
                message:
                    "This operation requires the request to be authenticated"
            });
    });

    it("handles ALL FunctionalError-s", () => {
        filter(
            sd,
            (value: any) =>
                Object.getPrototypeOf(value).name === "FunctionalError"
        ).forEach((FunctionalErrorClass: any) => {
            const mapping = errorStatusMappings.find(
                ([ErrorClass]) => ErrorClass === FunctionalErrorClass
            );
            if (!mapping) {
                throw new Error(
                    `Mapping not found for error ${FunctionalErrorClass.name}`
                );
            }
        });
    });

    it("handles UnexpectedError", () => {
        return request(getServerThrowing(new sd.UnexpectedError()))
            .get("/")
            .expect(500)
            .expect({
                name: "UnexpectedError",
                message:
                    "An unexpected error occurred while performing the operation"
            });
    });

    it("doesn't handle other errors", () => {
        return request(getServerThrowing(new Error()))
            .get("/")
            .expect(500)
            .expect({
                name: "UnhandledRequestError",
                message:
                    "An unexpected error occurred while performing the operation"
            });
    });

    it("logs other errors", async () => {
        const logError = sinon.stub();
        const error = new Error();
        await request(getServerThrowing(error, logError))
            .get("/")
            .expect(500)
            .expect({
                name: "UnhandledRequestError",
                message:
                    "An unexpected error occurred while performing the operation"
            });
        expect(logError).to.have.been.calledOnceWith(
            "unhandled request error",
            { error }
        );
    });
});
