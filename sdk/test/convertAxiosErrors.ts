import Axios from "axios";
import chai = require("chai");
import { expect } from "chai";
import chaiAsPromised = require("chai-as-promised");
import nock = require("nock");
import { stub } from "sinon";

import convertAxiosErrors, {
    StaticdeployClientError
} from "../src/convertAxiosErrors";

chai.use(chaiAsPromised);

const baseUrl = "http://localhost";
const axios = Axios.create({ baseURL: baseUrl });
convertAxiosErrors(axios);

beforeEach(() => {
    nock.cleanAll();
});
afterEach(() => {
    if ((axios.get as any).restore) {
        (axios.get as any).restore();
    }
});

describe("convertAxiosErrors", () => {
    it("converts axios errors into StaticdeployClientError-s", async () => {
        const scope = nock(baseUrl)
            .get("/")
            .reply(400, { message: "Response error message" });
        const getPromise = axios.get("/");
        await expect(getPromise).to.be.rejectedWith(StaticdeployClientError);
        scope.done();
    });
    describe("gives them a message as significant as possible", () => {
        it("case: error response status code and message available", async () => {
            const scope = nock(baseUrl)
                .get("/")
                .reply(400, { message: "Response error message" });
            const getPromise = axios.get("/");
            await expect(getPromise).to.be.rejectedWith(
                "Error 400: Response error message"
            );
            scope.done();
        });
        it("case: error response status code available, message not available", async () => {
            const scope = nock(baseUrl)
                .get("/")
                .reply(400, {});
            const getPromise = axios.get("/");
            await expect(getPromise).to.be.rejectedWith("Error 400");
            scope.done();
        });
        it("case: error response not available", async () => {
            stub(axios, "get").returns(
                Promise.reject(new Error("Generic error"))
            );
            const getPromise = axios.get("/");
            await expect(getPromise).to.be.rejectedWith("Generic error");
        });
    });
});
