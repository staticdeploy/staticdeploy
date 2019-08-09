import { IConfiguration } from "@staticdeploy/core";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";

import { IKVPair, toKVPairs } from "../../common/configurationUtils";
import "./index.css";

interface IProps {
    configuration: IConfiguration;
    title: React.ReactNode;
}

export default class ConfigurationFieldRO extends React.Component<IProps> {
    renderKVPair = (kvPair: IKVPair) => {
        return (
            <Row
                key={kvPair.key}
                className="c-ConfigurationFieldRO-kv-pair"
                gutter={16}
            >
                <Col span={10}>
                    <code>{kvPair.key}</code>
                </Col>
                <Col span={14}>
                    <code>{kvPair.value}</code>
                </Col>
            </Row>
        );
    };
    render() {
        const kvPairs = toKVPairs(this.props.configuration);
        return (
            <div className="c-ConfigurationFieldRO">
                <h4>{this.props.title}</h4>
                <Row
                    className="c-ConfigurationFieldRO-kv-pair-header"
                    gutter={16}
                >
                    <Col span={10}>{"Variable name"}</Col>
                    <Col span={14}>{"Value"}</Col>
                </Row>
                {kvPairs.map(this.renderKVPair)}
            </div>
        );
    }
}
