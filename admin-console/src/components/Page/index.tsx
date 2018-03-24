import React from "react";

import OperationsDropdown from "../OperationsDropdown";
import "./index.css";

interface IProps {
    title?: React.ReactNode;
    actions?: React.ReactNode[];
}

export default class Page extends React.Component<IProps> {
    renderActions() {
        return this.props.actions ? (
            <OperationsDropdown actions={this.props.actions} />
        ) : null;
    }
    render() {
        return (
            <div>
                <div className="c-Page-header">
                    <span>{this.props.title || null}</span>
                    {this.renderActions()}
                </div>
                {this.props.children}
            </div>
        );
    }
}
