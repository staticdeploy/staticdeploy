import { IDeployment, IEntrypoint } from "@staticdeploy/sdk";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Tag from "antd/lib/tag";
import Tooltip from "antd/lib/tooltip";
import distanceInWords from "date-fns/distance_in_words";
import format from "date-fns/format";
import sortBy from "lodash/sortBy";
import React from "react";

import DeploymentActivateOperationModal from "./DeploymentActivateOperationModal";
import "./DeploymentsList.css";

interface IProps {
    title: React.ReactNode;
    entrypoint: IEntrypoint;
    deployments: IDeployment[];
    refetch: () => void;
}

export default class DeploymentsList extends React.PureComponent<IProps> {
    renderDescription(deployment: IDeployment) {
        return (
            <Tooltip placement="topLeft" title={deployment.description}>
                {deployment.description}
            </Tooltip>
        );
    }
    renderDate(deployment: IDeployment) {
        return (
            <Tooltip
                title={format(deployment.createdAt, "YYYY-MM-DD HH:mm:ss Z")}
            >
                {distanceInWords(new Date(), deployment.createdAt)}
            </Tooltip>
        );
    }
    renderActivate(deployment: IDeployment) {
        const isActive =
            this.props.entrypoint.activeDeploymentId === deployment.id;
        if (isActive) {
            return <Tag color="green">{"Active"}</Tag>;
        }
        const trigger = (
            <span className="c-DeploymentsList-item-activate-button">
                {"Set as active"}
            </span>
        );
        return (
            <DeploymentActivateOperationModal
                deployment={deployment}
                entrypoint={this.props.entrypoint}
                trigger={trigger}
                refetchEntrypointDetail={this.props.refetch}
            />
        );
    }
    renderDeployment = (deployment: IDeployment) => {
        return (
            <Row
                key={deployment.id}
                className="c-DeploymentsList-item"
                gutter={16}
            >
                <Col span={13} className="c-DeploymentsList-item-description">
                    {this.renderDescription(deployment)}
                </Col>
                <Col
                    span={6}
                    className="c-DeploymentsList-item-date align-center"
                >
                    {this.renderDate(deployment)}
                </Col>
                <Col
                    span={5}
                    className="c-DeploymentsList-item-activate align-center"
                >
                    {this.renderActivate(deployment)}
                </Col>
            </Row>
        );
    };
    render() {
        return (
            <div className="c-DeploymentsList">
                <h4>{this.props.title}</h4>
                <Row gutter={16} className="c-DeploymentsList-header">
                    <Col span={13}>{"Description"}</Col>
                    <Col span={6} className="align-center">
                        {"Age"}
                    </Col>
                    <Col span={5} className="align-center">
                        {"Status"}
                    </Col>
                </Row>
                {sortBy(this.props.deployments, "createdAt")
                    .reverse()
                    .map(this.renderDeployment)}
            </div>
        );
    }
}
