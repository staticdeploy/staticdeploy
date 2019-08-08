import Col from "antd/es/col";
import Row from "antd/es/row";
import React from "react";
import { Route } from "react-router-dom";

import BundleNamesList from "../BundleNamesList";
import BundlesByNameTag from "../BundlesByNameTag";
import BundleTagsList from "../BundleTagsList";

export default class Bundles extends React.Component {
    render() {
        return (
            <Row gutter={32}>
                <Col span={5}>
                    <Route path="/bundles" component={BundleNamesList} />
                </Col>
                <Col span={5}>
                    <Route
                        path="/bundles/:bundleName/:bundleTag?"
                        component={BundleTagsList}
                    />
                </Col>
                <Col span={14}>
                    <Route
                        path="/bundles/:bundleName/:bundleTag"
                        component={BundlesByNameTag}
                    />
                </Col>
            </Row>
        );
    }
}
