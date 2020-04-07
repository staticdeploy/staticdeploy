import {
    NoBundleOrRedirectToError,
    NoMatchingEntrypointError,
} from "@staticdeploy/core";
import sinon from "sinon";
import request from "supertest";

import { getStaticServerAdapterServer } from "../testUtils";

describe("staticServerAdapter errorHandler", () => {
    it("handles NoBundleOrRedirectToError-s", () => {
        const error = new NoBundleOrRedirectToError("example.com/");
        const server = getStaticServerAdapterServer({
            respondToEndpointRequest: sinon.stub().rejects(error),
        });
        return request(server)
            .get("/")
            .expect(404)
            .expect(/#error-message/);
    });

    it("handles NoMatchingEntrypointError-s", () => {
        const error = new NoMatchingEntrypointError("example.com/");
        const server = getStaticServerAdapterServer({
            respondToEndpointRequest: sinon.stub().rejects(error),
        });
        return request(server)
            .get("/")
            .expect(404)
            .expect(/#error-message/);
    });

    it("handles generic Error-s", () => {
        const error = new Error();
        const server = getStaticServerAdapterServer({
            respondToEndpointRequest: sinon.stub().rejects(error),
        });
        return request(server)
            .get("/")
            .expect(500)
            .expect(/#error-message/);
    });
});
