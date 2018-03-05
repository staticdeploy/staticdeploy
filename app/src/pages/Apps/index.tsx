import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";
import { Route } from "react-router-dom";

import AppDetail from "../AppDetail";
import AppsList from "../AppsList";
import EntrypointDetail from "../EntrypointDetail";

export default class Apps extends React.Component {
    render() {
        return (
            <Row gutter={32}>
                <Col span={6}>
                    <Route path="/apps/:appId?" component={AppsList} />
                </Col>
                <Col span={8}>
                    <Route
                        // The optional entrypoints parameter only matches the
                        // "entrypoints" path segment, but it's necessary to
                        // specify it so we can access the entrypointId
                        // parameter in the component
                        path="/apps/:appId/:entrypoints?/:entrypointId?"
                        component={AppDetail}
                    />
                </Col>
                <Col span={10}>
                    <Route
                        path="/apps/:appId/entrypoints/:entrypointId"
                        component={EntrypointDetail}
                    />
                </Col>
            </Row>
        );
    }
}
