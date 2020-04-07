import Divider from "antd/lib/divider";
import React from "react";

import "./index.css";

interface IProps {
    label: React.ReactNode;
    icon: React.ReactNode;
}

export default class OperationsDropdownItem extends React.Component<IProps> {
    render() {
        return (
            <div className="c-OperationsDropdownItem">
                {this.props.icon}
                <Divider type="vertical" />
                {this.props.label}
            </div>
        );
    }
}
