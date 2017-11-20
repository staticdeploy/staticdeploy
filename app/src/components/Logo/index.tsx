import React, { PureComponent } from "react";

import logoSrc from "./logo.png";

interface IProps {
    className?: string;
}

export default class Logo extends PureComponent<IProps> {
    render() {
        return (
            <img className={this.props.className} src={logoSrc} alt="logo" />
        );
    }
}
