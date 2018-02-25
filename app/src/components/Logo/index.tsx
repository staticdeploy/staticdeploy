import React from "react";

import "./index.css";
import logoSrc from "./logo.png";

export default class Logo extends React.PureComponent {
    render() {
        return <img className="c-Logo" src={logoSrc} alt="logo" />;
    }
}
