import React from "react";

import "./index.css";
import logoWithoutShadow from "./logoWithoutShadow.svg";
import logoWithShadow from "./logoWithShadow.svg";

interface IProps {
    withShadow: boolean;
}

export default class Logo extends React.Component<IProps> {
    render() {
        const { withShadow } = this.props;
        return (
            <img
                className="c-Logo"
                src={withShadow ? logoWithShadow : logoWithoutShadow}
                alt="logo"
            />
        );
    }
}
