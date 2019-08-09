import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";
import { Route } from "react-router-dom";

import GroupDetail from "../GroupDetail";
import UserDetail from "../UserDetail";
import UsersList from "../UsersList";

export default class Users extends React.Component {
    render() {
        return (
            <Row gutter={32}>
                <Col xl={6} xs={8}>
                    <Route path="/users/:userId?" component={UsersList} />
                </Col>
                <Col xl={6} xs={8}>
                    <Route
                        // The optional groups parameter only matches the
                        // "groups" path segment, but it's necessary to specify
                        // it so we can access the groupId parameter in the
                        // component
                        path="/users/:userId/:groups?/:groupsId?"
                        component={UserDetail}
                    />
                </Col>
                <Col xl={6} xs={8}>
                    <Route
                        path="/users/:userId/groups/:groupId"
                        component={GroupDetail}
                    />
                </Col>
            </Row>
        );
    }
}
