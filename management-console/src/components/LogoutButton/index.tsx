import Icon from "antd/lib/icon";
import Tooltip from "antd/lib/tooltip";
import React from "react";

import AuthService from "../../common/AuthService";
import "./index.css";

interface IProps {
    authService: AuthService;
}

export default class LogoutButton extends React.Component<IProps> {
    render() {
        const { authService } = this.props;
        return authService.authEnforced ? (
            <Tooltip title="Logout" placement="right">
                <div
                    className="c-LogoutButton"
                    onClick={() => authService.logout()}
                >
                    <Icon type="logout" />
                </div>
            </Tooltip>
        ) : null;
    }
}
