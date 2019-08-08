import Tooltip, { TooltipProps } from "antd/es/tooltip";
import classnames from "classnames";
import React from "react";

import "./index.css";

interface IProps {
    className?: string;
    children: React.ReactNode;
    tooltipPlacement?: TooltipProps["placement"];
}

export default class TruncatedText extends React.Component<IProps> {
    render() {
        const { children, className, tooltipPlacement } = this.props;
        return (
            <Tooltip title={children} placement={tooltipPlacement}>
                <div className={classnames("c-TruncatedText", className)}>
                    {children}
                </div>
            </Tooltip>
        );
    }
}
