import Spin from "antd/lib/spin";
import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import DataFetcher, { FetchStatus } from "../../../src/components/DataFetcher";
import ErrorAlert from "../../../src/components/ErrorAlert";

describe("DataFetcher", () => {
    const staticdeployClient = {} as any;
    const props = {
        fetchData: sinon.stub(),
        shouldRefetch: sinon.stub(),
        Component: sinon.spy(() => null),
        proxiedProps: { propKey: "propValue" }
    };
    const originalLocation = window.location;
    beforeEach(() => {
        props.fetchData.reset();
        props.shouldRefetch.reset();
        props.Component.resetHistory();
        if (window.location !== originalLocation) {
            Object.defineProperty((global as any).window, "location", {
                get: () => originalLocation
            });
        }
    });

    it("on mount, calls the passed-in fetchData function with proxied props", () => {
        shallow(<DataFetcher {...props} />, { context: staticdeployClient });
        expect(props.fetchData).to.have.callCount(1);
        expect(props.fetchData).to.have.been.calledWith(staticdeployClient, {
            propKey: "propValue"
        });
    });

    it("when state.status === FetchStatus.STARTED, renders a spinner", () => {
        const dataFetcher = shallow(<DataFetcher {...props} />);
        dataFetcher.setState({ status: FetchStatus.STARTED });
        expect(dataFetcher.find(Spin)).to.have.length(1);
    });

    it("when state.status === FetchStatus.SUCCEEDED, renders the passed in Component with the fetch result, a re-fetch function, and proxied props", () => {
        const dataFetcher = shallow(<DataFetcher {...props} />);
        dataFetcher.setState({
            status: FetchStatus.SUCCEEDED,
            result: "result"
        });
        const component = dataFetcher.find(props.Component);
        expect(component).to.have.length(1);
        expect(component.prop("result")).to.equal("result");
        expect(component.prop("propKey")).to.equal("propValue");
        expect(component.prop("refetch")).to.be.a("function");
    });

    it("the re-fetch function passed to Component, when called re-calls fetchData", () => {
        const dataFetcher = shallow(<DataFetcher {...props} />, {
            context: staticdeployClient
        });
        dataFetcher.setState({
            status: FetchStatus.SUCCEEDED,
            result: "result"
        });
        const component = dataFetcher.find(props.Component);
        props.fetchData.reset();
        component.prop<() => any>("refetch")();
        expect(props.fetchData).to.have.callCount(1);
        expect(props.fetchData).to.have.been.calledWith(staticdeployClient, {
            propKey: "propValue"
        });
    });

    it("when state.status === FetchStatus.FAILED, renders an error message", () => {
        const dataFetcher = shallow(<DataFetcher {...props} />);
        dataFetcher.setState({
            status: FetchStatus.FAILED,
            error: new Error("Error message")
        });
        const errorAlert = dataFetcher.find(ErrorAlert);
        expect(errorAlert).to.have.length(1);
        expect(errorAlert.prop("message")).to.equal("Error message");
    });

    describe("when new props are received", () => {
        it("if shouldRefetch returns true, re-calls fetchData", () => {
            props.shouldRefetch.returns(true);
            const dataFetcher = shallow(<DataFetcher {...props} />);
            props.fetchData.reset();
            dataFetcher.setProps(props);
            expect(props.fetchData).to.have.callCount(1);
            expect(props.fetchData).to.have.been.calledWith(
                staticdeployClient,
                { propKey: "propValue" }
            );
        });
        it("if shouldRefetch returns false, doesn't re-call fetchData", () => {
            props.shouldRefetch.returns(false);
            const dataFetcher = shallow(<DataFetcher {...props} />);
            props.fetchData.reset();
            dataFetcher.setProps(props);
            expect(props.fetchData).to.have.callCount(0);
        });
    });
});
