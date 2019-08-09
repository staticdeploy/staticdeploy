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
                <Col xl={6} xs={8}>
                    <Route path="/groups/:groupId?" component={GroupsList} />
                </Col>
                <Col xl={6} xs={8}>
                    <Route path="/groups/:groupId" component={GroupDetail} />
                </Col>
            </Row>
        );
    }
}
