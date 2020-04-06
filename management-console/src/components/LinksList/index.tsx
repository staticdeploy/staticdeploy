import { RightOutlined } from "@ant-design/icons";
import Table, { ColumnProps } from "antd/lib/table";
import React from "react";
import { NavLink } from "react-router-dom";

import "./index.css";

interface IItem {
    id: string;
}

interface IProps<Item extends IItem> {
    title?: React.ReactNode;
    items: Item[];
    getDescription: (item: Item) => React.ReactNode;
    getHref: (item: Item) => string;
}

export default class LinksList<Item extends IItem> extends React.Component<
    IProps<Item>
> {
    getColumns(): ColumnProps<Item>[] {
        return [
            {
                key: "link",
                title: this.props.title,
                className: "c-LinksList-item",
                render: (_, item) => {
                    const href = this.props.getHref(item);
                    return (
                        <NavLink to={href}>
                            <div className="c-LinksList-item-description">
                                {this.props.getDescription(item)}
                            </div>
                            <RightOutlined className="c-LinksList-item-arrow" />
                        </NavLink>
                    );
                },
            },
        ];
    }
    render() {
        return (
            <Table<Item>
                className="c-LinksList"
                columns={this.getColumns()}
                dataSource={this.props.items}
                size="small"
                bordered={false}
                rowKey="id"
                pagination={{
                    pageSize: 15,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
        );
    }
}
