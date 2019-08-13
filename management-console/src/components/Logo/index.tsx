import React from "react";

import "./index.css";
import logoBlueSrc from "./logoBlue.png";
import logoWhiteSrc from "./logoWhite.png";

interface IProps {
    color: "blue" | "white";
}

export default class Logo extends React.Component<IProps> {
    render() {
        const { color } = this.props;
        return (
            <img
                className="c-Logo"
                src={color === "blue" ? logoBlueSrc : logoWhiteSrc}
                alt="logo"
            />
        );
    }
}
