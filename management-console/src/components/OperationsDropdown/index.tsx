import Dropdown from "antd/es/dropdown";
import Icon from "antd/es/icon";
import Menu from "antd/es/menu";
import React from "react";

import "./index.css";
import Item from "./Item";

interface IProps {
    actions: React.ReactNode[];
}

interface IKeyed {
    key?: string | number;
}

function hasKey(node: React.ReactNode): node is IKeyed {
    return !!(node && (node as any).key);
}

export default class OperationsDropdown extends React.Component<IProps> {
    static Item = Item;
    renderMenu() {
        return (
            <Menu className="c-OperationsDropdown-menu">
                {this.props.actions.map((action, index) => (
                    <Menu.Item key={hasKey(action) ? action.key : index}>
                        {action}
                    </Menu.Item>
                ))}
            </Menu>
        );
    }
    render() {
        return (
            <Dropdown
                overlay={this.renderMenu()}
                trigger={["click"]}
                placement="bottomRight"
            >
                {/* eslint-disable-next-line */}
                <a className="c-OperationsDropdown-link ant-dropdown-link">
                    {"Actions "}
                    <Icon type="down" />
                </a>
            </Dropdown>
        );
    }
}
