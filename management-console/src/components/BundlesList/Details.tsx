import { IBundle } from "@staticdeploy/core";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";

import BundleAssetsList from "../BundleAssetsList";
import TextFieldRO from "../TextFieldRO";
import TruncatedText from "../TruncatedText";

interface IProps {
    bundle: IBundle;
}

export default class Details extends React.Component<IProps> {
    render() {
        const { bundle } = this.props;
        return (
            <Row gutter={16}>
                <Col span={5}>
                    <TextFieldRO
                        title="Fallback asset path"
                        value={<code>{bundle.fallbackAssetPath}</code>}
                    />
                </Col>
                <Col span={5}>
                    <TextFieldRO
                        title="Fallback status code"
                        value={<code>{bundle.fallbackStatusCode}</code>}
                    />
                </Col>
                <Col span={14}>
                    <TextFieldRO
                        title="Hash"
                        value={
                            <TruncatedText>
                                <code>{bundle.hash}</code>
                            </TruncatedText>
                        }
                    />
                </Col>
                <Col span={24}>
                    <BundleAssetsList title="Assets" assets={bundle.assets} />
                </Col>
            </Row>
        );
    }
}
