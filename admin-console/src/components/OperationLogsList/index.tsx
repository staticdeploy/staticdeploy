import { IOperationLog } from "@staticdeploy/common-types";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Tag from "antd/lib/tag";
import format from "date-fns/format";
import sortBy from "lodash/sortBy";
import React from "react";

import "./index.css";

interface IProps {
    title?: React.ReactNode;
    operationLogs: IOperationLog[];
}

export default class OperationLogsList extends React.PureComponent<IProps> {
    renderTitle() {
        return this.props.title ? <h4>{this.props.title}</h4> : null;
    }
    renderOperation(operationLog: IOperationLog) {
        const operation = operationLog.operation.replace(":", " ");
        const colorClassName = operationLog.operation.replace(":", "-");
        return <Tag className={colorClassName}>{operation}</Tag>;
    }
    renderOperationLog = (operationLog: IOperationLog) => {
        return (
            <Row
                key={operationLog.id}
                className="c-OperationLogsList-item"
                gutter={16}
            >
                <Col span={8} className="c-OperationLogsList-item-operation">
                    {this.renderOperation(operationLog)}
                </Col>
                <Col span={8}>
                    {format(operationLog.performedAt, "YYYY-MM-DD HH:mm:ss Z")}
                </Col>
                <Col span={8}>{operationLog.performedBy}</Col>
            </Row>
        );
    };
    render() {
        return (
            <div className="c-OperationLogsList">
                {this.renderTitle()}
                <Row gutter={16} className="c-OperationLogsList-header">
                    <Col span={8} className="align-center">
                        {"Operation"}
                    </Col>
                    <Col span={8}>{"Performed at"}</Col>
                    <Col span={8}>{"Performed by"}</Col>
                </Row>
                {sortBy(this.props.operationLogs, "performedAt")
                    .reverse()
                    .map(this.renderOperationLog)}
            </div>
        );
    }
}
