import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";
import { Route } from "react-router-dom";

import ExternalCacheDetail from "../ExternalCacheDetail";
import ExternalCachesList from "../ExternalCachesList";

export default class ExternalCaches extends React.Component {
    render() {
        return (
            <Row gutter={32}>
                <Col xl={6} xs={8}>
                    <Route
                        path="/externalCaches/:externalCacheId?"
                        component={ExternalCachesList}
                    />
                </Col>
                <Col xl={6} xs={8}>
                    <Route
                        path="/externalCaches/:externalCacheId"
                        component={ExternalCacheDetail}
                    />
                </Col>
            </Row>
        );
    }
}
