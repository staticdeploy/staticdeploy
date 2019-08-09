import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import React from "react";

import "./index.css";

interface IProps {
    label: React.ReactNode;
    icon: string;
}

export default class OperationsDropdownItem extends React.Component<IProps> {
    render() {
        return (
            <div className="c-OperationsDropdownItem">
                <Icon type={this.props.icon} />
                <Divider type="vertical" />
                {this.props.label}
            </div>
        );
    }
}
