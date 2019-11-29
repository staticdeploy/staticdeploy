import Spin from "antd/lib/spin";
import React from "react";

import "./index.css";

export default class InitSpinner extends React.Component {
    render() {
        return (
            <div className="c-InitSpinner">
                <Spin delay={150} size="large" />
            </div>
        );
    }
}
