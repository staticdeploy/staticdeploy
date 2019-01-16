import { IBundle } from "@staticdeploy/common-types";
import Table, { ColumnProps } from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import distanceInWords from "date-fns/distance_in_words";
import format from "date-fns/format";
import sortBy from "lodash/sortBy";
import React from "react";

import TruncatedText from "../TruncatedText";
import Details from "./Details";
import "./index.css";

interface IProps {
    title?: React.ReactNode;
    bundles: IBundle[];
}

export default class BundlesList extends React.Component<IProps> {
    getColumns(): ColumnProps<IBundle>[] {
        return [
            {
                key: "id",
                title: "Id",
                dataIndex: "id",
                className: "c-BundlesList-id-column",
                render: (id: string) => <code>{id}</code>
            },
            {
                key: "description",
                title: "Description",
                dataIndex: "description",
                className: "c-BundlesList-description-column",
                render: (description: string) => (
                    <TruncatedText>{description}</TruncatedText>
                )
            },
            {
                key: "createdAt",
                title: "Age",
                dataIndex: "createdAt",
                className: "c-BundlesList-createdAt-column",
                render: (createdAt: string) => (
                    <Tooltip title={format(createdAt, "YYYY-MM-DD HH:mm:ss Z")}>
                        {distanceInWords(new Date(), createdAt)}
                    </Tooltip>
                )
            }
        ];
    }
    renderTitle() {
        return this.props.title ? <h4>{this.props.title}</h4> : null;
    }
    render() {
        return (
            <div className="c-BundlesList">
                {this.renderTitle()}
                <Table<IBundle>
                    columns={this.getColumns()}
                    expandedRowRender={bundle => <Details bundle={bundle} />}
                    dataSource={sortBy(
                        this.props.bundles,
                        "createdAt"
                    ).reverse()}
                    size="small"
                    bordered={false}
                    rowKey="id"
                    pagination={{ pageSize: 15, hideOnSinglePage: true }}
                />
            </div>
        );
    }
}
