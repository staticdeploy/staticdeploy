import Axios from "axios";
import nock from "nock";

import addAuthorizationHeader from "../../src/interceptors/addAuthorizationHeader";

const baseUrl = "http://localhost";
const apiToken = "apiToken";

beforeEach(() => {
    nock.cleanAll();
});

describe("interceptor addAuthorizationHeader", () => {
    describe("when there is an apiToken, adds it in the authorization header of the request", async () => {
        it("case: string apiToken", async () => {
            const scope = nock(baseUrl, {
                reqheaders: { authorization: `Bearer ${apiToken}` },
            })
                .get("/")
                .reply(200);
            const axios = Axios.create({ baseURL: baseUrl });
            axios.interceptors.request.use(addAuthorizationHeader(apiToken));
            await axios.get("/");
            scope.done();
        });
        it("case: function apiToken", async () => {
            const scope = nock(baseUrl, {
                reqheaders: { authorization: `Bearer ${apiToken}` },
            })
                .get("/")
                .reply(200);
            const axios = Axios.create({ baseURL: baseUrl });
            axios.interceptors.request.use(
                addAuthorizationHeader(async () => apiToken)
            );
            await axios.get("/");
            scope.done();
        });
    });

    describe("when there is no apiToken, doesn't add the authorization header to the request", async () => {
        it("case: null apiToken", async () => {
            const scope = nock(baseUrl, { badheaders: ["authorization"] })
                .get("/")
                .reply(200);
            const axios = Axios.create({ baseURL: baseUrl });
            axios.interceptors.request.use(addAuthorizationHeader(null));
            await axios.get("/");
            scope.done();
        });
        it("case: function apiToken", async () => {
            const scope = nock(baseUrl, { badheaders: ["authorization"] })
                .get("/")
                .reply(200);
            const axios = Axios.create({ baseURL: baseUrl });
            axios.interceptors.request.use(
                addAuthorizationHeader(async () => null)
            );
            await axios.get("/");
            scope.done();
        });
    });
});
