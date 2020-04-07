import Modal from "antd/lib/modal";
import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import OperationModal, {
    OperationStatus,
} from "../../../src/components/OperationModal";

describe("OperationModal", () => {
    const props = {
        title: "title",
        operation: sinon.stub(),
    };

    it("when clicked, renders an open Modal", () => {
        const operationModal = shallow(<OperationModal {...props} />);
        operationModal.simulate("click");
        expect(operationModal.find(Modal)).to.have.length(1);
    });

    describe("renders its children", () => {
        const operationModal = shallow(
            <OperationModal {...props}>
                <div id="child" />
            </OperationModal>
        );
        it("when state.status === OperationStatus.NotStarted", () => {
            operationModal.setState({
                modalOpen: true,
                status: OperationStatus.NotStarted,
            });
            expect(operationModal.find("div#child")).to.have.length(1);
        });
        it("when state.status === OperationStatus.Started", () => {
            operationModal.setState({
                modalOpen: true,
                status: OperationStatus.Started,
            });
            expect(operationModal.find("div#child")).to.have.length(1);
        });
        it("when state.status === OperationStatus.Failed", () => {
            operationModal.setState({
                modalOpen: true,
                status: OperationStatus.Failed,
            });
            expect(operationModal.find("div#child")).to.have.length(1);
        });
    });

    it("doesn't render its children when state.status === OperationStatus.Succeeded", () => {
        const operationModal = shallow(
            <OperationModal {...props}>
                <div id="child" />
            </OperationModal>
        );
        operationModal.setState({
            modalOpen: true,
            status: OperationStatus.Succeeded,
        });
        expect(operationModal.find("div#child")).to.have.length(0);
    });
});
