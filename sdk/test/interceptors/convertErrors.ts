import Axios from "axios";
import { expect } from "chai";
import nock from "nock";

import convertErrors from "../../src/interceptors/convertErrors";
import StaticdeployClientError from "../../src/StaticdeployClientError";

const baseUrl = "http://localhost";

beforeEach(() => {
    nock.cleanAll();
});

describe("interceptor convertErrors", () => {
    it("converts axios errors into StaticdeployClientError-s", async () => {
        nock(baseUrl)
            .get("/")
            .reply(400, { message: "Response error message" });
        const axios = Axios.create({ baseURL: baseUrl });
        axios.interceptors.response.use(undefined, convertErrors());
        const getPromise = axios.get("/");
        await expect(getPromise).to.be.rejectedWith(StaticdeployClientError);
    });

    describe("gives them a message as significant as possible", () => {
        it("case: error response name and message available", async () => {
            nock(baseUrl)
                .get("/")
                .reply(400, {
                    name: "NamedError",
                    message: "Response error message"
                });
            const axios = Axios.create({ baseURL: baseUrl });
            axios.interceptors.response.use(undefined, convertErrors());
            const getPromise = axios.get("/");
            await expect(getPromise).to.be.rejectedWith(
                StaticdeployClientError
            );
            await expect(getPromise).to.be.rejectedWith(
                "NamedError: Response error message"
            );
        });
        it("case: error response status code and message available", async () => {
            nock(baseUrl)
                .get("/")
                .reply(400, { message: "Response error message" });
            const axios = Axios.create({ baseURL: baseUrl });
            axios.interceptors.response.use(undefined, convertErrors());
            const getPromise = axios.get("/");
            await expect(getPromise).to.be.rejectedWith(
                StaticdeployClientError
            );
            await expect(getPromise).to.be.rejectedWith(
                "Error 400: Response error message"
            );
        });
        it("case: error response status code available, message not available", async () => {
            nock(baseUrl)
                .get("/")
                .reply(400, {});
            const axios = Axios.create({ baseURL: baseUrl });
            axios.interceptors.response.use(undefined, convertErrors());
            const getPromise = axios.get("/");
            await expect(getPromise).to.be.rejectedWith(
                StaticdeployClientError
            );
            await expect(getPromise).to.be.rejectedWith("Error 400");
        });
        it("case: error response not available", async () => {
            const axios = Axios.create({ baseURL: baseUrl });
            axios.interceptors.request.use(() => {
                throw new Error("Generic error");
            });
            axios.interceptors.response.use(undefined, convertErrors());
            const getPromise = axios.get("/");
            await expect(getPromise).to.be.rejectedWith(
                StaticdeployClientError
            );
            await expect(getPromise).to.be.rejectedWith("Error: Generic error");
        });
    });
});
