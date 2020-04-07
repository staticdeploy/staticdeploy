import { expect } from "chai";
import { mount } from "enzyme";
import React from "react";
import sinon from "sinon";

import ErrorAlert from "../../../src/components/ErrorAlert";

describe("ErrorAlert", () => {
    it("when the onRetry prop is set, renders a retry button", () => {
        const errorAlert = mount(
            <ErrorAlert message="Error message" onRetry={sinon.spy()} />
        );
        expect(errorAlert.contains("Retry")).to.equal(true);
    });

    it("when the retry button is clicked, calls onRetry", () => {
        const onRetry = sinon.spy();
        const errorAlert = mount(
            <ErrorAlert message="Error message" onRetry={onRetry} />
        );
        errorAlert
            .find(".c-ErrorAlert-actions a:first-child")
            .simulate("click");
        expect(onRetry).to.have.callCount(1);
    });

    it("renders a page reload button", () => {
        const errorAlert = mount(<ErrorAlert message="Error message" />);
        expect(errorAlert.contains("Reload the page")).to.equal(true);
    });

    it("when the page reload button is clicked, reloads the page", () => {
        const fakeLocation = { reload: sinon.spy() };
        Object.defineProperty((global as any).window, "location", {
            get: () => fakeLocation,
        });
        const errorAlert = mount(<ErrorAlert message="Error message" />);
        errorAlert.find(".c-ErrorAlert-actions a").simulate("click");
        expect(window.location.reload).to.have.callCount(1);
    });
});
