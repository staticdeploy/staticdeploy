import React from "react";

import OperationsDropdown from "../OperationsDropdown";
import "./index.css";

interface IProps {
    title: React.ReactNode;
    actions: React.ReactNode[];
}

export default class Page extends React.Component<IProps> {
    render() {
        return (
            <div>
                <div className="c-Page-header">
                    <span>{this.props.title}</span>
                    <OperationsDropdown actions={this.props.actions} />
                </div>
                {this.props.children}
            </div>
        );
    }
}
