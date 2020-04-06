import Axios from "axios";
import { expect } from "chai";
import nock from "nock";

import parseDates from "../../src/interceptors/parseDates";

const baseUrl = "http://localhost";
const unixEpoch = new Date(0);
const unixEpochISO = unixEpoch.toISOString();

beforeEach(() => {
    nock.cleanAll();
});

describe("interceptor parseDates", () => {
    describe("converts dates in response bodies", async () => {
        it("case: object response body", async () => {
            nock(baseUrl).get("/").reply(200, {
                createdAt: unixEpochISO,
                updatedAt: unixEpochISO,
                deletedAt: unixEpochISO,
                performedAt: unixEpochISO,
            });
            const axios = Axios.create({ baseURL: baseUrl });
            axios.interceptors.response.use(parseDates());
            const { data } = await axios.get("/");
            expect(data).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch,
                deletedAt: unixEpoch,
                performedAt: unixEpoch,
            });
        });

        it("case: array response body", async () => {
            nock(baseUrl)
                .get("/")
                .reply(200, [
                    {
                        createdAt: unixEpochISO,
                        updatedAt: unixEpochISO,
                        deletedAt: unixEpochISO,
                        performedAt: unixEpochISO,
                    },
                ]);
            const axios = Axios.create({ baseURL: baseUrl });
            axios.interceptors.response.use(parseDates());
            const { data } = await axios.get("/");
            expect(data).to.deep.equal([
                {
                    createdAt: unixEpoch,
                    updatedAt: unixEpoch,
                    deletedAt: unixEpoch,
                    performedAt: unixEpoch,
                },
            ]);
        });
    });
});
