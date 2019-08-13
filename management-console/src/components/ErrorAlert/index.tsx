import Alert from "antd/lib/alert";
import Divider from "antd/lib/divider";
import React from "react";

import "./index.css";

interface IProps {
    message: string;
    onRetry?: () => any;
}

export default class ErrorAlert extends React.Component<IProps> {
    renderActions() {
        const { onRetry } = this.props;
        return (
            <div className="c-ErrorAlert-actions">
                {onRetry ? (
                    <>
                        {/* eslint-disable-next-line */}
                        <a onClick={() => onRetry()}>{"Retry"}</a>
                        <Divider type="vertical" />
                    </>
                ) : null}
                {/* eslint-disable-next-line */}
                <a onClick={() => window.location.reload()}>
                    {"Reload the page"}
                </a>
            </div>
        );
    }
    render() {
        return (
            <Alert
                message={this.props.message}
                description={this.renderActions()}
                type="error"
                showIcon={true}
            />
        );
    }
}
