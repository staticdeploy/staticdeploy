import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import Modal from "antd/lib/modal";
import Row from "antd/lib/row";
import Spin from "antd/lib/spin";
import classnames from "classnames";
import React from "react";

import { delay } from "../../common/utils";
import "./index.css";

export enum OperationStatus {
    NotStarted,
    Started,
    Succeeded,
    Failed
}

type SuccessMessageFunction<Result> = ((result: Result) => React.ReactNode);

interface IProps<Result> {
    title: React.ReactNode;
    operation: () => Promise<Result>;
    trigger?: React.ReactNode;
    cancelButtonText?: React.ReactNode;
    startOperationButtonText?: React.ReactNode;
    performingOperationButtonText?: React.ReactNode;
    afterSuccessCloseButtonText?: React.ReactNode;
    onAfterSuccessClose?: (result: Result) => void;
    successMessage?: React.ReactNode | SuccessMessageFunction<Result>;
    width?: string | number;
}

interface IState<Result> {
    modalOpen: boolean;
    status: OperationStatus;
    result: Result | null;
    error: Error | null;
}

function isSuccessMessageFunction<Result>(
    fn: React.ReactNode | SuccessMessageFunction<Result>
): fn is SuccessMessageFunction<Result> {
    return typeof fn === "function";
}

export default class OperationModal<Result> extends React.PureComponent<
    IProps<Result>,
    IState<Result>
> {
    static defaultProps = {
        cancelButtonText: "Cancel",
        startOperationButtonText: "Start operation",
        afterSuccessCloseButtonText: "Close",
        successMessage: "Operation succeeded",
        width: 780
    };
    state: IState<Result> = {
        modalOpen: false,
        status: OperationStatus.NotStarted,
        result: null,
        error: null
    };
    openModal = () => this.setState({ modalOpen: true });
    closeModal = (evt: React.SyntheticEvent<any>) => {
        // Stop propagation to avoid re-triggering the onClick on the root
        // <span>, which would re-open the modal
        evt.stopPropagation();
        this.setState({
            modalOpen: false,
            status: OperationStatus.NotStarted,
            result: null,
            error: null
        });
    };
    closeAfterSuccess = (evt: React.SyntheticEvent<any>) => {
        if (this.props.onAfterSuccessClose) {
            this.props.onAfterSuccessClose(this.state.result!);
        }
        this.closeModal(evt);
    };
    performOperation = async () => {
        try {
            this.setState({
                status: OperationStatus.Started,
                result: null,
                error: null
            });
            // We wait a bit (15ms) for the state to have been set and for the
            // component to have re-rendered, so that the
            // c-OperationModal-has-error css class is removed from the modal,
            // allowing the c-OperationModal-flush-red css effect to be
            // re-triggered
            await delay(15);
            const result = await this.props.operation();
            this.setState({
                status: OperationStatus.Succeeded,
                result: result,
                error: null
            });
        } catch (err) {
            this.setState({
                status: OperationStatus.Failed,
                result: null,
                error: err
            });
        }
    };
    // Used from the outside
    trigger() {
        this.openModal();
    }
    renderContent() {
        if (this.state.status === OperationStatus.Succeeded) {
            const successContent = isSuccessMessageFunction(
                this.props.successMessage
            ) ? (
                this.props.successMessage(this.state.result!)
            ) : (
                <h3>{this.props.successMessage}</h3>
            );
            return (
                <Row gutter={16}>
                    <Col
                        className="c-OperationModal-success-check-container"
                        span={4}
                    >
                        <Icon type="check-circle-o" />
                    </Col>
                    <Col span={20}>{successContent}</Col>
                </Row>
            );
        }
        return (
            <Spin
                spinning={this.state.status === OperationStatus.Started}
                indicator={<div />}
            >
                {this.props.children}
            </Spin>
        );
    }
    renderFooter() {
        if (this.state.status === OperationStatus.Succeeded) {
            return (
                <Button type="primary" onClick={this.closeAfterSuccess}>
                    {this.props.afterSuccessCloseButtonText}
                </Button>
            );
        }
        const operationStarted = this.state.status === OperationStatus.Started;
        return (
            <div className="c-OperationModal-footer">
                <div className="c-OperationModal-footer-error">
                    <Icon type="close-circle" />
                    {this.state.error && this.state.error.message}
                </div>
                <div>
                    <Button
                        onClick={this.closeModal}
                        disabled={operationStarted}
                    >
                        {this.props.cancelButtonText}
                    </Button>
                    <Button
                        type="primary"
                        onClick={this.performOperation}
                        loading={operationStarted}
                    >
                        {operationStarted &&
                        this.props.performingOperationButtonText
                            ? this.props.performingOperationButtonText
                            : this.props.startOperationButtonText}
                    </Button>
                </div>
            </div>
        );
    }
    renderModal() {
        return this.state.modalOpen ? (
            <Modal
                className={classnames(
                    this.state.status === OperationStatus.Failed &&
                        "c-OperationModal-has-error"
                )}
                title={this.props.title}
                visible={true}
                footer={this.renderFooter()}
                closable={false}
                width={this.props.width}
            >
                {this.renderContent()}
            </Modal>
        ) : null;
    }
    render() {
        return (
            <span onClick={this.openModal}>
                {this.props.trigger}
                {this.renderModal()}
            </span>
        );
    }
}
