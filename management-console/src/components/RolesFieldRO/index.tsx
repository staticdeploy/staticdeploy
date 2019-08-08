import Col from "antd/es/col";
import Row from "antd/es/row";
import React from "react";

import "./index.css";

interface IProps {
    roles: string[];
    title: React.ReactNode;
}

export default class RolesFieldRO extends React.Component<IProps> {
    renderRole = (role: string, index: number) => {
        return (
            <Row key={index} className="c-RolesFieldRO-role" gutter={16}>
                <Col span={24}>
                    <code>{role}</code>
                </Col>
            </Row>
        );
    };
    render() {
        return (
            <div className="c-RolesFieldRO">
                <h4>{this.props.title}</h4>
                {this.props.roles.map(this.renderRole)}
            </div>
        );
    }
}
