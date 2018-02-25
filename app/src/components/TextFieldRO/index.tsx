import React from "react";

import "./index.css";

interface IProps {
    title: React.ReactNode;
    value: React.ReactNode;
}

export default class TextFieldRO extends React.PureComponent<IProps> {
    render() {
        return (
            <div className="c-TextFieldRO">
                <h4>{this.props.title}</h4>
                {this.props.value}
            </div>
        );
    }
}
