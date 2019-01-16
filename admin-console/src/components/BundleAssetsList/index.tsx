import { IAsset, IBundle } from "@staticdeploy/common-types";
import Table from "antd/lib/table";
import sortBy from "lodash/sortBy";
import React from "react";

import "./index.css";

interface IProps {
    assets: IBundle["assets"];
    title?: React.ReactNode;
}

export default class BundleAssetsList extends React.Component<IProps> {
    renderTitle() {
        return this.props.title ? <h4>{this.props.title}</h4> : null;
    }
    renderList() {
        return (
            <Table<IAsset>
                columns={[
                    { key: "path", dataIndex: "path" },
                    { key: "mimeType", dataIndex: "mimeType" }
                ]}
                dataSource={sortBy(this.props.assets, "path")}
                size="small"
                bordered={false}
                rowKey="path"
                pagination={false}
                showHeader={false}
            />
        );
    }
    render() {
        return (
            <div className="c-BundleAssetsList">
                {this.renderTitle()}
                {this.renderList()}
            </div>
        );
    }
}
