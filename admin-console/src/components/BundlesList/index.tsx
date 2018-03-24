import { IBundle } from "@staticdeploy/sdk";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Tooltip from "antd/lib/tooltip";
import distanceInWords from "date-fns/distance_in_words";
import format from "date-fns/format";
import sortBy from "lodash/sortBy";
import React from "react";

import "./index.css";

interface IProps {
    title?: React.ReactNode;
    bundles: IBundle[];
}

export default class BundlesList extends React.PureComponent<IProps> {
    renderTitle() {
        return this.props.title ? <h4>{this.props.title}</h4> : null;
    }
    renderDescription(bundle: IBundle) {
        return (
            <Tooltip placement="topLeft" title={bundle.description}>
                {bundle.description}
            </Tooltip>
        );
    }
    renderDate(bundle: IBundle) {
        return (
            <Tooltip title={format(bundle.createdAt, "YYYY-MM-DD HH:mm:ss Z")}>
                {distanceInWords(new Date(), bundle.createdAt)}
            </Tooltip>
        );
    }
    renderBundle = (bundle: IBundle) => {
        return (
            <Row key={bundle.id} className="c-BundlesList-item" gutter={16}>
                <Col span={4} className="c-BundlesList-item-id">
                    <code>{bundle.id}</code>
                </Col>
                <Col span={14} className="c-BundlesList-item-description">
                    {this.renderDescription(bundle)}
                </Col>
                <Col span={6} className="c-BundlesList-item-date align-center">
                    {this.renderDate(bundle)}
                </Col>
            </Row>
        );
    };
    render() {
        return (
            <div className="c-BundlesList">
                {this.renderTitle()}
                <Row gutter={16} className="c-BundlesList-header">
                    <Col span={4}>{"Id"}</Col>
                    <Col span={14}>{"Description"}</Col>
                    <Col span={6} className="align-center">
                        {"Age"}
                    </Col>
                </Row>
                {sortBy(this.props.bundles, "createdAt")
                    .reverse()
                    .map(this.renderBundle)}
            </div>
        );
    }
}
