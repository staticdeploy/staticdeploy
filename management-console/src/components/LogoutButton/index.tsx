import Icon from "antd/lib/icon";
import Tooltip from "antd/lib/tooltip";
import React from "react";

import AuthService from "../../common/authService/AuthService";
import "./index.css";

interface IProps {
    authService: AuthService;
}

export default class LogoutButton extends React.Component<IProps> {
    render() {
        return (
            <Tooltip title="Logout" placement="right">
                <div
                    className="c-LogoutButton"
                    onClick={() => this.props.authService.logout()}
                >
                    <Icon type="logout" />
                </div>
            </Tooltip>
        );
    }
}
