import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getStaticServerAdapterServer } from "../testUtils";

describe("staticServerAdapter staticRoute", () => {
    it("responds according to the RespondToEndpointRequest usecase return value", () => {
        const execMock = sinon.stub().resolves({
            statusCode: 200,
            headers: { "x-test-key": "value" },
            body: "body",
        });
        const server = getStaticServerAdapterServer({
            respondToEndpointRequest: execMock,
        });
        return request(server)
            .get("/")
            .expect(200)
            .expect("x-test-key", "value")
            .expect("body");
    });

    describe("calls the RespondToEndpointRequest usecase with the correct hostname", () => {
        it("case: staticServerAdapter mounted at /", async () => {
            const execMock = sinon
                .stub()
                .resolves({ statusCode: 200, headers: {} });
            const server = getStaticServerAdapterServer({
                respondToEndpointRequest: execMock,
            });
            await request(server)
                .get("/")
                .set("host", "example.com")
                .expect(200);
            expect(execMock).to.have.been.calledOnceWith({
                hostname: "example.com",
                path: "/",
            });
        });

        it("case: staticServerAdapter mounted at /basePath/", async () => {
            const execMock = sinon
                .stub()
                .resolves({ statusCode: 200, headers: {} });
            const server = getStaticServerAdapterServer(
                { respondToEndpointRequest: execMock },
                { mountPath: "/basePath/" }
            );
            await request(server)
                .get("/basePath/")
                .set("host", "example.com")
                .expect(200);
            expect(execMock).to.have.been.calledOnceWith({
                hostname: "example.com",
                path: "/basePath/",
            });
        });

        it("case: no hostnameHeader option specified", async () => {
            const execMock = sinon
                .stub()
                .resolves({ statusCode: 200, headers: {} });
            const server = getStaticServerAdapterServer({
                respondToEndpointRequest: execMock,
            });
            await request(server)
                .get("/")
                .set("host", "example.com")
                .expect(200);
            expect(execMock).to.have.been.calledOnceWith({
                hostname: "example.com",
                path: "/",
            });
        });

        it("case: hostnameHeader option specified but empty header", async () => {
            const execMock = sinon
                .stub()
                .resolves({ statusCode: 200, headers: {} });
            const server = getStaticServerAdapterServer(
                { respondToEndpointRequest: execMock },
                { hostnameHeader: "custom-host" }
            );
            await request(server)
                .get("/")
                .set("host", "example.com")
                .expect(200);
            expect(execMock).to.have.been.calledOnceWith({
                hostname: "example.com",
                path: "/",
            });
        });

        it("case: hostnameHeader option specified and non-empty header", async () => {
            const execMock = sinon
                .stub()
                .resolves({ statusCode: 200, headers: {} });
            const server = getStaticServerAdapterServer(
                { respondToEndpointRequest: execMock },
                { hostnameHeader: "custom-host" }
            );
            await request(server)
                .get("/")
                .set("custom-host", "custom-example.com")
                .set("host", "example.com")
                .expect(200);
            expect(execMock).to.have.been.calledOnceWith({
                hostname: "custom-example.com",
                path: "/",
            });
        });
    });

    it("forwards thrown errors to the error handler", () => {
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
