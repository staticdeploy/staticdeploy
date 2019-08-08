import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";
import { Route } from "react-router-dom";

import GroupDetail from "../GroupDetail";
import GroupsList from "../GroupsList";

export default class Groups extends React.Component {
    render() {
        return (
            <Row gutter={32}>
                <Col span={6}>
                    <Route path="/groups/:groupId?" component={GroupsList} />
                </Col>
                <Col span={6}>
                    <Route path="/groups/:groupId" component={GroupDetail} />
                </Col>
            </Row>
        );
    }
}
